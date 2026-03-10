// ========== 获取两个 Canvas ==========
const canvasBack = document.getElementById("sakuraCanvasBack");
const ctxBack = canvasBack.getContext("2d");
const canvasFront = document.getElementById("sakuraCanvasFront");
const ctxFront = canvasFront.getContext("2d");

// 设置画布尺寸为窗口大小（两个 canvas 同步）
function resizeCanvases() {
  canvasBack.width = window.innerWidth;
  canvasBack.height = window.innerHeight;
  canvasFront.width = window.innerWidth;
  canvasFront.height = window.innerHeight;
}
resizeCanvases();
window.addEventListener("resize", resizeCanvases);

// ========== 樱花粒子类（支持花朵/花瓣两种类型）==========
class Petal {
  constructor(forFront) {
    this.forFront = forFront; // true 表示属于前面 canvas，false 表示后面 canvas
    this.reset();
  }

  reset() {
    // 基本属性
    this.x =
      Math.random() * (this.forFront ? canvasFront.width : canvasBack.width);
    this.y =
      Math.random() *
      (this.forFront ? canvasFront.height : canvasBack.height) *
      0.3;

    // 大小：10~28px（花瓣大小）
    this.size = Math.random() * 18 + 10; // 10~28

    // 下落速度
    this.speedY = Math.random() * 1.5 + 0.6; // 0.6~2.1
    this.speedX = (Math.random() - 0.5) * 0.5; // -0.25~0.25

    // 摆动
    this.swing = Math.random() * 0.02 + 0.01;
    this.angle = Math.random() * Math.PI * 2;

    // 旋转
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.01;

    // 透明度：0.3~0.8
    this.opacity = Math.random() * 0.5 + 0.3;

    // 颜色微调
    this.hueShift = Math.random() * 20 - 10;

    // 随机类型：1/4 完整花朵，3/4 单花瓣
    this.type = Math.random() < 1 / 4 ? "flower" : "petal";
  }

  update(canvasWidth, canvasHeight) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.angle) * 0.2;
    this.angle += this.swing;
    this.rotation += this.rotationSpeed;

    // 边界处理
    if (this.y > canvasHeight + this.size) {
      this.reset();
      this.y = -this.size;
    }
    if (this.x < -this.size) {
      this.x = canvasWidth + this.size;
    } else if (this.x > canvasWidth + this.size) {
      this.x = -this.size;
    }
  }

  // 绘制完整花朵（大小单独缩小为花瓣的 0.7 倍）
  drawFlower(ctx) {
    const flowerSize = this.size * 0.7; // 花朵比花瓣小
    const baseHue = 340 + this.hueShift;
    const mainColor = `hsla(${baseHue}, 80%, 70%, ${this.opacity})`;
    const darkColor = `hsla(${baseHue}, 80%, 60%, ${this.opacity})`;
    const lightColor = `hsla(${baseHue}, 90%, 80%, ${this.opacity})`;

    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i / 5) * Math.PI * 2);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        flowerSize * 0.4,
        -flowerSize * 0.6,
        0,
        -flowerSize * 1.0
      );
      ctx.quadraticCurveTo(-flowerSize * 0.4, -flowerSize * 0.6, 0, 0);

      const gradient = ctx.createRadialGradient(
        0,
        -flowerSize * 0.3,
        2,
        0,
        -flowerSize * 0.3,
        flowerSize
      );
      gradient.addColorStop(0, lightColor);
      gradient.addColorStop(0.7, mainColor);
      gradient.addColorStop(1, darkColor);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 脉络
      ctx.strokeStyle = `hsla(${baseHue}, 80%, 50%, ${this.opacity * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -flowerSize * 0.2);
      ctx.quadraticCurveTo(
        flowerSize * 0.2,
        -flowerSize * 0.4,
        0,
        -flowerSize * 0.8
      );
      ctx.stroke();

      ctx.restore();
    }

    // 花蕊
    ctx.beginPath();
    ctx.arc(0, 0, flowerSize * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(50, 80%, 60%, ${this.opacity})`;
    ctx.fill();

    for (let j = 0; j < 6; j++) {
      ctx.save();
      ctx.rotate((j / 6) * Math.PI * 2);
      ctx.beginPath();
      ctx.arc(0, flowerSize * 0.2, flowerSize * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(30, 80%, 60%, ${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // 绘制单花瓣（保持原大小）
  drawPetal(ctx) {
    const baseHue = 340 + this.hueShift;
    const mainColor = `hsla(${baseHue}, 80%, 70%, ${this.opacity})`;
    const darkColor = `hsla(${baseHue}, 80%, 60%, ${this.opacity})`;
    const lightColor = `hsla(${baseHue}, 90%, 80%, ${this.opacity})`;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(
      this.size * 0.4,
      -this.size * 0.6,
      0,
      -this.size * 1.0
    );
    ctx.quadraticCurveTo(-this.size * 0.4, -this.size * 0.6, 0, 0);

    const gradient = ctx.createRadialGradient(
      0,
      -this.size * 0.3,
      2,
      0,
      -this.size * 0.3,
      this.size
    );
    gradient.addColorStop(0, lightColor);
    gradient.addColorStop(0.7, mainColor);
    gradient.addColorStop(1, darkColor);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 简单脉络
    ctx.strokeStyle = `hsla(${baseHue}, 80%, 50%, ${this.opacity * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 0.2);
    ctx.quadraticCurveTo(
      this.size * 0.2,
      -this.size * 0.4,
      0,
      -this.size * 0.8
    );
    ctx.stroke();
  }

  draw(ctx, canvasWidth, canvasHeight) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    // 轻微呼吸效果
    ctx.scale(
      0.9 + Math.sin(this.angle) * 0.1,
      0.9 + Math.cos(this.angle) * 0.1
    );

    if (this.type === "flower") {
      this.drawFlower(ctx);
    } else {
      this.drawPetal(ctx);
    }

    ctx.restore();
  }
}

// ========== 初始化粒子 ==========
const PETAL_COUNT_PER_LAYER = 40; // 每层各40朵

// 后面 canvas 的粒子
let backPetals = [];
for (let i = 0; i < PETAL_COUNT_PER_LAYER; i++) {
  backPetals.push(new Petal(false));
}

// 前面 canvas 的粒子
let frontPetals = [];
for (let i = 0; i < PETAL_COUNT_PER_LAYER; i++) {
  frontPetals.push(new Petal(true));
}

// ========== 动画循环 ==========
function animate() {
  // 清空两个 canvas
  ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
  ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);

  // 更新并绘制后面的樱花
  backPetals.forEach((p) => {
    p.update(canvasBack.width, canvasBack.height);
    p.draw(ctxBack, canvasBack.width, canvasBack.height);
  });

  // 更新并绘制前面的樱花
  frontPetals.forEach((p) => {
    p.update(canvasFront.width, canvasFront.height);
    p.draw(ctxFront, canvasFront.width, canvasFront.height);
  });

  requestAnimationFrame(animate);
}

animate();
