let game;

function preload() {
  game = new Game(); // 게임 객체 생성
}

function setup() {
  createCanvas(800, 600); // 캔버스 크기 설정
  game.setup(); // 게임 설정
}

function draw() {
  game.draw(); // 게임 그림
}

function mousePressed() {
  game.mousePressed(); // 마우스 클릭 처리
}

function keyPressed() {
  game.keyPressed(); // 키 입력 처리
}

class Game {
  constructor() {
    this.screws = []; // 나사 객체를 담을 배열
    this.selectedScrew = null; // 선택된 나사 객체
    this.mode = "select"; // 현재 모드 ("select" 또는 "rotate")
    this.holeDepth = 100; // 구멍 깊이
    this.successed = 0; // 성공한 나사 수
    this.frame = 30; // 프레임 수
    this.isGameSuccess = false; // 게임 성공 여부
    this.isGameOver = false; // 게임 오버 여부
  }

  setup() {
    this.createScrews(); // 나사 객체 생성
    this.restartButton = createButton("다시 시작"); // 다시 시작 버튼 생성
    this.restartButton.position(width / 2 - 50, height / 2); // 버튼 위치 설정
    this.restartButton.mousePressed(this.resetGame.bind(this)); // 버튼 클릭 시 게임 리셋
    this.restartButton.hide(); // 버튼 숨기기
    this.resetTimer(); // 타이머 초기화
  }

  draw() {
    background(150); // 배경 색상 설정
    this.show(); // 게임 상태 표시

    for (let screw of this.screws) {
      screw.show(); // 각 나사 객체 표시
    }

    if (this.selectedScrew) {
      this.selectedScrew.highlight(); // 선택된 나사 하이라이트
    }
  }

  mousePressed() {
    if (this.isGameOver || this.isGameSuccess) return; // 게임 오버 또는 성공 시 무시
    this.selectedScrew = null; // 선택된 나사 초기화
    for (let screw of this.screws) {
      if (screw.isMouseOver()) { // 마우스가 나사 위에 있을 때
        this.selectedScrew = screw; // 나사 선택
        this.mode = "rotate"; // 모드 변경
        break;
      }
    }
  }

  keyPressed() {
    if (this.mode === "rotate" && this.selectedScrew) { // 회전 모드이고 나사가 선택된 경우
      if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 좌우 화살표 키 입력 시
        if (this.isGameOver || this.isGameSuccess) return; // 게임 오버 또는 성공 시 무시
        this.selectedScrew.move(); // 나사 회전
      }
    }
  }

  createScrews() {
    this.screws = []; // 나사 배열 초기화
    this.screws.push(new Screw(200, 200)); // 나사 객체 생성 및 배열에 추가
    this.screws.push(new Screw(600, 200));
    this.screws.push(new Screw(200, 400));
    this.screws.push(new Screw(600, 400));
  }

  show() {
    if (this.successed == 4) { // 모든 나사가 성공한 경우
      this.isGameSuccess = true; // 게임 성공 상태로 설정
    }

    this.displayTimer(); // 타이머 표시

    if (!this.isGameOver) { // 게임 오버가 아닌 경우
      fill(150);
      textAlign(CENTER);
      textSize(20);

      if (this.isGameSuccess) { // 게임 성공 시
        fill(255, 0, 0);
        textSize(32);
        text("게임 성공!", width / 2, height / 2 - 50); // 성공 메시지 표시
      }
    }

    for (let screw of this.screws) {
      screw.show(); // 각 나사 객체 표시
    }

    if (this.selectedScrew && !this.isGameSuccess) {
      this.selectedScrew.highlight(); // 선택된 나사 하이라이트
    }
  }

  displayTimer() {
    if (this.isGameSuccess) return; // 게임 성공 시 타이머 멈춤

    let timePassed = millis() - this.timerStart; // 경과 시간 계산
    let timeLeft = this.timeLimit - timePassed; // 남은 시간 계산
    let barWidth = map(timeLeft, 0, this.timeLimit, 0, width - 20); // 타이머 바 너비 계산

    if (timeLeft <= 0) { // 시간이 다 지난 경우
      this.gameOver(); // 게임 오버 처리
      fill(255, 0, 0);
      textSize(32);
      textAlign(CENTER);
      text("시간 초과! 게임 오버", width / 2, height / 2 - 50); // 게임 오버 메시지 표시
      this.restartButton.show(); // 다시 시작 버튼 표시
    } else if (!this.isGameSuccess) { // 게임 성공이 아닌 경우
      fill(255, 0, 0);
      rect(10, height - 100, barWidth, 20); // 타이머 바 표시
    }
  }

  gameOver() {
    this.isGameOver = true; // 게임 오버 상태로 설정
  }

  resetTimer() {
    this.timerStart = millis(); // 타이머 시작 시간 설정
    this.timeLimit = 10000; // 타이머 제한 시간 설정 (10초)
  }

  resetGame() {
    this.restartButton.hide(); // 다시 시작 버튼 숨기기
    this.successed = 0; // 성공한 나사 수 초기화
    this.selectedScrew = null; // 선택된 나사 초기화
    this.resetTimer(); // 타이머 초기화
    this.createScrews(); // 나사 객체 재생성
    this.isGameOver = false; // 게임 오버 상태 초기화
    this.isGameSuccess = false; // 게임 성공 상태 초기화
  }
}

class Screw {
  constructor(x, y) {
    this.x = x; // 나사의 x 좌표
    this.y = y; // 나사의 y 좌표
    this.size = 50; // 나사의 크기
    this.depth = 0; // 나사의 깊이
    this.threadTurns = 8; // 나사 회전 수
    this.threadHeight = 100; // 나사 높이
    this.threadWidth = 10; // 나사 너비
    this.spacing = this.threadHeight / this.threadTurns; // 나사 회전 간격
    this.angle = 0; // 나사의 각도
    this.successed = false; // 나사 성공 여부
  }

  show() {
    push();
    translate(this.x, this.y + this.depth); // 나사의 위치로 이동
    stroke(125);
    strokeWeight(15);
    noFill();
    beginShape();
    for (let i = 0; i <= this.threadTurns; i++) {
      let y = i * this.spacing;
      let x = (i % 2 === 0) ? -this.threadWidth / 2 : this.threadWidth / 2; // 나사 모양 생성
      vertex(x, y);
    }
    endShape();
    this.drawHead(); // 나사 머리 그림
    pop();
  }

  drawHead() {
    noStroke();
    fill(180);
    ellipse(0, 0, this.size, this.size); // 나사 머리 그림
    for (let i = 0; i < this.size / 2; i++) {
      let inter = map(i, 0, this.size / 2, 180, 100);
      fill(inter);
      ellipse(0, 0, this.size - i, this.size - i); // 나사 머리의 음영 효과
    }
    stroke(0);
    strokeWeight(2);
    push();
    rotate(this.angle);
    line(-this.size / 4, 0, this.size / 4, 0); // 십자선 그리기
    line(0, -this.size / 4, 0, this.size / 4);
    pop();
  }

  update() {
    this.angle += PI / (2 * game.frame); // 나사의 각도 업데이트
    if (this.angle >= TWO_PI) {
      this.angle = 0;
    }
  }

  highlight() {
    push();
    translate(this.x, this.y + this.depth); // 나사의 위치로 이동
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    ellipse(0, 0, this.size + 10, this.size + 10); // 하이라이트 그림
    pop();
  }

  isMouseOver() {
    let d = dist(mouseX, mouseY, this.x, this.y + this.depth); // 마우스 위치와 나사 위치의 거리 계산
    return d < this.size / 2; // 마우스가 나사 위에 있는지 확인
  }

  move() {
    if (this.depth + this.spacing <= game.holeDepth) { // 나사가 구멍 깊이보다 깊지 않은 경우
      for (let i = 0; i < game.frame; i++) {
        this.depth += this.spacing / game.frame; // 나사 깊이 업데이트
        if (i == game.frame - 1) {
          this.threadTurns -= 1; // 나사 회전 수 감소
        }
        this.update(); // 나사 각도 업데이트
      }
      if (!this.successed && this.depth + this.spacing >= game.holeDepth) { // 나사가 성공적으로 들어간 경우
        game.successed += 1; // 게임 성공 수 증가
        this.successed = true; // 나사 성공 상태로 설정
      }
    } else {
      this.depth = game.holeDepth; // 나사 깊이 고정
    }
  }
}
