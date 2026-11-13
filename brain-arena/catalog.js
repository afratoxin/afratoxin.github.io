// Add every new game here with one of the five category IDs.
window.BrainArenaCatalog = {
  "categories": [
    {
      "id": "genius",
      "title": "지니어스",
      "english": "THE GENIUS",
      "description": "관찰과 추론, 심리와 전략의 승부",
      "color": "#c9b3ef"
    },
    {
      "id": "devils-plan",
      "title": "데블스플랜",
      "english": "THE DEVIL'S PLAN",
      "description": "기억과 계산으로 찾아내는 최선의 선택",
      "color": "#e6b786"
    },
    {
      "id": "bloody-game",
      "title": "피의게임",
      "english": "BLOODY GAME",
      "description": "기억력과 공간 감각을 시험하는 생존 퍼즐",
      "color": "#efa1a8"
    },
    {
      "id": "university-war",
      "title": "대학전쟁",
      "english": "UNIVERSITY WAR",
      "description": "숫자와 논리로 겨루는 두뇌 대결",
      "color": "#95c7ee"
    },
    {
      "id": "original",
      "title": "자체제작",
      "english": "BRAIN ARENA ORIGINALS",
      "description": "새로운 규칙으로 만나는 오리지널 게임",
      "color": "#80dfc3"
    }
  ],
  "games": [
    {
      "id": "memory-poker",
      "category": "devils-plan",
      "title": "기억 포커",
      "description": "16장을 20초 동안 기억하고 두 장을 선택하세요. 공유 카드와 만든 패가 120가지 선택 중 몇 위인지 확인합니다.",
      "tag": "혼자 플레이 · 기억과 포커",
      "href": "../memory-poker/"
    },
    {
      "id": "expression-archery",
      "category": "university-war",
      "title": "수식 양궁",
      "description": "숫자 카드 네 장으로 과녁을 적중시키세요. 한 번 맞힐 때마다 새 카드를 골라 25점에 도전합니다.",
      "tag": "혼자 플레이 · 3분 도전 / 자유 연습",
      "href": "../expression-archery/"
    },
    {
      "id": "rectangle-count",
      "category": "devils-plan",
      "title": "네모 세기",
      "description": "불규칙한 문제판 안에서 숫자의 합이 타깃 넘버와 같은 모든 네모를 찾으세요. 분수·음수·구멍·대칭 등 7가지 유형에 도전하세요.",
      "tag": "혼자 플레이 · 데블스 플랜 3 / 확장 문제 7종",
      "href": "../rectangle-count/"
    },
    {
      "id": "formula-death-note",
      "category": "university-war",
      "title": "수식 데스노트",
      "description": "열두 장의 숫자 카드로 목표값을 만든 뒤, 남은 카드와 단서로 세 자리 암호를 찾아내세요.",
      "tag": "혼자 플레이 · 5라운드 / 코드 추리",
      "href": "../formula-death-note/"
    },
    {
      "id": "echo-maze",
      "category": "original",
      "title": "잔향 미로",
      "description": "크기에 따라 10~30초 뒤 사라지는 미로의 벽. 기억과 잔향 탐지로 세 조각을 모으고, 에너지가 꺼지기 전에 탈출하세요.",
      "tag": "혼자 플레이 · 오리지널 / 난이도 3단계",
      "href": "../echo-maze/"
    },
    {
      "id": "mix-and-match",
      "category": "bloody-game",
      "title": "믹스 앤 매치",
      "description": "번갈아 나타나는 노란 선 조각을 머릿속으로 겹치세요. 두 자리 숫자 A와 B를 완성하고 합을 맞힙니다.",
      "tag": "혼자 플레이 · 피의 게임 3 / 5라운드",
      "href": "../mix-and-match/"
    },
    {
      "id": "mix-and-match-2",
      "category": "bloody-game",
      "title": "믹스 앤 매치 II",
      "description": "번갈아 나타나는 검정 격자 조각을 겹쳐 2~4글자 단어를 찾으세요. 정답 선언 후 5초 안에 답합니다.",
      "tag": "혼자 플레이 · 피의 게임 X / 12라운드",
      "href": "../mix-and-match-2/"
    },
    {
      "id": "memory-30",
      "category": "bloody-game",
      "title": "메모리30",
      "description": "30개 명제를 기억하고 숨겨진 연결을 찾으세요. 두세 개의 사실을 조합해 4지선다 퀴즈를 풉니다.",
      "tag": "혼자 플레이 · 피의 게임 3 / 2라운드",
      "href": "../memory-30/"
    },
    {
      "id": "formula-maze",
      "category": "bloody-game",
      "title": "수식미로",
      "description": "16개의 숫자를 기억한 뒤, 알파벳판에서 길을 이으세요. 출발부터 도착까지 모든 숫자의 합을 목표값과 맞춥니다.",
      "tag": "혼자 플레이 · 피의 게임 3 / 3라운드 5문제",
      "href": "../formula-maze/"
    },
    {
      "id": "maze-code",
      "category": "bloody-game",
      "title": "미로코드",
      "description": "3D 미로 속 물음표는 지도 위의 어디일까요? 벽과 갈림길을 비교해 현재 위치의 좌표를 찾아내세요.",
      "tag": "혼자 플레이 · 피의 게임 2 / 2개 지도 · 6문제",
      "href": "../maze-code/"
    }
  ]
};
