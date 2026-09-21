"""
네이버 검색 결과 신문기사 크롤러 - PyQt6 GUI 버전

실행
    python news_crawler_gui.py

필요한 패키지
    pip install PyQt6 requests beautifulsoup4 openpyxl

크롤링 로직은 같은 폴더의 news_crawler.py 를 그대로 사용합니다.
(개인 학습용으로 소량만 수집하고, 사이트 약관과 기사 저작권을 지켜 주세요.)
"""

import html
import sys
import time

import requests
from PyQt6.QtCore import Qt, QThread, QUrl, pyqtSignal
from PyQt6.QtGui import QDesktopServices, QTextCursor
from PyQt6.QtWidgets import (
    QAbstractItemView, QApplication, QComboBox, QDoubleSpinBox, QFileDialog, QGridLayout,
    QGroupBox, QHBoxLayout, QHeaderView, QLabel, QLineEdit, QMainWindow, QMessageBox,
    QPlainTextEdit, QProgressBar, QPushButton, QSpinBox, QSplitter, QTableWidget,
    QTableWidgetItem, QTextBrowser, QVBoxLayout, QWidget,
)

import news_crawler as nc

SOURCES = [("전체 (네이버 뉴스 + 언론사 원문)", "all"), ("네이버 뉴스만", "naver"), ("언론사 원문만", "press")]

STYLE = """
QPushButton#primary { background: #2563eb; color: white; border: 0; padding: 8px 20px; border-radius: 6px; font-weight: bold; }
QPushButton#primary:hover { background: #1d4ed8; }
QPushButton#primary:disabled { background: #a9bfee; }
QPushButton#danger { background: #dc2626; color: white; border: 0; padding: 8px 20px; border-radius: 6px; font-weight: bold; }
QPushButton#danger:hover { background: #b91c1c; }
QPushButton#danger:disabled { background: #efb0b0; }
QPushButton { padding: 6px 14px; }
QGroupBox { font-weight: bold; margin-top: 10px; }
QGroupBox::title { subcontrol-origin: margin; left: 10px; padding: 0 4px; }
"""


class CrawlWorker(QThread):
    """네트워크 요청은 화면이 멈추지 않도록 별도 스레드에서 실행한다."""

    log = pyqtSignal(str)
    total = pyqtSignal(int)            # 수집 대상으로 찾은 기사 링크 수
    article = pyqtSignal(dict)         # 기사 하나를 수집할 때마다
    done = pyqtSignal(int, bool)       # (수집한 기사 수, 사용자가 중지했는가)
    failed = pyqtSignal(str)

    def __init__(self, url, limit, source, delay):
        super().__init__()
        self.url, self.limit, self.source, self.delay = url, limit, source, delay

    def _wait(self, seconds):
        """중지 요청에 바로 반응하도록 잘게 나눠서 기다린다."""
        end = time.monotonic() + seconds
        while time.monotonic() < end and not self.isInterruptionRequested():
            self.msleep(50)

    def run(self):
        try:
            session = requests.Session()
            session.headers.update(nc.HEADERS)

            self.log.emit("검색 결과 페이지를 가져오는 중...")
            try:
                soup = nc.get_soup(session, self.url)
            except requests.RequestException as e:
                self.failed.emit(f"검색 페이지를 가져오지 못했습니다.\n{e}")
                return

            links = nc.collect_links(soup, self.url, self.source)
            self.total.emit(len(links))
            self.log.emit(f"기사 링크 {len(links)}개를 찾았습니다.")
            if not links:
                self.failed.emit("기사 링크를 찾지 못했습니다.\nURL이 네이버 검색 결과인지, 출처 설정이 맞는지 확인해 주세요.")
                return

            count, seen_titles = 0, set()
            for _kind, url in links:
                if count >= self.limit or self.isInterruptionRequested():
                    break
                self._wait(self.delay)
                if self.isInterruptionRequested():
                    break
                try:
                    item = nc.extract_article(nc.get_soup(session, url), url)
                except requests.RequestException as e:
                    self.log.emit(f"[건너뜀] 요청 실패: {url} ({e})")
                    continue
                if not item:
                    self.log.emit(f"[건너뜀] 본문을 찾지 못함: {url}")
                    continue
                if item["title"] in seen_titles:   # 네이버 뉴스와 언론사 원문이 같은 기사인 경우
                    continue
                seen_titles.add(item["title"])
                count += 1
                self.article.emit(item)
            self.done.emit(count, self.isInterruptionRequested())
        except Exception as e:   # 예상하지 못한 오류로 앱이 죽지 않도록
            self.failed.emit(f"예상하지 못한 오류가 발생했습니다.\n{type(e).__name__}: {e}")


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("뉴스 기사 크롤러")
        self.resize(1120, 780)
        self.results = []
        self.worker = None

        central = QWidget()
        self.setCentralWidget(central)
        root = QVBoxLayout(central)
        root.addWidget(self._build_options())
        root.addWidget(self._build_results(), 1)
        root.addLayout(self._build_footer())
        self._set_running(False)
        self.show_placeholder()

    # ---------- 화면 구성 ----------
    def _build_options(self):
        box = QGroupBox("검색 설정")
        grid = QGridLayout(box)

        self.url_edit = QLineEdit(nc.DEFAULT_URL)
        self.url_edit.setPlaceholderText("기사 링크를 찾을 네이버 검색 URL")
        self.url_edit.setClearButtonEnabled(True)
        self.url_edit.returnPressed.connect(self.start)

        self.limit_spin = QSpinBox()
        self.limit_spin.setRange(1, 50)
        self.limit_spin.setValue(10)
        self.limit_spin.setSuffix(" 개")

        self.source_combo = QComboBox()
        for label, value in SOURCES:
            self.source_combo.addItem(label, value)

        self.delay_spin = QDoubleSpinBox()
        self.delay_spin.setRange(0.5, 10.0)
        self.delay_spin.setSingleStep(0.5)
        self.delay_spin.setValue(1.0)
        self.delay_spin.setSuffix(" 초")
        self.delay_spin.setToolTip("기사 한 건을 요청할 때마다 쉬는 시간. 서버에 부담을 주지 않도록 너무 줄이지 마세요.")

        self.start_btn = QPushButton("수집 시작")
        self.start_btn.setObjectName("primary")
        self.start_btn.clicked.connect(self.start)
        self.stop_btn = QPushButton("중지")
        self.stop_btn.setObjectName("danger")
        self.stop_btn.clicked.connect(self.stop)

        grid.addWidget(QLabel("검색 URL"), 0, 0)
        grid.addWidget(self.url_edit, 0, 1, 1, 7)
        grid.addWidget(QLabel("수집 개수"), 1, 0)
        grid.addWidget(self.limit_spin, 1, 1)
        grid.addWidget(QLabel("출처"), 1, 2)
        grid.addWidget(self.source_combo, 1, 3)
        grid.addWidget(QLabel("요청 간격"), 1, 4)
        grid.addWidget(self.delay_spin, 1, 5)
        grid.addWidget(self.start_btn, 1, 6)
        grid.addWidget(self.stop_btn, 1, 7)
        grid.setColumnStretch(3, 1)
        return box

    def _build_results(self):
        splitter = QSplitter(Qt.Orientation.Horizontal)

        self.table = QTableWidget(0, 3)
        self.table.setHorizontalHeaderLabels(["제목", "언론사", "날짜"])
        self.table.setEditTriggers(QAbstractItemView.EditTrigger.NoEditTriggers)
        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        self.table.setAlternatingRowColors(True)
        self.table.verticalHeader().setVisible(False)
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(0, QHeaderView.ResizeMode.Stretch)
        header.setSectionResizeMode(1, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(2, QHeaderView.ResizeMode.ResizeToContents)
        self.table.itemSelectionChanged.connect(self.on_select)
        self.table.cellDoubleClicked.connect(lambda *_: self.open_link())

        right = QWidget()
        right_layout = QVBoxLayout(right)
        right_layout.setContentsMargins(0, 0, 0, 0)
        self.detail = QTextBrowser()
        self.detail.setOpenExternalLinks(True)
        self.detail.document().setDefaultStyleSheet("p { margin-bottom: 10px; line-height: 150%; }")
        buttons = QHBoxLayout()
        self.open_btn = QPushButton("원문 열기")
        self.open_btn.clicked.connect(self.open_link)
        self.copy_btn = QPushButton("본문 복사")
        self.copy_btn.clicked.connect(self.copy_body)
        buttons.addStretch(1)
        buttons.addWidget(self.open_btn)
        buttons.addWidget(self.copy_btn)
        right_layout.addWidget(self.detail, 1)
        right_layout.addLayout(buttons)

        splitter.addWidget(self.table)
        splitter.addWidget(right)
        splitter.setStretchFactor(0, 5)
        splitter.setStretchFactor(1, 6)
        return splitter

    def _build_footer(self):
        layout = QVBoxLayout()

        row = QHBoxLayout()
        self.progress = QProgressBar()
        self.progress.setTextVisible(True)
        self.status = QLabel("대기 중")
        self.xlsx_btn = QPushButton("엑셀 저장")
        self.xlsx_btn.setToolTip("Excel(.xlsx) 파일로 저장합니다.")
        self.xlsx_btn.clicked.connect(lambda: self.save_file("xlsx"))
        self.csv_btn = QPushButton("CSV 저장")
        self.csv_btn.clicked.connect(lambda: self.save_file("csv"))
        self.json_btn = QPushButton("JSON 저장")
        self.json_btn.clicked.connect(lambda: self.save_file("json"))
        row.addWidget(self.progress, 1)
        row.addWidget(self.status)
        row.addWidget(self.xlsx_btn)
        row.addWidget(self.csv_btn)
        row.addWidget(self.json_btn)

        self.log_view = QPlainTextEdit()
        self.log_view.setReadOnly(True)
        self.log_view.setMaximumHeight(90)
        self.log_view.setMaximumBlockCount(500)
        self.log_view.setPlaceholderText("진행 로그가 여기에 표시됩니다.")

        layout.addLayout(row)
        layout.addWidget(self.log_view)
        return layout

    # ---------- 상태 ----------
    def _set_running(self, running):
        for w in (self.url_edit, self.limit_spin, self.source_combo, self.delay_spin, self.start_btn):
            w.setEnabled(not running)
        self.stop_btn.setEnabled(running)
        self._refresh_actions()

    def _refresh_actions(self):
        has_results = bool(self.results)
        for w in (self.xlsx_btn, self.csv_btn, self.json_btn):
            w.setEnabled(has_results)
        has_selection = self.current_article() is not None
        for w in (self.open_btn, self.copy_btn):
            w.setEnabled(has_selection)

    def append_log(self, text):
        self.log_view.appendPlainText(f"[{time.strftime('%H:%M:%S')}] {text}")

    # ---------- 수집 ----------
    def start(self):
        if self.worker is not None and self.worker.isRunning():
            return
        url = self.url_edit.text().strip()
        if not url.startswith(("http://", "https://")):
            QMessageBox.warning(self, "URL 확인", "http:// 또는 https:// 로 시작하는 URL을 입력해 주세요.")
            return

        self.results.clear()
        self.table.setRowCount(0)
        self.log_view.clear()
        self.show_placeholder()
        limit = self.limit_spin.value()
        self.progress.setRange(0, 0)   # 링크를 찾는 동안은 '진행 중' 표시
        self.status.setText("링크 수집 중...")
        self._set_running(True)

        self.worker = CrawlWorker(url, limit, self.source_combo.currentData(), self.delay_spin.value())
        self.worker.log.connect(self.append_log)
        self.worker.total.connect(lambda n: self.on_total(n, limit))
        self.worker.article.connect(self.on_article)
        self.worker.done.connect(self.on_done)
        self.worker.failed.connect(self.on_failed)
        self.worker.start()

    def stop(self):
        if self.worker is not None and self.worker.isRunning():
            self.worker.requestInterruption()
            self.stop_btn.setEnabled(False)
            self.status.setText("중지하는 중...")

    def on_total(self, found, limit):
        target = max(1, min(found, limit))
        self.progress.setRange(0, target)
        self.progress.setValue(0)
        self.progress.setFormat("%v / %m")
        self.status.setText("기사 수집 중...")

    def on_article(self, item):
        self.results.append(item)
        row = self.table.rowCount()
        self.table.insertRow(row)
        for col, key in enumerate(("title", "press", "date")):
            cell = QTableWidgetItem(item[key])
            cell.setToolTip(item[key])
            self.table.setItem(row, col, cell)
        self.progress.setValue(min(len(self.results), self.progress.maximum()))
        if row == 0:
            self.table.selectRow(0)
        self._refresh_actions()

    def on_done(self, count, stopped):
        self._set_running(False)
        self.progress.setRange(0, 1)
        self.progress.setValue(1 if count else 0)
        self.progress.setFormat("")
        text = f"중지됨: {count}개 수집" if stopped else f"완료: {count}개 수집"
        self.status.setText(text)
        self.append_log(text)
        if not count and not stopped:
            QMessageBox.information(self, "수집 결과 없음", "본문을 수집한 기사가 없습니다.\n로그에서 건너뛴 이유를 확인해 주세요.")

    def on_failed(self, message):
        self._set_running(False)
        self.progress.setRange(0, 1)
        self.progress.setValue(0)
        self.progress.setFormat("")
        self.status.setText("실패")
        self.append_log(message.replace("\n", " "))
        QMessageBox.warning(self, "수집 실패", message)

    # ---------- 결과 보기 ----------
    def current_article(self):
        row = self.table.currentRow()
        if 0 <= row < len(self.results) and self.table.selectedItems():
            return self.results[row]
        return None

    def show_placeholder(self):
        self.detail.setHtml("<p style='color:gray'>기사를 선택하면 본문이 여기에 표시됩니다.</p>")

    def on_select(self):
        item = self.current_article()
        self._refresh_actions()
        if item is None:
            return
        esc = html.escape
        body = "".join(f"<p>{esc(line)}</p>" for line in item["body"].split("\n"))
        url = esc(item["url"], quote=True)
        self.detail.setHtml(
            f"<h2>{esc(item['title'])}</h2>"
            f"<p style='color:gray'>{esc(item['press'])} · {esc(item['date'])}<br>"
            f"<a href='{url}'>{url}</a></p><hr>{body}"
        )
        self.detail.moveCursor(QTextCursor.MoveOperation.Start)

    def open_link(self):
        item = self.current_article()
        if item:
            QDesktopServices.openUrl(QUrl(item["url"]))

    def copy_body(self):
        item = self.current_article()
        if item:
            QApplication.clipboard().setText(f"{item['title']}\n\n{item['body']}")
            self.status.setText("본문을 클립보드에 복사했습니다.")

    # ---------- 저장 ----------
    def save_file(self, kind):
        if not self.results:
            return
        label, ext, writer = {
            "xlsx": ("Excel 파일 (*.xlsx)", ".xlsx", nc.save_xlsx),
            "csv": ("CSV 파일 (*.csv)", ".csv", nc.save_csv),
            "json": ("JSON 파일 (*.json)", ".json", nc.save_json),
        }[kind]
        path, _ = QFileDialog.getSaveFileName(self, "결과 저장", "news_result" + ext, label)
        if not path:
            return
        if not path.lower().endswith(ext):   # 확장자를 지우고 저장한 경우 보정
            path += ext
        try:
            writer(self.results, path)
        except ImportError:
            QMessageBox.critical(self, "패키지 필요", "엑셀 저장에는 openpyxl이 필요합니다.\n\npip install openpyxl")
            return
        except PermissionError:
            QMessageBox.critical(self, "저장 실패", f"파일을 쓸 수 없습니다.\n엑셀 등에서 같은 파일이 열려 있다면 닫고 다시 시도해 주세요.\n\n{path}")
            return
        except OSError as e:
            QMessageBox.critical(self, "저장 실패", f"파일을 저장하지 못했습니다.\n{e}")
            return
        self.status.setText(f"저장했습니다: {path}")
        self.append_log(f"{len(self.results)}개 기사를 저장: {path}")

    def closeEvent(self, event):
        if self.worker is not None and self.worker.isRunning():
            self.worker.requestInterruption()
            if not self.worker.wait(15000):   # 진행 중인 요청이 끝나길 기다린다
                self.worker.terminate()
                self.worker.wait()
        super().closeEvent(event)


def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    app.setStyleSheet(STYLE)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
