import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-section2',
  standalone: true,
  imports: [],
  templateUrl: './section2.component.html',
  styleUrl: './section2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Section2Component implements AfterViewInit {
  private readonly renderer = inject(Renderer2);

  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;
  image = new Image();
  particles: Particle[] = [];
  mouse: { x: number; y: number } = { x: 0, y: 0 };
  lastRender = 0;
  isMobile: boolean = false;

  frameRate = 1000 / 50; // 50 frames per  secound
  moveTimeout!: ReturnType<typeof setTimeout>;

  @HostListener('window:resize')
  onWindowResize() {
    this.checkIfIsMobile();
    this.context = this.canvas?.nativeElement.getContext('2d', {
      willReadFrequently: true,
    })!;
    this.canvas.nativeElement.width = 900;
    this.canvas.nativeElement.height = 600;
    this.particles = [];
    this.context.drawImage(
      this.image,
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.init();
  }

  ngAfterViewInit(): void {
    this.checkIfIsMobile();
    this.image.src = '../../../../assets/man.png';
    this.canvas.nativeElement.width = 900;
    this.canvas.nativeElement.height = 600;
    this.context = this.canvas?.nativeElement.getContext('2d', {
      willReadFrequently: true,
    })!;

    this.renderer.listen(this.image, 'load', () => {
      this.context.drawImage(
        this.image,
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );

      this.init();
      requestAnimationFrame(this.animate.bind(this));
    });
  }

  init() {
    const gap = 3;
    const pixels = this.context.getImageData(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    ).data;
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    for (let y = 0; y < this.canvas.nativeElement.height; y += gap) {
      for (let x = 0; x < this.canvas.nativeElement.width; x += gap) {
        const index = (y * this.canvas.nativeElement.width + x) * 4;
        // const brightness = (pixels[index + 1] + pixels[index + 2]) / 2;
        const brightness = pixels[index + 2] * 1;

        if (brightness > 93) {
          this.particles.push(
            new Particle(
              this.context,
              x + Math.round(Math.random() * 5),
              y + Math.round(Math.random() * 5)
            )
          );
        }
      }
    }
  }

  animate(now: number) {
    if (now - this.lastRender >= this.frameRate) {
      this.lastRender = now;
      if (window.scrollY < window.innerHeight - 10) {
        this.context.clearRect(
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height
        );
        for (const particle of this.particles) {
          particle.draw();
          particle.move(window.scrollY, this.mouse);
        }
      }
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  setMousePosition(event: MouseEvent) {
    this.mouse = { x: event.offsetX, y: event.offsetY };
    clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => {
      this.mouse = { x: 0, y: 0 };
    }, 50);
  }

  checkIfIsMobile() {
    window.innerWidth <= 768 ? (this.isMobile = true) : (this.isMobile = false);
  }
}

class Particle {
  context: CanvasRenderingContext2D;
  originalX = 0;
  originalY = 0;
  x = 0;
  y = 0;
  velocityX = 0;
  velocityY = 0;
  size = Math.random() * 2;
  onMouseInteractionMaxDistance = 0;
  angle = 0;
  speedX = 0;
  speedY = 0;
  touched = false;
  pointPositionWhenMouseTouched = { x: 0, y: 0 };
  reachedMax = false;
  targetX = 0;
  targetY = 0;
  vx = 0;
  vy = 0;
  spring = 0.011;
  friction = 0.89;

  constructor(conext: CanvasRenderingContext2D, x: number, y: number) {
    this.context = conext;
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
  }

  move(scrollTop: number, mousePosition: { x: number; y: number }) {
    const mouseDistanceX = mousePosition.x - this.x;
    const mouseDistanceY = mousePosition.y - this.y;
    const distanceMouseFromPoint = Math.sqrt(
      mouseDistanceX ** 2 + mouseDistanceY ** 2
    );

    if (!this.touched && distanceMouseFromPoint < 15) {
      this.onMouseInteractionMaxDistance = Math.random() * 150;
      this.angle = Math.random() * Math.PI * 2;
      this.speedX = Math.cos(this.angle) * 2;
      this.speedY = Math.sin(this.angle) * 2;
      this.touched = true;
      this.reachedMax = false;
      this.targetX = this.x;
      this.targetY = this.y;
      this.pointPositionWhenMouseTouched = { x: this.x, y: this.y };
    }

    if (!this.touched) {
      const maxDistance = scrollTop >= 0 ? scrollTop / 4 : 0;
      const dissipation = scrollTop >= 0 ? scrollTop / 60 : 0;
      const pointMoveSpeed = 0.1;

      this.velocityX =
        Math.random() < pointMoveSpeed
          ? Math.random() * dissipation - dissipation / 2
          : this.velocityX;
      this.velocityY =
        Math.random() < pointMoveSpeed
          ? Math.random() * dissipation - dissipation / 2
          : this.velocityY;

      this.x += this.velocityX;
      this.y += this.velocityY;

      const distanceX = this.originalX - this.x;
      const distanceY = this.originalY - this.y;

      if (distanceX > maxDistance || distanceX < maxDistance * -1) {
        this.x += distanceX / 20;
      }

      if (distanceY > maxDistance || distanceY < maxDistance * -1) {
        this.y += distanceY / 20;
      }
    } else {
      const distanceXFromPointWhenTouched =
        this.pointPositionWhenMouseTouched.x - this.x;
      const distanceYFromPointWhenTouched =
        this.pointPositionWhenMouseTouched.y - this.y;
      const distanceFromMouseHandledPoint = Math.sqrt(
        distanceXFromPointWhenTouched ** 2 + distanceYFromPointWhenTouched ** 2
      );
      if (
        !this.reachedMax &&
        this.onMouseInteractionMaxDistance > distanceFromMouseHandledPoint
      ) {
        const tx = (this.onMouseInteractionMaxDistance * this.speedX) / 20;
        const ty = (this.onMouseInteractionMaxDistance * this.speedY) / 20;
        this.x += tx;
        this.y += ty;
      } else {
        this.reachedMax = true;
      }

      if (this.reachedMax) {
        const dx = this.targetX - this.x,
          dy = this.targetY - this.y,
          ax = dx * this.spring,
          ay = dy * this.spring;

        this.vx += ax;
        this.vy += ay;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
      }

      if (Math.round(distanceFromMouseHandledPoint) <= 0 && this.reachedMax) {
        this.touched = false;
        this.reachedMax = false;
      }
    }
  }

  draw() {
    this.context.fillStyle = '#e0eeee';
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.context.fill();
  }
}
