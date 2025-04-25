// 著色器相關變數
let sh; // 著色器
let img; // 背景圖片

// 著色器的頂點和片段程式碼
const vert = `
  attribute vec4 aPosition;
  varying vec4 v_uv;
  void main() {
    v_uv = aPosition;
    v_uv.y *= -1.0;
    v_uv.x = v_uv.x * 0.5 + 0.5;
    v_uv.y = v_uv.y * 0.5 + 0.5;
    gl_Position = aPosition;
  }
`;

const frag = `
  precision mediump float;
  uniform sampler2D uSampler;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_tiling;
  uniform float u_strength;
  varying vec4 v_uv;

  void main() {
    vec2 texcoord = vec2(
      v_uv.x - sin(u_time * u_speed) * 0.05 * cos(v_uv.y * u_tiling) * u_strength,
      v_uv.y - cos(u_time * u_speed) * 0.05 * sin(v_uv.x * u_tiling) * u_strength
    );
    vec4 col = texture2D(uSampler, texcoord);
    gl_FragColor = col;
  }
`;

function preload() {
  img = loadImage('https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  sh = createShader(vert, frag);
  noStroke();
}

function draw() {
  shader(sh);
  sh.setUniform("uSampler", img);
  sh.setUniform("u_time", millis() / 2000);
  sh.setUniform("u_speed", 0.5);
  sh.setUniform("u_tiling", 10 + mouseY * 0.005);
  sh.setUniform("u_strength", mouseX * 0.005);
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

// 處理選單點擊事件
function handleMenuClick(event) {
  const target = event.target;
  const iframe = document.getElementById('content-frame');

  if (!target.matches('a')) return;
  event.preventDefault();

  const href = target.getAttribute('href');
  iframe.style.display = 'block';

  if (href === '#home') {
    iframe.srcdoc = createHomePage();
  } else if (target.id === 'about-link') {
    iframe.srcdoc = createAboutPage();
  } else if (target.id === 'tutorial-link') {
    iframe.src = 'https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/A2/week4/20250314_092232.mp4';
  } else if (target.id === 'quiz-link') {
    iframe.src = 'https://feiwyf.github.io/test/';
  } else if (target.closest('.submenu a')) {
    iframe.src = href;
  }
}

document.querySelector('.menu').addEventListener('click', handleMenuClick);

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // 阻止預設行為（跳轉頁面）
    const iframe = document.getElementById('content-frame');
    iframe.src = this.href; // 將連結的 href 設為 iframe 的 src
  });
});

// 建立首頁內容
function createHomePage() {
  return `
    <html><head><style>
      body { margin: 0; padding: 0; height: 100vh; width: 100vw; background: transparent; overflow: hidden; position: relative; }
      .cat-container { position: absolute; display: flex; flex-direction: column; align-items: center; }
      .cat { width: 100px; height: 100px; background: url('https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif') no-repeat center/contain; }
      .text { 
        margin-top: 10px; 
        font-size: 24px; 
        font-weight: bold; 
        color: red; 
        animation: rainbow-color 7s infinite; /* 每1秒變換一次顏色 */
      }
      @keyframes rainbow-color {
        0% { color: red; }
        16% { color: orange; }
        33% { color: yellow; }
        50% { color: green; }
        66% { color: blue; }
        83% { color: indigo; }
        100% { color: violet; }
      }
    </style></head>
    <body>
      <div class="cat-container" id="cat-container">
        <div class="cat"></div>
        <div class="text">這是首頁</div>
      </div>
      <script>
        const cat = document.getElementById('cat-container');
        let x = 0, y = 0, dx = 2, dy = 2;
        function move() {
          const w = window.innerWidth - cat.offsetWidth;
          const h = window.innerHeight - cat.offsetHeight;
          x += dx; y += dy;
          if (x <= 0 || x >= w) dx *= -1;
          if (y <= 0 || y >= h) dy *= -1;
          cat.style.transform = \`translate(\${x}px, \${y}px)\`;
          requestAnimationFrame(move);
        }
        move();
      </script>
    </body></html>
  `;
}


