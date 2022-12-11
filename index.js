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
      this.#x + this.#velocityX > Canvas.width && this.#velocityX > 0 ||
        this.#x + this.#velocityX < 0 && this.#velocityX < 0 ?
          this.#velocityX *=  -1 : this.#velocityX;
  
      this.#y + this.#velocityY > Canvas.height && this.#velocityY > 0 ||
        this.#y + this.#velocityY < 0 && this.#velocityY < 0 ?
          this.#velocityY *= -1 : this.#velocityY;
  
      this.#x += this.#velocityX;
      this.#y += this.#velocityY;
    }
  
    draw() {
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(this.#x, this.#y, properties.particleRadius, 0, Math.PI * 2);
      Canvas.ctx.closePath();
  
      Canvas.ctx.fillStyle = properties.particleColor;
      Canvas.ctx.fill(); 
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
      this.#x = Math.random() * Canvas.width;
      this.#y = Math.random() * Canvas.height;

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

  class Canvas {
    static element;
    static ctx;
    static width;
    static height;

    static init() {
      this.element = document.createElement('canvas');
      this.ctx = this.element.getContext('2d');
      this.element.width = innerWidth;
      this.element.height = innerHeight;
      this.width = innerWidth;
      this.height = innerHeight;

      document.querySelector('body').appendChild(this.element);
    }
  }

  Canvas.init();

  window.onresize = () => {
    Canvas.element.width = innerWidth;
    Canvas.element.height = innerHeight;
    Canvas.width = innerWidth;
    Canvas.height = innerHeight;
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

  const drawBackground = () => {
    Canvas.ctx.fillStyle = properties.bgColor;
    Canvas.ctx.fillRect(0, 0, Canvas.width, Canvas.height);
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

          Canvas.ctx.lineLength = '0,5';
          Canvas.ctx.strokeStyle = `rgba(255, 40, 40, ${line.opacity})`;
          Canvas.ctx.beginPath();
          Canvas.ctx.moveTo(line.x1, line.y1);
          Canvas.ctx.lineTo(line.x2, line.y2);
          Canvas.ctx.closePath();
          Canvas.ctx.stroke();
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
