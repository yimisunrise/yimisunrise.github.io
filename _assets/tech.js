// 代码粒子特效
// 检测是否为移动设备
function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}

document.addEventListener('DOMContentLoaded', function() {
  // 移动端不加载特效
  if (isMobile()) return;
  const canvas = document.createElement('canvas');
  canvas.classList.add('tech-canvas');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // 代码符号
  const codeSymbols = ['@', '#', '$', '*', '+', '-', '/', '=', '%'];
  const fontSize = 20;
  const maxParticles = 100;
  const particles = [];
  const mouse = { x: null, y: null, radius: 100 };

  // 粒子类
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.color = `rgba(200, 200, 200, ${Math.random() * 0.3 + 0.2})`;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(this.symbol, this.x, this.y);
    }

    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const maxDistance = mouse.radius;
      const force = (maxDistance - distance) / maxDistance;
      const directionX = forceDirectionX * force * this.density;
      const directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  // 初始化粒子
  function init() {
    particles.length = 0;
    for (let i = 0; i < maxParticles; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push(new Particle(x, y));
    }
  }

  // 斐波那契动画
  function fibonacciExplosion(x, y) {
    const sequence = [0, 1];
    for (let i = 2; i < 10; i++) {
      sequence.push(sequence[i-1] + sequence[i-2]);
    }

    sequence.forEach((num, index) => {
      setTimeout(() => {
        ctx.fillStyle = `rgba(26, 115, 232, ${1 - index * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, num * 2, 0, Math.PI * 2);
        ctx.fill();
      }, index * 50);
    });
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      particle.draw();
      particle.update();
    });
    requestAnimationFrame(animate);
  }

  // 鼠标移动
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // 鼠标离开
  canvas.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  // 点击事件
  canvas.addEventListener('click', (e) => {
    fibonacciExplosion(e.x, e.y);
  });

  // 窗口大小调整
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  });

  init();
  animate();
});
