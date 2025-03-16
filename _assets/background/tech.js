// 代码粒子特效
// 检测是否为移动设备
function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}

document.addEventListener('DOMContentLoaded', function() {
  // 移动端不加载特效
  if (isMobile()) return;
  console.log('Initializing canvas...');
  const canvas = document.createElement('canvas');
  canvas.classList.add('tech-canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '9999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  console.log('Canvas added to DOM');

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // 代码符号
  const codeSymbols = ['@', '#', '$', '*', '+', '-', '/', '=', '%'];
  const fontSize = 20;
  const maxParticles = 100;
  const particles = [];
  const mouse = { x: null, y: null, radius: 100 };

  // 斐波那契数列生成器
  function fibonacci(n) {
    const sequence = [0, 1];
    for (let i = 2; i <= n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  }

  // 粒子类
  class Particle {
    constructor(x, y, isExplosion = false) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.color = `rgba(200, 200, 200, ${Math.random() * 0.3 + 0.2})`;
      this.isExplosion = isExplosion;
      this.life = isExplosion ? 1 : Infinity;
      this.velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10
      };
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top'; // 设置文本基线
      ctx.fillText(this.symbol, this.x, this.y);
      
      // 添加发光效果
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    update() {
      if (this.isExplosion) {
        // 爆炸粒子更新逻辑
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.1; // 重力效果
        this.color = `rgba(200, 200, 200, ${this.life})`;
      } else {
        // 普通粒子更新逻辑
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

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // 更新并绘制所有粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.draw();
      particle.update();
      
      // 处理爆炸粒子
      if (particle.isExplosion) {
        particle.life -= 0.02;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.velocity.y += 0.1; // 重力效果
        
        // 移除消失的粒子
        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }
    }
    
    requestAnimationFrame(animate);
  }

  // 鼠标点击事件
  window.addEventListener('click', (e) => {
    const count = 50; // 增加粒子数量
    const fib = fibonacci(count);
    
    for (let i = 0; i < count; i++) {
      const radius = fib[i] * 5; // 增加扩散范围
      const angle = (i / count) * Math.PI * 2;
      
      const particle = new Particle(
        e.clientX,
        e.clientY,
        true
      );
      
      // 设置更明显的初始速度
      particle.velocity = {
        x: Math.cos(angle) * radius * 0.5,
        y: Math.sin(angle) * radius * 0.5
      };
      
      // 设置更长的生命周期
      particle.life = 2;
      
      // 设置更亮的颜色
      particle.color = `rgba(200, 200, 200, ${Math.random() * 0.8 + 0.2})`;
      
      particles.push(particle);
    }
  });

  // 鼠标移动
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // 鼠标离开
  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
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
