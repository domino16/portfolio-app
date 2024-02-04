import {
  AfterViewInit,
  Component,
  ElementRef,
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
})
export class Section2Component implements AfterViewInit {
  private readonly renderer = inject(Renderer2);

  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;
  image = new Image();
  particles: Particle[] = [];

  ngAfterViewInit(): void {
    this.image.src = '../../../../assets/man.png';
    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 800;
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
      this.animate();
    });

   
  }

  init() {
    const gap = 4;
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
        const index = (y * this.canvas.nativeElement.height + x) * 4;
        const brightness = (pixels[index + 1] + pixels[index + 2]) / 2;

        if (brightness > 95 && Math.random() > 0.6) {
          this.particles.push(
            new Particle(this.canvas.nativeElement, this.context, x, y)
          );
        }
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
    this.particles.forEach((particle) => {
      particle.draw();
      particle.move(window.scrollY);
    });
    requestAnimationFrame(this.animate.bind(this));
  }
}

class Particle {
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  originalX = 0;
  originalY = 0;
  x = 0;
  y = 0;
  velocityX = 0;
  velocityY = 0;
  size = Math.random() * 3 + 1;

  constructor(
    canvas: HTMLCanvasElement,
    conext: CanvasRenderingContext2D,
    x: number,
    y: number
  ) {
    this.canvas = canvas;
    this.context = conext;
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
  }

  move(scrollTop: number) {
    const maxDistance = scrollTop > 10 ? scrollTop / 2 : 0;
    const dissipation = scrollTop > 10 ? scrollTop / 25 : 0;

    this.velocityX = Math.random() * dissipation - dissipation / 2;
    this.velocityY = Math.random() * dissipation - dissipation / 2;

    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.originalX - this.x > maxDistance) {
      this.x = Math.round(this.x);
      this.x += 1;
    } else if (this.originalX - this.x < maxDistance * -1) {
      this.x = Math.round(this.x);
      this.x -= 1;
    }

    if (this.originalY - this.y > maxDistance) {
      this.y = Math.round(this.y);
      this.y += 1;
    } else if (this.originalY - this.y < maxDistance * -1) {
      this.y = Math.round(this.y);
      this.y -= 1;
    }
  }

  draw() {
    this.context.fillStyle = 'white';
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.context.fill();
  }
}
