// 粒子字符集
const symbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', '|', '=', '+', '-', '*', '&', '%', '$', '#', '@', '!'];

// 粒子数组
let particles = [];
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;

// 创建粒子
function createParticle(container, x, y) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  // 随机速度
  const vx = (Math.random() - 0.5) * 2;
  const vy = (Math.random() - 0.5) * 2;
  
  container.appendChild(particle);
  particles.push({
    element: particle,
    x,
    y,
    vx,
    vy
  });
}

// 更新粒子位置
function updateParticles() {
  const attractionStrength = isMouseDown ? 0.1 : 0.02;
  const repulsionStrength = isMouseDown ? 0 : 0.01;
  
  particles.forEach(p => {
    // 计算鼠标距离
    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 粒子运动
    if (distance < 200) {
      const force = (isMouseDown ? -1 : 1) * attractionStrength / distance;
      p.vx += dx * force;
      p.vy += dy * force;
    }
    
    // 边界反弹
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    
    // 更新位置
    p.x += p.vx;
    p.y += p.vy;
    
    // 应用位置
    p.element.style.left = `${p.x}px`;
    p.element.style.top = `${p.y}px`;
  });
  
  requestAnimationFrame(updateParticles);
}

// 鼠标交互
function setupMouseInteraction() {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mousedown', () => {
    isMouseDown = true;
  });

  document.addEventListener('mouseup', () => {
    isMouseDown = false;
    // 添加爆炸效果
    particles.forEach(p => {
      p.vx += (Math.random() - 0.5) * 10;
      p.vy += (Math.random() - 0.5) * 10;
    });
  });
}

// 初始化
function initParticles() {
  const container = document.createElement('div');
  container.id = 'particles-js';
  document.body.appendChild(container);

  // 创建粒子
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createParticle(container, x, y);
  }

  setupMouseInteraction();
  updateParticles();
}

// 初始化
document.addEventListener('DOMContentLoaded', initParticles);
