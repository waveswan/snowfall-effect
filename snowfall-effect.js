/**
 * snowfall-effect.js
 * Simple canvas particle effect
 *
 * Author: Wave Swan
 * License: MIT
 * Project: https://github.com/waveswan/snowfall-effect
 */

const TWO_PI = Math.PI * 2;
const FRAME_TIME = 1000 / 60; // 60 FPS

function randomRange(min, max) {
  if (Number.isInteger(min) && Number.isInteger(max)) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return Math.random() * (max - min) + min;
}

function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}

const defaultConfig = {
  color: '#dee4fd',   // color: fill color used when drawing particles (any valid CSS color)
  radius: [0.5, 1.6],   // radius: [min, max] radius for each particle in pixels (randomized per flake)
  speed: [0.5, 2],      // speed: [min, max] vertical speed multiplier (higher = faster movement)
  wind: [-0.5, 4],      // wind: [min, max] horizontal velocity range applied to each particle
  changeFrequency: 250, // changeFrequency: number of frames between random target-value updates
  rotationSpeed: [-1, 1],// rotationSpeed: [min, max] angular velocity range (degrees per frame)
  opacity: [1, 1],      // opacity: [min, max] per-particle alpha multiplier (0.0 - 1.0+)
  snowflakeCount: 250,  // snowflakeCount: initial number of particles to create
  zIndex: 99999,        // zIndex: CSS z-index applied to the wrapper element containing the canvas
  anchorId: null,       // anchorId: optional DOM element id to insert the wrapper after; if null, appended to body
  direction: 'down'     // direction: 'down' to fall downwards, 'up' to rise upwards
};

class Snowflake {
  constructor(canvas, config = {}) {
    this.config = { ...defaultConfig, ...config };
    this.framesSinceLastUpdate = 0;
    const { radius, wind, speed, rotationSpeed, opacity } = this.config;
    this.params = {
      x: Math.random() * canvas.offsetWidth,
      y: (this.config.direction === 'up')
        ? randomRange(canvas.offsetHeight, canvas.offsetHeight * 2)
        : randomRange(-canvas.offsetHeight, 0),
      rotation: randomRange(0, 360),
      radius: randomRange(...radius),
      speed: randomRange(...speed),
      wind: randomRange(...wind),
      rotationSpeed: randomRange(...rotationSpeed),
      nextSpeed: randomRange(...speed),
      nextWind: randomRange(...wind),
      nextRotationSpeed: randomRange(...rotationSpeed),
      opacity: randomRange(...opacity)
    };
  }

  updateTargetParams() {
    this.params.nextSpeed = randomRange(...this.config.speed);
    this.params.nextWind = randomRange(...this.config.wind);
    this.params.nextRotationSpeed = randomRange(...this.config.rotationSpeed);
  }

  update(canvasWidth, canvasHeight, delta = 1) {
    const p = this.params;
    p.x = (p.x + p.wind * delta) % (canvasWidth + 2 * p.radius);
    if (p.x > canvasWidth + p.radius) p.x = -p.radius;
    if (p.x < -p.radius) p.x = canvasWidth + p.radius;
    const dir = this.config.direction === 'up' ? -1 : 1;
    p.y = p.y + p.speed * delta * dir;
    if (dir > 0) {
      if (p.y > canvasHeight + p.radius) p.y = -p.radius;
    } else {
      if (p.y < -p.radius) p.y = canvasHeight + p.radius;
    }
    p.rotation = (p.rotation + p.rotationSpeed) % 360;
    p.speed = lerp(p.speed, p.nextSpeed, 0.01);
    p.wind = lerp(p.wind, p.nextWind, 0.01);
    p.rotationSpeed = lerp(p.rotationSpeed, p.nextRotationSpeed, 0.01);
    this.framesSinceLastUpdate++;
    if (this.framesSinceLastUpdate > this.config.changeFrequency) {
      this.updateTargetParams();
      this.framesSinceLastUpdate = 0;
    }
  }

  drawCircle(ctx) {
    ctx.moveTo(this.params.x + this.params.radius, this.params.y);
    ctx.arc(this.params.x, this.params.y, this.params.radius, 0, TWO_PI);
  }
}

class SnowfallEffect {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = { ...defaultConfig, ...config };
    this.snowflakes = [];
    this.lastUpdate = Date.now();
    this.animationFrame = null;
    for (let i = 0; i < this.config.snowflakeCount; i++) {
      this.snowflakes.push(new Snowflake(canvas, this.config));
    }
    this.play();
  }

  render(delta = 1) {
    const { ctx, canvas, snowflakes } = this;
    const { offsetWidth, offsetHeight } = canvas;
    for (const snowflake of snowflakes) {
      snowflake.update(offsetWidth, offsetHeight, delta);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, offsetWidth, offsetHeight);
    ctx.beginPath();
    for (const snowflake of snowflakes) {
      ctx.globalAlpha = snowflake.params.opacity;
      snowflake.drawCircle(ctx);
    }
    ctx.fillStyle = this.config.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  loop() {
    const now = Date.now();
    const elapsed = now - this.lastUpdate;
    this.lastUpdate = now;
    const delta = Math.max(1, elapsed / FRAME_TIME);
    this.render(delta);
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  play() {
    if (!this.animationFrame) {
      this.lastUpdate = Date.now();
      this.loop();
    }
  }

  pause() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    const diff = this.config.snowflakeCount - this.snowflakes.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.snowflakes.push(new Snowflake(this.canvas, this.config));
      }
    } else if (diff < 0) {
      this.snowflakes = this.snowflakes.slice(0, this.config.snowflakeCount);
    }
  }

  destroy() {
    this.pause();
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
  }
}

function createSnowfall(config = {}) {
  const anchor = (config && config.anchorId)
    ? document.getElementById(config.anchorId)
    : (document.querySelector('footer') || document.body.lastElementChild);
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; pointer-events: none; overflow: hidden;';
  const wrapperZ = (config && typeof config.zIndex !== 'undefined') ? config.zIndex : defaultConfig.zIndex;
  wrapper.style.zIndex = String(wrapperZ);
  wrapper.setAttribute('data-snowfall-wrapper', 'true');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('data-testid', 'SnowfallCanvas');
  canvas.style.cssText = 'pointer-events: none; background-color: transparent; position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
  wrapper.appendChild(canvas);
  if (anchor && anchor.parentNode) {
    if (anchor.nextSibling) {
      anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
    } else {
      anchor.parentNode.appendChild(wrapper);
    }
  } else {
    document.body.appendChild(wrapper);
  }
  function updateSize() {
    const height = window.innerHeight;
    wrapper.style.height = height + 'px';
    canvas.width = window.innerWidth;
    canvas.height = height;
  }
  updateSize();
  const snowfall = new SnowfallEffect(canvas, config);
  snowfall.wrapper = wrapper;
  const resizeHandler = () => updateSize();
  window.addEventListener('resize', resizeHandler);
  const originalDestroy = snowfall.destroy.bind(snowfall);
  snowfall.destroy = function () {
    window.removeEventListener('resize', resizeHandler);
    originalDestroy();
  };
  return snowfall;
}

export { SnowfallEffect, Snowflake, createSnowfall };

if (typeof window !== 'undefined') {
  window.createSnowfall = createSnowfall;
  window.SnowfallEffect = SnowfallEffect;
  window.Snowflake = Snowflake;
}