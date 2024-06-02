let shared;
let clickCount;
let totalDeg;
let guests;
let me;

// DOMContentLoaded 이벤트 리스너를 추가하여 HTML 문서가 완전히 로드된 후 onClick 함수를 버튼 클릭 이벤트에 연결
document.addEventListener("DOMContentLoaded", function() {
  const activateButton = document.getElementById('activateButton');
  activateButton.addEventListener('click', onClick);
});

// onClick 함수는 iOS 기기에서 motion 권한을 요청합니다.
function onClick() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', cb);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('devicemotion', cb);
    // iOS 13 이전 버전이나 다른 장치에서는 권한 요청 없이 바로 이벤트를 추가
  }
}

// devicemotion 이벤트 콜백 함수
function cb(event) {
  console.log(event.rotationRate); // 회전 속도를 콘솔에 출력
  // 추가적인 이벤트 처리 로직을 여기에 작성
}

// p5.js preload 함수로 party.js 연결 및 공유 데이터 초기화
function preload() {
  partyConnect(
    "wss://demoserver.p5party.org",
    "party_circle"
  );
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  clickCount = partyLoadShared("clickCount", { value: 0 });
  guests = partyLoadGuestShareds();
  me = partyLoadMyShared({ degX: 0 });
}

// p5.js setup 함수로 캔버스 설정 및 초기 값 설정
function setup() {
  createCanvas(400, 400); // 400x400 크기의 캔버스를 생성
  noStroke(); // 윤곽선 없음

  // 호스트인 경우 초기 값을 설정
  if (partyIsHost()) {
    clickCount.value = 0;
    shared.x = 200;
    shared.y = 200;
  }

  totalDeg = 0; // 총 회전 각도 초기화

  game.setup(); // 미니게임1 설정
}

// 마우스를 클릭하면 공유 객체의 위치를 업데이트하고 클릭 수를 증가
function mousePressed() {
  shared.x = mouseX;
  shared.y = mouseY;
  clickCount.value++;
}


// p5.js draw 함수로 매 프레임마다 호출되며 화면을 업데이트
function draw() {
  background('#ffcccc'); // 배경색 설정
  fill("#000066"); // 도형 색상 설정

  me.degY = rotationY; // 현재 기기의 X축 회전 각도를 저장

  // 각 게스트의 회전 값을 합산
  for (let i = 0; i < guests.length; i++) {
    totalDeg += guests[i].degY;
  }

  console.log(totalDeg); // 합산된 회전 값을 콘솔에 출력

  textAlign(CENTER, CENTER); // 텍스트 정렬 설정
  text(clickCount.value, width / 2, height / 2); // 클릭 수를 화면에 표시
  text(radians(totalDeg), width / 2, 100); // 합산된 회전 값을 라디안으로 변환하여 화면에 표시

  // 키가 눌린 상태에서 'w' 또는 's' 키를 확인하여 공유 객체의 위치를 업데이트
  if (keyIsPressed) {
    if (key === 'w') {
      shared.x += 0.5 * radians(totalDeg);
      shared.y -= 0.5;
    } else if (key === 's') {
      shared.x += 0.5 * radians(totalDeg);
      shared.y += 0.5;
    }
  }

  ellipse(shared.x, shared.y, 100, 100); // 공유 객체의 위치에 원을 그리기

  totalDeg = 0; // 합산된 회전 값을 초기화

}
