let game2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 게임 객체 생성
  game2 = new Motorgame();
}

function draw() {
  background(255);
  game2.update();
  game2.display();
}

class Motorgame {
  constructor() {
    this.propeller = new Propeller(width / 2, height / 2, 150);
    this.acceleration = 0;
    this.maxAcceleration = 10;
    this.accelerationStep = 0.1;
    this.decelerationStep = 0.05;
    this.energy = 0;
    this.maxEnergy = 100;
    this.timeLimit = 30; // 타이머 제한 시간 (초)
    this.startTime = millis();
    this.gameState = "playing"; // 게임 상태: "playing", "success", "fail"
  }

  update() {
    if (this.gameState === "playing") {
      // 키보드 입력에 따른 가속도 조절
      if (keyIsDown(UP_ARROW)) {
        this.acceleration = min(this.acceleration + this.accelerationStep, this.maxAcceleration);
      } else if (keyIsDown(DOWN_ARROW)) {
        this.acceleration = max(this.acceleration - this.accelerationStep, 0);
      } else {
        // 키보드를 누르지 않으면 속도 감소
        this.acceleration = max(this.acceleration - this.decelerationStep, 0);
      }

      // 에너지 게이지 업데이트
      this.energy = min(this.energy + this.acceleration * 0.1, this.maxEnergy);

      // 프로펠러 업데이트
      this.propeller.update(this.acceleration);

      // 타이머 체크
      let elapsedTime = (millis() - this.startTime) / 1000;
      if (elapsedTime >= this.timeLimit) {
        this.gameState = "fail";
      }

      // 에너지가 최대치에 도달하면 게임 성공 상태로 전환
      if (this.energy >= this.maxEnergy) {
        this.gameState = "success";
      }
    }
  }

  display() {
    if (this.gameState === "playing") {
      // 프로펠러 그리기
      this.propeller.display();

      // 에너지 게이지 그리기
      this.drawEnergyGauge(this.energy, this.maxEnergy);

      // 타이머 그리기
      this.drawTimer();
    } else if (this.gameState === "success") {
      // 게임 성공 화면
      textSize(64);
      fill(0);
      textAlign(CENTER, CENTER);
      text("게임 성공!", width / 2, height / 2);
    } else if (this.gameState === "fail") {
      // 게임 실패 화면
      textSize(64);
      fill(0);
      textAlign(CENTER, CENTER);
      text("게임 실패", width / 2, height / 2);

      // 다시 도전 버튼 그리기
      this.drawRetryButton();
    }
  }

  drawEnergyGauge(energy, maxEnergy) {
    let gaugeWidth = 200;
    let gaugeHeight = 20;
    let filledWidth = map(energy, 0, maxEnergy, 0, gaugeWidth);

    fill(200);
    rect(width / 2 - gaugeWidth / 2, height - 40, gaugeWidth, gaugeHeight);
    fill(0, 255, 0);
    rect(width / 2 - gaugeWidth / 2, height - 40, filledWidth, gaugeHeight);
  }

  drawTimer() {
    let elapsedTime = (millis() - this.startTime) / 1000;
    let remainingTime = max(this.timeLimit - elapsedTime, 0);
    let gaugeWidth = 200;
    let gaugeHeight = 20;
    let filledWidth = map(remainingTime, 0, this.timeLimit, 0, gaugeWidth);

    fill(200);
    rect(width / 2 - gaugeWidth / 2, 40, gaugeWidth, gaugeHeight);
    fill(255, 0, 0);
    rect(width / 2 - gaugeWidth / 2, 40, filledWidth, gaugeHeight);
  }

  drawRetryButton() {
    fill(0, 255, 0);
    rect(width / 2 - 100, height / 2 + 50, 200, 50);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("다시 도전", width / 2, height / 2 + 75);
  }

  reset() {
    this.propeller = new Propeller(width / 2, height / 2, 150);
    this.acceleration = 0;
    this.energy = 0;
    this.startTime = millis();
    this.gameState = "playing";
  }
}

class Propeller {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = 0;
    this.speed = 0;
  }

  update(speed) {
    this.speed = speed;
    this.angle += this.speed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(0); // 프로펠러 색을 검정색으로 설정

    // 프로펠러 블레이드 그리기
    for (let i = 0; i < 6; i++) {
      rotate(60);
      this.drawBlade();
    }

    pop();
  }

  drawBlade() {
    let bladeWidth = this.size / 2; // 블레이드의 폭을 조절하는 변수
    beginShape();
    vertex(0, 0);
    vertex(this.size, -bladeWidth / 4);
    vertex(this.size, bladeWidth / 4);
    endShape(CLOSE);
  }
}

function mousePressed() {
  if (game2.gameState === "fail") {
    let buttonX = width / 2 - 100;
    let buttonY = height / 2 + 50;
    let buttonWidth = 200;
    let buttonHeight = 50;

    if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      game2.reset();
    }
  }
}
