import random
import tkinter as tk
from collections import deque

CELL = 20
COLS = 30
ROWS = 20
WIDTH = CELL * COLS
HEIGHT = CELL * ROWS
START_DELAY = 130  # 밀리초
MIN_DELAY = 60
NUM_FOOD = 3       # 판 위에 동시에 놓이는 사과 수
TARGET = 10        # 먼저 이 개수만큼 먹으면 승리

MOVES = [(0, -1), (0, 1), (-1, 0), (1, 0)]
KEYS = {
    "Up": (0, -1), "Down": (0, 1), "Left": (-1, 0), "Right": (1, 0),
    "w": (0, -1), "s": (0, 1), "a": (-1, 0), "d": (1, 0),
}
FAR = 10**6


class Snake:
    def __init__(self, body, direction, color, head_color):
        self.body = body  # 머리가 [0]
        self.direction = direction
        self.next_direction = direction
        self.color = color
        self.head_color = head_color
        self.score = 0
        self.dead = False
        self.new_head = None


class SnakeGame:
    def __init__(self, root):
        self.root = root
        root.title("뱀 게임 - 나 vs AI")
        root.resizable(False, False)

        bar = tk.Frame(root)
        bar.pack(fill="x", padx=8, pady=2)
        self.player_var = tk.StringVar()
        self.ai_var = tk.StringVar()
        self.record_var = tk.StringVar()
        font = ("Malgun Gothic", 12, "bold")
        tk.Label(bar, textvariable=self.player_var, font=font, fg="#27ae60").pack(side="left")
        tk.Label(bar, textvariable=self.ai_var, font=font, fg="#e67e22").pack(side="left", padx=16)
        tk.Label(bar, textvariable=self.record_var, font=("Malgun Gothic", 11)).pack(side="right")

        self.canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#1e1e1e", highlightthickness=0)
        self.canvas.pack()

        root.bind("<Key>", self.on_key)
        self.wins = {"player": 0, "ai": 0, "draw": 0}
        self.reset()

    # ---------- 초기화 ----------
    def reset(self):
        self.player = Snake([(5 - i, 15) for i in range(3)], (1, 0), "#2ecc71", "#a6f3c1")
        self.ai = Snake([(24 + i, 4) for i in range(3)], (-1, 0), "#e67e22", "#f8c291")
        self.foods = []
        while len(self.foods) < NUM_FOOD:
            self.foods.append(self.random_free_cell())
        self.delay = START_DELAY
        self.game_over = False
        self.paused = False
        self.result = ("", "")
        self.update_labels()
        self.draw()
        self.root.after(self.delay, self.tick)

    def random_free_cell(self):
        taken = set(self.player.body) | set(self.ai.body) | set(self.foods)
        free = [(x, y) for x in range(COLS) for y in range(ROWS) if (x, y) not in taken]
        return random.choice(free)

    def update_labels(self):
        self.player_var.set(f"나: {self.player.score}/{TARGET}")
        self.ai_var.set(f"AI: {self.ai.score}/{TARGET}")
        self.record_var.set(f"전적  나 {self.wins['player']} : AI {self.wins['ai']}  (무 {self.wins['draw']})")

    # ---------- 입력 ----------
    def on_key(self, event):
        key = event.keysym if event.keysym in KEYS else event.char.lower()
        if key in KEYS:
            d = KEYS[key]
            # 반대 방향으로는 즉시 회전 불가
            if d != (-self.player.direction[0], -self.player.direction[1]):
                self.player.next_direction = d
        elif event.keysym == "space" and not self.game_over:
            self.paused = not self.paused
        elif key == "r" and self.game_over:
            self.reset()

    # ---------- AI ----------
    def scan(self, start, blocked):
        """start에서 갈 수 있는 칸 수와 가장 가까운 사과까지의 거리를 BFS로 구한다."""
        foods = set(self.foods)
        seen = {start}
        queue = deque([(start, 0)])
        nearest = FAR
        while queue:
            (x, y), dist = queue.popleft()
            if (x, y) in foods and nearest == FAR:
                nearest = dist
            for dx, dy in MOVES:
                nxt = (x + dx, y + dy)
                if (0 <= nxt[0] < COLS and 0 <= nxt[1] < ROWS
                        and nxt not in blocked and nxt not in seen):
                    seen.add(nxt)
                    queue.append((nxt, dist + 1))
        return len(seen), nearest

    def ai_choose(self):
        ai, foe = self.ai, self.player
        hx, hy = ai.body[0]
        blocked = set(ai.body[:-1]) | set(foe.body)  # 자기 꼬리는 이번 턴에 비워짐

        # 상대 머리가 다음에 갈 수 있는 칸 (정면충돌 위험)
        fx, fy = foe.body[0]
        danger = {(fx + dx, fy + dy) for dx, dy in MOVES
                  if (dx, dy) != (-foe.direction[0], -foe.direction[1])}

        best, best_key = None, None
        for d in MOVES:
            if d == (-ai.direction[0], -ai.direction[1]):
                continue
            t = (hx + d[0], hy + d[1])
            if not (0 <= t[0] < COLS and 0 <= t[1] < ROWS) or t in blocked:
                continue
            space, dist = self.scan(t, blocked)
            safe = space >= len(ai.body)  # 갇히지 않을 만큼 공간이 있는가
            key = (
                0 if safe else 1,
                1 if t in danger else 0,
                dist if safe else -space,
                random.random(),
            )
            if best_key is None or key < best_key:
                best, best_key = d, key
        return best or ai.direction  # 갈 곳이 없으면 그대로 직진(사망)

    # ---------- 게임 진행 ----------
    def tick(self):
        if self.game_over:
            return
        if not self.paused:
            self.step()
            self.draw()
        if not self.game_over:
            self.root.after(self.delay, self.tick)

    def step(self):
        self.ai.next_direction = self.ai_choose()
        snakes = (self.player, self.ai)

        for s in snakes:
            s.direction = s.next_direction
            hx, hy = s.body[0]
            s.new_head = (hx + s.direction[0], hy + s.direction[1])

        # 사과를 먹는 뱀은 꼬리가 비워지지 않는다
        eating = {s: s.new_head in self.foods for s in snakes}

        def occupied(s):
            return s.body if eating[s] else s.body[:-1]

        for s in snakes:
            other = self.ai if s is self.player else self.player
            head = s.new_head
            s.dead = (
                not (0 <= head[0] < COLS and 0 <= head[1] < ROWS)
                or head in occupied(s)
                or head in occupied(other)
                or head == other.new_head  # 정면충돌
            )

        for s in snakes:
            if s.dead:
                continue
            s.body.insert(0, s.new_head)
            if eating[s]:
                s.score += 1
                self.foods.remove(s.new_head)
                self.foods.append(self.random_free_cell())
            else:
                s.body.pop()

        self.delay = max(MIN_DELAY, START_DELAY - 3 * (self.player.score + self.ai.score))
        self.update_labels()

        if self.player.dead or self.ai.dead or max(s.score for s in snakes) >= TARGET:
            self.finish()

    def finish(self):
        self.game_over = True
        p, a = self.player, self.ai
        if p.dead and not a.dead:
            winner, why = "ai", "내 뱀이 부딪혔습니다"
        elif a.dead and not p.dead:
            winner, why = "player", "AI 뱀이 부딪혔습니다"
        else:
            why = "양쪽 모두 부딪혔습니다" if p.dead else f"{TARGET}개 먼저 획득"
            winner = "player" if p.score > a.score else "ai" if a.score > p.score else "draw"

        self.wins[winner] += 1
        title = {"player": "승리!", "ai": "패배...", "draw": "무승부"}[winner]
        self.result = (title, why)
        self.update_labels()
        self.draw()

    # ---------- 그리기 ----------
    def draw_cell(self, x, y, color):
        self.canvas.create_rectangle(
            x * CELL + 1, y * CELL + 1, (x + 1) * CELL - 1, (y + 1) * CELL - 1,
            fill=color, outline="",
        )

    def draw(self):
        self.canvas.delete("all")
        for x, y in self.foods:
            self.draw_cell(x, y, "#e74c3c")
        for s in (self.player, self.ai):
            for i, (x, y) in enumerate(s.body):
                self.draw_cell(x, y, s.color if i else s.head_color)

        if self.game_over:
            title, why = self.result
            self.canvas.create_text(WIDTH // 2, HEIGHT // 2 - 30, text=title,
                                    fill="white", font=("Malgun Gothic", 30, "bold"))
            self.canvas.create_text(WIDTH // 2, HEIGHT // 2 + 5, text=why,
                                    fill="#dddddd", font=("Malgun Gothic", 14))
            self.canvas.create_text(WIDTH // 2, HEIGHT // 2 + 35, text="R 키: 다시 시작",
                                    fill="#aaaaaa", font=("Malgun Gothic", 12))
        elif self.paused:
            self.canvas.create_text(WIDTH // 2, HEIGHT // 2, text="일시정지",
                                    fill="white", font=("Malgun Gothic", 28, "bold"))


if __name__ == "__main__":
    root = tk.Tk()
    SnakeGame(root)
    root.mainloop()
