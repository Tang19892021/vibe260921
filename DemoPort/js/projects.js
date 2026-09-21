/*
 * 사이트에 표시되는 데이터는 모두 이 파일에서 관리합니다.
 * - PROFILE: 개발자 정보 (비워 두면 해당 항목은 화면에 나타나지 않음)
 * - PROJECTS: 프로젝트 목록. 항목 하나를 추가하면 카드와 상세 모달이 자동으로 생성됩니다.
 */

const PROFILE = {
  name: "허태영",
  email: "paxyoungcana@gmail.com",
  github: "",   // 예: "https://github.com/아이디"  (비워 두면 숨김)
  photo: "",    // 예: "assets/img/profile.jpg"      (비워 두면 이니셜 아바타 "허" 표시)
};

const PROJECTS = [
  {
    id: "snake",
    title: "뱀 게임: 나 vs AI",
    summary: "사람이 조종하는 뱀과 AI 뱀이 사과를 두고 경쟁하는 Python 게임",
    tags: ["Python", "tkinter", "BFS", "AI"],
    categories: ["Python", "바이브코딩"],
    thumb: "assets/img/snake.png",
    thumbSize: [600, 431],
    overview:
      "tkinter로 만든 데스크톱 뱀 게임입니다. 초록 뱀(나)과 주황 뱀(AI)이 판 위의 사과를 두고 경쟁하며, " +
      "사과 10개를 먼저 먹거나 상대가 부딪히면 승부가 갈립니다.",
    features: [
      "AI가 BFS로 사과까지의 거리와 이동 가능한 빈 공간을 계산해 방향을 선택",
      "갇힐 만큼 좁은 방향과 상대 머리와의 정면충돌 위험이 있는 칸을 피함",
      "벽·자기 몸·상대 몸 충돌과 정면충돌 처리, 승/패/무승부 전적 표시",
      "방향키·WASD 조작, 일시정지(Space), 재시작(R)",
    ],
    process:
      "'뱀 게임 만들어줘'라는 한 줄 요청에서 시작해, '사람과 AI가 경쟁하게 해줘'로 요구사항을 바꿔 가며 완성했습니다. " +
      "화면 없이 AI끼리 100판을 돌려 오류가 없는지 확인했습니다.",
    learned:
      "충돌·승패 규칙을 한 곳에 모아 두면 요구사항이 바뀌어도 AI를 붙이기 쉽다는 점, " +
      "화면 없이 시뮬레이션으로 로직을 검증하는 방법.",
    demo: null,
    run: "python snake.py   (표준 라이브러리만 사용하므로 별도 설치가 필요 없습니다)",
    demoNote: "Python 데스크톱 앱이라 브라우저에서는 실행할 수 없습니다. 소스를 내려받아 로컬에서 실행하세요.",
    source: "projects/snake/snake.py",
    images: [{ src: "assets/img/snake.png", alt: "뱀 게임 실행 화면: 초록 뱀(나)과 주황 뱀(AI)이 사과를 향해 이동 중" }],
  },
  {
    id: "tetris",
    title: "테트리스",
    summary: "블록이 파편으로 터지는 손맛에 집중한 HTML5 테트리스",
    tags: ["HTML5", "Canvas", "CSS3", "JavaScript"],
    categories: ["HTML5", "바이브코딩"],
    thumb: "assets/img/tetris.png",
    thumbSize: [800, 500],
    overview:
      "HTML5 Canvas로 만든 테트리스입니다. 줄을 지우면 블록이 하얗게 번쩍인 뒤 화면 전체로 파편이 흩어지고, " +
      "화면이 흔들리며 콤보가 쌓입니다. 파일 하나로 동작합니다.",
    features: [
      "7종 블록을 한 묶음씩 섞어 내보내는 방식, 고스트 블록, 홀드, 다음 블록 3개 미리보기",
      "줄 삭제 시 파편·충격파·화면 흔들림·콤보 팝업 이펙트",
      "WebAudio로 합성한 효과음 (M 키로 음소거)",
      "모바일 터치 버튼, 고해상도 화면 대응",
      "최고 점수를 브라우저에 저장",
    ],
    process:
      "단일 HTML 파일로 시작해 '블록이 잘 부서지게'라는 요청으로 이펙트를 확장했습니다. " +
      "헤드리스 브라우저로 줄 삭제 로직과 이펙트 화면을 검증했습니다.",
    learned:
      "게임 로직과 이펙트를 분리해 두면 연출을 바꿔도 규칙이 깨지지 않는다는 점, " +
      "외부 라이브러리 없이 Canvas와 WebAudio만으로도 충분히 손맛을 낼 수 있다는 점.",
    demo: {
      type: "iframe",
      url: "projects/tetris/tetris.html",
      hint: "게임 화면을 한 번 클릭하면 키보드 조작이 활성화됩니다. (← → 이동, ↑ 회전, Space 하드 드롭, C 홀드)",
    },
    source: "projects/tetris/tetris.html",
    images: [{ src: "assets/img/tetris.png", alt: "테트리스 플레이 화면: 두 줄이 지워지며 파편이 흩어지고 DOUBLE! 문구가 표시됨" }],
  },
];
