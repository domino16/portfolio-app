import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Section2Component } from './section2/section2.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Section2Component],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;
  mouse = { x: 0, y: 0 };
  particlesArray: Array<Particle> = [];

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setCanvasContext();
  }

  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d')!;
    this.setCanvasContext();
    this.init();
    this.animate();
  }

  setCanvasContext() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
  }

  onCanvasClick($event: MouseEvent): void {
    this.mouse.x = $event.x;
    this.mouse.y = $event.y + window.scrollY - window.innerHeight;
    this.init();
  }


  init() {
    for (let i = 0; i < 1; i++) {
      this.particlesArray.push(
        new Particle(
          this.mouse.x,
          this.mouse.y,
          this.context
        )
      );
    }
  }

  handleParticles() {
    for (let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].update();
      this.particlesArray[i].draw();
      for (let j = i; j < this.particlesArray.length; j++) {
        const dx = this.particlesArray[i].x - this.particlesArray[j].x;
        const dy = this.particlesArray[i].y - this.particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < 100){
          this.context.beginPath();
          this.context.strokeStyle = 'red';
          this.context.lineWidth =  this.particlesArray[i].size / 10;
          this.context.moveTo(this.particlesArray[i].x, this.particlesArray[i].y);
          this.context.lineTo(this.particlesArray[j].x, this.particlesArray[j].y);
          this.context.stroke();
          this.context.closePath();
        }

      }
      if (this.particlesArray[i].size <= 1) {
        this.particlesArray.splice(i, 1);
        i--;
      }
    }
  }

  animate() {
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.handleParticles();
    requestAnimationFrame(this.animate.bind(this));
  }
}

class Particle {
  x!: number;
  y!: number;
  size!: number;
  speedX!: number;
  speedY!: number;
  ctx: CanvasRenderingContext2D;

  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 10 + 1;
    this.speedX = Math.random() * 2 - 1.5;
    this.speedY = Math.random() * 2 - 1.5;
    this.ctx = ctx;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }

  draw() {
    this.ctx.fillStyle = 'rgb(220, 44, 44)';
    this.ctx.beginPath();
    // this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
