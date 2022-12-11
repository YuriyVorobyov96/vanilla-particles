(function() {
  class Particle {
    #x;
    #y;
    #velocityX;
    #velocityY;
    #life;

    constructor() {
      this.#init();
    }
  
    changePosition() {
      this.#x + this.#velocityX > width && this.#velocityX > 0 ||
        this.#x + this.#velocityX < 0 && this.#velocityX < 0 ?
          this.#velocityX *=  -1 : this.#velocityX;
  
      this.#y + this.#velocityY > height && this.#velocityY > 0 ||
        this.#y + this.#velocityY < 0 && this.#velocityY < 0 ?
          this.#velocityY *= -1 : this.#velocityY;
  
      this.#x += this.#velocityX;
      this.#y += this.#velocityY;
    }
  
    draw() {
      ctx.beginPath();
      ctx.arc(this.#x, this.#y, properties.particleRadius, 0, Math.PI * 2);
      ctx.closePath();
  
      ctx.fillStyle = properties.particleColor;
      ctx.fill(); 
    }
  
    calculateLife() {
      if (this.#life < 1) {
        this.#init();
      }
  
      this.#life--;
    }

    #defaultVelocity() {
      return Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
    }

    #init() {
      this.#x = Math.random() * width;
      this.#y = Math.random() * height;

      this.#velocityX = this.#defaultVelocity();
      this.#velocityY = this.#defaultVelocity();

      this.#life = Math.random() * properties.particleLife * 60;
    }

    get x() {
      return this.#x;
    }

    get y() {
      return this.#y;
    }
  }

  class Line {
    #x1;
    #y1;
    #x2;
    #y2;
    #length;
    #opacity;

    constructor() {
      this.#x1 = 0;
      this.#y1 = 0;
      this.#x2 = 0;
      this.#y2 = 0;
      this.#length = 0;
      this.#opacity = 0;
    }

    setCoordinates({x1, y1, x2, y2}) {
      this.#x1 = x1;
      this.#x2 = x2;
      this.#y1 = y1;
      this.#y2 = y2;

      this.#setLength();
    }

    #setLength() {
      this.#length = Math.sqrt(
        Math.pow(this.#x2 - this.#x1, 2) + Math.pow(this.#y2 - this.#y1, 2)
      );
    }

    defineOpacity() {
      this.#opacity = String(1 - this.length / properties.lineLength);
    }

    get x1() {
      return this.#x1;
    }
    get y1() {
      return this.#y1;
    }
    get x2() {
      return this.#x2;
    }
    get y2() {
      return this.#y2;
    }
    get length() {
      return this.#length;
    }
    get opacity() {
      return this.#opacity;
    }
  }

  class ParticlesContainer {
    static #particles = [];

    static forEach(cb) {
      this.#particles.forEach(cb);
    }

    static push(particle) {
      this.#particles.push(particle);
    }

    static length() {
      return this.#particles.length;
    }

    static at(idx) {
      return this.#particles[idx];
    }

    static clear() {
      this.#particles.length = 0;
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = innerWidth;
  let height = canvas.height = innerHeight;

  window.onresize = () => {
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
  }

  const properties = {
    bgColor: 'rgba(17, 17, 19, 1)',
    particleColor: 'rgba(255, 40, 40, 1)',
    particleRadius: 3,
    particlesCount: 100,
    particleMaxVelocity: 0.5,
    lineLength: 150,
    particleLife: 70,
  };

  document.querySelector('body').appendChild(canvas);

  const drawBackground = () => {
    ctx.fillStyle = properties.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  const drawParticles = () => {
    ParticlesContainer.forEach(particle => {
      particle.calculateLife();
      particle.changePosition();
      particle.draw();
    });
  }

  const drawLines = () => {
    const line = new Line();

    for (let i = 0; i < ParticlesContainer.length(); i ++) {
      for (let j = 0; j < ParticlesContainer.length(); j++) {
        if (i === j) {
          continue;
        }

        line.setCoordinates({
          x1: ParticlesContainer.at(i).x,
          x2: ParticlesContainer.at(j).x,
          y1: ParticlesContainer.at(i).y,
          y2: ParticlesContainer.at(j).y,
        });

        if (line.length < properties.lineLength) {
          line.defineOpacity();

          ctx.lineLength = '0,5';
          ctx.strokeStyle = `rgba(255, 40, 40, ${line.opacity})`;
          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  const loop = () => {
    drawBackground();
    drawParticles();
    drawLines();
    requestAnimationFrame(loop);
  }

  const init = () => {
    for (let i = 0; i < properties.particlesCount; i++) {
      ParticlesContainer.push(new Particle());
    }

    loop();
  }

  init();
})();
