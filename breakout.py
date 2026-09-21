"""tkinter 블록깨기(Breakout) 게임

조작법
  - 마우스 이동 또는 ← → (A / D) : 패들 이동
  - 스페이스 / 마우스 클릭      : 공 발사, 게임 중에는 일시정지
  - R                          : 재시작
"""
import math
import random
import tkinter as tk

WIDTH, HEIGHT = 640, 520
FPS_DELAY = 16  # ms (약 60 FPS)

PADDLE_W, PADDLE_H = 100, 14
PADDLE_Y = HEIGHT - 40
PADDLE_SPEED = 9

BALL_R = 8
BASE_SPEED = 5.0
MAX_SPEED = 10.0

BRICK_COLS, BRICK_ROWS = 10, 6
BRICK_W, BRICK_H, BRICK_GAP = 58, 20, 4
BRICK_TOP = 60
BRICK_LEFT = (WIDTH - (BRICK_COLS * (BRICK_W + BRICK_GAP) - BRICK_GAP)) // 2
ROW_COLORS = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6"]
ROW_POINTS = [60, 50, 40, 30, 20, 10]

START_LIVES = 3


class Breakout:
    def __init__(self, root):
        self.root = root
        root.title("블록깨기")
        root.resizable(False, False)

        self.canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#101820", highlightthickness=0)
        self.canvas.pack()

        self.keys = set()
        root.bind("<KeyPress>", lambda e: self.keys.add(e.keysym.lower()))
        root.bind("<KeyRelease>", lambda e: self.keys.discard(e.keysym.lower()))
        root.bind("<space>", lambda e: self.action())
        root.bind("<r>", lambda e: self.new_game())
        root.bind("<R>", lambda e: self.new_game())
        self.canvas.bind("<Motion>", self.on_mouse_move)
        self.canvas.bind("<Button-1>", lambda e: self.action())

        self.paddle = self.canvas.create_rectangle(0, PADDLE_Y, PADDLE_W, PADDLE_Y + PADDLE_H,
                                                   fill="#ecf0f1", outline="")
        self.ball = self.canvas.create_oval(0, 0, BALL_R * 2, BALL_R * 2, fill="#f39c12", outline="")
        self.hud = self.canvas.create_text(10, 10, anchor="nw", fill="white", font=("Malgun Gothic", 13, "bold"))
        self.message = self.canvas.create_text(WIDTH // 2, HEIGHT // 2 + 60, fill="white", justify="center",
                                               font=("Malgun Gothic", 16, "bold"))

        self.bricks = []
        self.new_game()
        self.tick()

    # ---------- 게임 상태 ----------
    def new_game(self):
        self.score = 0
        self.lives = START_LIVES
        self.level = 1
        self.build_bricks()
        self.reset_ball()

    def build_bricks(self):
        for brick in self.bricks:
            self.canvas.delete(brick["id"])
        self.bricks = []
        for row in range(BRICK_ROWS):
            for col in range(BRICK_COLS):
                x1 = BRICK_LEFT + col * (BRICK_W + BRICK_GAP)
                y1 = BRICK_TOP + row * (BRICK_H + BRICK_GAP)
                item = self.canvas.create_rectangle(x1, y1, x1 + BRICK_W, y1 + BRICK_H,
                                                    fill=ROW_COLORS[row], outline="")
                self.bricks.append({"id": item, "box": (x1, y1, x1 + BRICK_W, y1 + BRICK_H),
                                    "points": ROW_POINTS[row]})

    def reset_ball(self):
        """공을 패들 위에 올려두고 발사 대기 상태로 전환."""
        self.state = "ready"  # ready / playing / paused / gameover
        self.speed = min(BASE_SPEED + (self.level - 1) * 0.5, MAX_SPEED)
        self.paddle_x = (WIDTH - PADDLE_W) / 2
        self.x = self.paddle_x + PADDLE_W / 2
        self.y = PADDLE_Y - BALL_R
        self.dx = self.dy = 0.0
        self.set_message("스페이스 또는 클릭으로 발사")
        self.draw()

    def action(self):
        if self.state == "ready":
            angle = math.radians(random.uniform(-30, 30))
            self.dx = self.speed * math.sin(angle)
            self.dy = -self.speed * math.cos(angle)
            self.state = "playing"
            self.set_message("")
        elif self.state == "playing":
            self.state = "paused"
            self.set_message("일시정지\n스페이스를 누르면 계속")
        elif self.state == "paused":
            self.state = "playing"
            self.set_message("")
        elif self.state == "gameover":
            self.new_game()

    def set_message(self, text):
        self.canvas.itemconfigure(self.message, text=text)

    # ---------- 입력 ----------
    def on_mouse_move(self, event):
        if self.state in ("ready", "playing"):
            self.move_paddle_to(event.x - PADDLE_W / 2)

    def move_paddle_to(self, left):
        self.paddle_x = max(0, min(WIDTH - PADDLE_W, left))
        if self.state == "ready":
            self.x = self.paddle_x + PADDLE_W / 2

    # ---------- 메인 루프 ----------
    def tick(self):
        if self.state in ("ready", "playing"):
            move = 0
            if "left" in self.keys or "a" in self.keys:
                move -= PADDLE_SPEED
            if "right" in self.keys or "d" in self.keys:
                move += PADDLE_SPEED
            if move:
                self.move_paddle_to(self.paddle_x + move)
        if self.state == "playing":
            self.update_ball()
        self.draw()
        self.root.after(FPS_DELAY, self.tick)

    def update_ball(self):
        self.x += self.dx
        self.y += self.dy

        # 벽
        if self.x - BALL_R <= 0:
            self.x, self.dx = BALL_R, abs(self.dx)
        elif self.x + BALL_R >= WIDTH:
            self.x, self.dx = WIDTH - BALL_R, -abs(self.dx)
        if self.y - BALL_R <= 0:
            self.y, self.dy = BALL_R, abs(self.dy)

        self.check_paddle()
        self.check_bricks()

        # 바닥으로 떨어짐
        if self.y - BALL_R > HEIGHT:
            self.lives -= 1
            if self.lives <= 0:
                self.state = "gameover"
                self.set_message(f"GAME OVER\n최종 점수: {self.score}\n스페이스 또는 R로 다시 시작")
            else:
                self.reset_ball()

    def check_paddle(self):
        if self.dy <= 0:
            return
        bottom = self.y + BALL_R
        if (PADDLE_Y <= bottom <= PADDLE_Y + PADDLE_H + self.dy
                and self.paddle_x - BALL_R <= self.x <= self.paddle_x + PADDLE_W + BALL_R):
            # 맞은 위치에 따라 반사각 결정 (가운데 = 수직, 가장자리 = 최대 60도)
            hit = (self.x - (self.paddle_x + PADDLE_W / 2)) / (PADDLE_W / 2)
            hit = max(-1.0, min(1.0, hit))
            angle = math.radians(hit * 60)
            self.dx = self.speed * math.sin(angle)
            self.dy = -self.speed * math.cos(angle)
            self.y = PADDLE_Y - BALL_R

    def check_bricks(self):
        for brick in self.bricks:
            x1, y1, x2, y2 = brick["box"]
            nearest_x = max(x1, min(self.x, x2))
            nearest_y = max(y1, min(self.y, y2))
            if (self.x - nearest_x) ** 2 + (self.y - nearest_y) ** 2 > BALL_R ** 2:
                continue

            # 겹침이 더 적은 축으로 튕김
            overlap_x = min(self.x + BALL_R - x1, x2 - (self.x - BALL_R))
            overlap_y = min(self.y + BALL_R - y1, y2 - (self.y - BALL_R))
            if overlap_x < overlap_y:
                self.dx = abs(self.dx) if self.x > (x1 + x2) / 2 else -abs(self.dx)
            else:
                self.dy = abs(self.dy) if self.y > (y1 + y2) / 2 else -abs(self.dy)

            self.canvas.delete(brick["id"])
            self.bricks.remove(brick)
            self.score += brick["points"]

            if not self.bricks:
                self.next_level()
            return  # 한 프레임에 블록 하나만 처리

    def next_level(self):
        self.level += 1
        self.lives = min(self.lives + 1, 5)
        self.build_bricks()
        self.reset_ball()
        self.set_message(f"레벨 {self.level}\n스페이스 또는 클릭으로 발사")

    # ---------- 그리기 ----------
    def draw(self):
        c = self.canvas
        c.coords(self.paddle, self.paddle_x, PADDLE_Y, self.paddle_x + PADDLE_W, PADDLE_Y + PADDLE_H)
        c.coords(self.ball, self.x - BALL_R, self.y - BALL_R, self.x + BALL_R, self.y + BALL_R)
        c.itemconfigure(self.hud, text=f"점수 {self.score}    레벨 {self.level}    목숨 {'♥' * self.lives}")


if __name__ == "__main__":
    root = tk.Tk()
    Breakout(root)
    root.mainloop()
