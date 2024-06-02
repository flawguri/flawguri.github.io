class GameMap {
  constructor(width, height, img) {
    this.width = width; //1600
    this.height = height; //1200
    this.img = img;
    this.obstacles = [ //타일 한 칸당 80px로 계산
      { x: 480, y: 640, width: 80, height: 160 }, //spawn left wall
      { x: 1040, y: 640, width: 80, height: 160 } //spawn right wall
    ];
    this.triggers = [
      { x: 560, y: 320, width: 480, height: 480, message: "spawn zone \n press Q to interact" },
      { x: 0, y: 0, width: 400, height: 240, message: "trigger zone 1" },
      { x: 0, y: 480, width: 240, height: 240, message: "zone 2" },
      { x: 0, y: 960, width: 400, height: 240, message: "zone 3" },
      { x: 1200, y: 0, width: 400, height: 240, message: "zone 4" },
      { x: 1360, y: 480, width: 240, height: 240, message: "zone 5" },
      { x: 1200, y: 960, width: 400, height: 240, message: "zone 6" }
    ];
  }

  display() {
    // fill(100);
    // rect(0, 0, this.width, this.height);
    noSmooth();
    image(this.img, 0, 0, this.width, this.height);

    // obstacle
    fill(255, 0, 0, 100);
    for (let obstacle of this.obstacles) {
      rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }


  displayTriggers() {
    // 트리거 영역 그리기
    fill(0, 255, 0, 100);
    for (let trigger of this.triggers) {
      rect(trigger.x, trigger.y, trigger.width, trigger.height);
    }
  }

  checkTriggers(player) {
    for (let trigger of this.triggers) {
      if (player.isInZone(trigger)) {
        return trigger;
      }
    }
    return null;
  }
}
