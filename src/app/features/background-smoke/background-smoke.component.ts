import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background-smoke',
  standalone: true,
  imports: [],
  templateUrl: './background-smoke.component.html',
  styleUrl: './background-smoke.component.scss',
})
export class BackgroundSmokeComponent {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  params = {
    alpha: false,
    preserveDrawingBuffer: false,
    depth: false,
    stencil: false,
  };
  gl!: WebGLRenderingContext;
  halfFloat: OES_texture_half_float | null = null;
  support_linear_float: OES_texture_half_float_linear | null = null;

  TEXTURE_DOWNSAMPLE = 0.01;
  TEXTURE_WIDTH!: number;
  TEXTURE_HEIGHT!: number;
  DENSITY_DISSIPATION = 0.95;
  VELOCITY_DISSIPATION = 0.96;
  SPLAT_RADIUS = 0.005;
  CURL = 20;
  PRESSURE_ITERATIONS = 5;
  texId = -1;
  density!: {
    readonly first: (WebGLFramebuffer | null)[];
    readonly second: (WebGLFramebuffer | null)[];
    swap: () => void;
  };
  velocity!: {
    readonly first: (WebGLFramebuffer | null)[];
    readonly second: (WebGLFramebuffer | null)[];
    swap: () => void;
  };
  divergence!: (WebGLFramebuffer | null)[];
  curl!: (WebGLFramebuffer | null)[];
  pressure!: {
    readonly first: (WebGLFramebuffer | null)[];
    readonly second: (WebGLFramebuffer | null)[];
    swap: () => void;
  };
  displayProgram!: GLProgram;
  splatProgram!: GLProgram;
  advectionProgram!: GLProgram;
  divergenceProgram!: GLProgram;
  curlProgram!: GLProgram;
  vorticityProgram!: GLProgram;
  pressureProgram!: GLProgram;
  gradienSubtractProgram!: GLProgram;
  pointer!: {
    x: number;
    y: number;
    deltax: number;
    deltay: number;
    down: boolean;
    moved: boolean;
    color: number[];
  };
  isMouseOverButton: boolean = false;

  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(e: MouseEvent) {
    if (!this.isMouseOverButton) {
      this.pointer.moved = this.pointer.down;
      this.pointer.deltax = this.clampDelta(e.x - this.pointer.x);
      this.pointer.deltay = this.clampDelta(e.y - this.pointer.y);
      this.pointer.x = e.x;
      this.pointer.y = e.y;
    }
  }

  ngAfterViewInit(): void {
    this.initdata();
    // this.resizeCanvas();
    // this.blit();
    // this.splat();
    this.update();
    this.onPointerDown();
    // this.canvas.nativeElement.addEventListener('mousedown', () =>
    //   this.onPointerDown()
    // );

    // this.canvas.nativeElement.addEventListener('touchstart', () =>
    //   this.onPointerDown()
    // );
    // this.canvas.nativeElement.addEventListener('touchmove', (e) => {
    //   e.preventDefault();
    //   const touch = e.touches[0];
    //   this.pointer.moved = this.pointer.down;
    //   this.pointer.deltax = this.clampDelta(touch.pageX - this.pointer.x);
    //   this.pointer.deltay = this.clampDelta(touch.pageY - this.pointer.y);
    //   this.pointer.x = touch.pageX;
    //   this.pointer.y = touch.pageY;
    // });
    // window.addEventListener('mouseup', () => this.onPointerUp());
    // window.addEventListener('touchend', () => this.onPointerUp());

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.isMouseOverButton = true;
      });
      el.addEventListener('mouseleave', () => {
        this.isMouseOverButton = false;
      });
    });
  }

  initdata() {
    this.gl =
      (this.canvas.nativeElement.getContext(
        'webgl',
        this.params
      ) as WebGLRenderingContext) ||
      (this.canvas.nativeElement.getContext(
        'experimental-webgl',
        this.params
      ) as WebGLRenderingContext);
    this.halfFloat = this.gl.getExtension('OES_texture_half_float');
    this.support_linear_float = this.gl.getExtension(
      'OES_texture_half_float_linear'
    );

    this.TEXTURE_WIDTH = this.gl.drawingBufferWidth >> this.TEXTURE_DOWNSAMPLE;
    this.TEXTURE_HEIGHT =
      this.gl.drawingBufferHeight >> this.TEXTURE_DOWNSAMPLE;

    const baseVertexShader = this.compileShader(
      this.gl.VERTEX_SHADER,
      `
        precision highp float;
    
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
    
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `
    );

    //change background color in gl_FragColor
    const displayShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
    
        void main () {
          gl_FragColor = texture2D(uTexture, vUv) + vec4(0.0705, 0.0745, 0.082341, 1.0);
        }
    `
    );

    const splatShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
    
        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
    `
    );

    const advectionManualFilteringShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;
    
        vec4 bilerp (in sampler2D sam, in vec2 p) {
            vec4 st;
            st.xy = floor(p - 0.5) + 0.5;
            st.zw = st.xy + 1.0;
            vec4 uv = st * texelSize.xyxy;
            vec4 a = texture2D(sam, uv.xy);
            vec4 b = texture2D(sam, uv.zy);
            vec4 c = texture2D(sam, uv.xw);
            vec4 d = texture2D(sam, uv.zw);
            vec2 f = p - st.xy;
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
    
        void main () {
            vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
            gl_FragColor = dissipation * bilerp(uSource, coord);
            gl_FragColor.a = 1.0;
        }
    `
    );

    const advectionShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;
    
        void main () {
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            gl_FragColor = dissipation * texture2D(uSource, coord);
        }
    `
    );

    const divergenceShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
    
        vec2 sampleVelocity (in vec2 uv) {
            vec2 multiplier = vec2(1.0, 1.0);
            if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
            if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
            if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
            if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
            return multiplier * texture2D(uVelocity, uv).xy;
        }
    
        void main () {
            float L = sampleVelocity(vL).x;
            float R = sampleVelocity(vR).x;
            float T = sampleVelocity(vT).y;
            float B = sampleVelocity(vB).y;
            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
    `
    );

    const curlShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
    
        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
        }
    `
    );

    const vorticityShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
    
        void main () {
            float L = texture2D(uCurl, vL).y;
            float R = texture2D(uCurl, vR).y;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));
            force *= 1.0 / length(force + 0.00001) * curl * C;
            vec2 vel = texture2D(uVelocity, vUv).xy;
            gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
        }
    `
    );

    const pressureShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
    
        vec2 boundary (in vec2 uv) {
            uv = min(max(uv, 0.0), 1.0);
            return uv;
        }
    
        void main () {
            float L = texture2D(uPressure, boundary(vL)).x;
            float R = texture2D(uPressure, boundary(vR)).x;
            float T = texture2D(uPressure, boundary(vT)).x;
            float B = texture2D(uPressure, boundary(vB)).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
    `
    );

    const gradientSubtractShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision highp float;
    
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
    
        vec2 boundary (in vec2 uv) {
            uv = min(max(uv, 0.0), 1.0);
            return uv;
        }
    
        void main () {
            float L = texture2D(uPressure, boundary(vL)).x;
            float R = texture2D(uPressure, boundary(vR)).x;
            float T = texture2D(uPressure, boundary(vT)).x;
            float B = texture2D(uPressure, boundary(vB)).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `
    );

    this.density = this.createDoubleFBO(
      this.TEXTURE_WIDTH,
      this.TEXTURE_HEIGHT,
      this.gl.RGBA,
      this.halfFloat!.HALF_FLOAT_OES,
      this.support_linear_float ? this.gl.LINEAR : this.gl.NEAREST
    );
    this.velocity = this.createDoubleFBO(
      this.TEXTURE_WIDTH,
      this.TEXTURE_HEIGHT,
      this.gl.RGBA,
      this.halfFloat!.HALF_FLOAT_OES,
      this.support_linear_float ? this.gl.LINEAR : this.gl.NEAREST
    );
    this.divergence = this.createFBO(
      this.TEXTURE_WIDTH,
      this.TEXTURE_HEIGHT,
      this.gl.RGBA,
      this.halfFloat!.HALF_FLOAT_OES,
      this.gl.NEAREST
    );
    this.curl = this.createFBO(
      this.TEXTURE_WIDTH,
      this.TEXTURE_HEIGHT,
      this.gl.RGBA,
      this.halfFloat!.HALF_FLOAT_OES,
      this.gl.NEAREST
    );
    this.pressure = this.createDoubleFBO(
      this.TEXTURE_WIDTH,
      this.TEXTURE_HEIGHT,
      this.gl.RGBA,
      this.halfFloat!.HALF_FLOAT_OES,
      this.gl.NEAREST
    );

    this.displayProgram = new GLProgram(
      baseVertexShader,
      displayShader,
      this.gl
    );
    this.splatProgram = new GLProgram(baseVertexShader, splatShader, this.gl);
    this.advectionProgram = new GLProgram(
      baseVertexShader,
      this.support_linear_float
        ? advectionShader
        : advectionManualFilteringShader,
      this.gl
    );
    this.divergenceProgram = new GLProgram(
      baseVertexShader,
      divergenceShader,
      this.gl
    );
    this.curlProgram = new GLProgram(baseVertexShader, curlShader, this.gl);
    this.vorticityProgram = new GLProgram(
      baseVertexShader,
      vorticityShader,
      this.gl
    );
    this.pressureProgram = new GLProgram(
      baseVertexShader,
      pressureShader,
      this.gl
    );
    this.gradienSubtractProgram = new GLProgram(
      baseVertexShader,
      gradientSubtractShader,
      this.gl
    );

    this.pointer = {
      x: this.canvas.nativeElement.width * 0.5,
      y: this.canvas.nativeElement.height * 0.7,
      deltax: 0,
      deltay: -500,
      down: true,
      moved: false,
      color: [0, 0, 0],
    };
  }

  compileShader(type: number, source: string) {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(shader);
    }
    return shader;
  }

  blit() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      this.gl.STATIC_DRAW
    );
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(0);

    return (destination: WebGLFramebuffer | null) => {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, destination);
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    };
  }

  clear(target: WebGLFramebuffer | null) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  createFBO(
    width: number,
    height: number,
    format: number,
    type: number,
    param: number
  ) {
    this.texId++;
    this.gl.activeTexture(this.gl.TEXTURE0 + this.texId);
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      param
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      param
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      format,
      width,
      height,
      0,
      format,
      type,
      null
    );

    const fbo = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    );
    this.gl.viewport(0, 0, width, height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    return [texture, fbo, this.texId];
  }

  createDoubleFBO(
    width: number,
    height: number,
    format: number,
    type: number,
    param: number
  ) {
    let fbo1 = this.createFBO(width, height, format, type, param);
    let fbo2 = this.createFBO(width, height, format, type, param);

    return {
      get first() {
        return fbo1;
      },
      get second() {
        return fbo2;
      },
      swap: () => {
        let temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  update() {
    this.resizeCanvas();

    this.gl.viewport(0, 0, this.TEXTURE_WIDTH, this.TEXTURE_HEIGHT);

    this.advectionProgram.bind();
    this.gl.uniform2f(
      this.advectionProgram.uniforms['texelSize'],
      1.0 / this.TEXTURE_WIDTH,
      1.0 / this.TEXTURE_HEIGHT
    );
    this.gl.uniform1i(
      this.advectionProgram.uniforms['uVelocity'],
      +this.velocity.first[2]!
    );
    this.gl.uniform1i(
      this.advectionProgram.uniforms['uSource'],
      +this.velocity.first[2]!
    );
    this.gl.uniform1f(this.advectionProgram.uniforms['dt'], 0.016);
    this.gl.uniform1f(
      this.advectionProgram.uniforms['dissipation'],
      this.VELOCITY_DISSIPATION
    );
    this.blit()(this.velocity.second[1]);
    this.velocity.swap();

    this.gl.uniform1i(
      this.advectionProgram.uniforms['uVelocity'],
      +this.velocity.first[2]!
    );
    this.gl.uniform1i(
      this.advectionProgram.uniforms['uSource'],
      +this.density.first[2]!
    );
    this.gl.uniform1f(
      this.advectionProgram.uniforms['dissipation'],
      this.DENSITY_DISSIPATION
    );
    this.blit()(this.density.second[1]);
    this.density.swap();

    if (this.pointer.moved) {
      this.splat();
    }

    this.curlProgram.bind();
    this.gl.uniform2f(
      this.curlProgram.uniforms['texelSize'],
      1.0 / this.TEXTURE_WIDTH,
      1.0 / this.TEXTURE_HEIGHT
    );

    this.gl.uniform1i(
      this.curlProgram.uniforms['uVelocity'],
      +this.velocity.first[2]!
    );
    this.blit()(this.curl[1]);

    this.vorticityProgram.bind();
    this.gl.uniform2f(
      this.vorticityProgram.uniforms['texelSize'],
      1.0 / this.TEXTURE_WIDTH,
      1.0 / this.TEXTURE_HEIGHT
    );
    this.gl.uniform1i(
      this.vorticityProgram.uniforms['uVelocity'],
      +this.velocity.first[2]!
    );
    this.gl.uniform1i(this.vorticityProgram.uniforms['uCurl'], +this.curl[2]!);
    this.gl.uniform1f(this.vorticityProgram.uniforms['curl'], this.CURL);
    this.gl.uniform1f(this.vorticityProgram.uniforms['dt'], 0.016);
    this.blit()(this.velocity.second[1]);
    this.velocity.swap();

    this.divergenceProgram.bind();
    this.gl.uniform2f(
      this.divergenceProgram.uniforms['texelSize'],
      1.0 / this.TEXTURE_WIDTH,
      1.0 / this.TEXTURE_HEIGHT
    );
    this.gl.uniform1i(
      this.divergenceProgram.uniforms['uVelocity'],
      +this.velocity.first[2]!
    );
    this.blit()(this.divergence[1]);

    this.clear(this.pressure.first[1]);
    this.pressureProgram.bind();
    this.gl.uniform2f(
      this.pressureProgram.uniforms['texelSize'],
      1.0 / this.TEXTURE_WIDTH,
      1.0 / this.TEXTURE_HEIGHT
    );
    this.gl.uniform1i(
      this.pressureProgram.uniforms['uDivergence'],
      +this.divergence[2]!
    );
    for (let i = 0; i < this.PRESSURE_ITERATIONS; i++) {
      this.gl.uniform1i(
        this.pressureProgram.uniforms['uPressure'],
        +this.pressure.first[2]!
      );
      this.blit()(this.pressure.second[1]);
      this.pressure.swap();
    }

    this.gradienSubtractProgram.bind();
    this.gl.uniform2f(
      this.gradienSubtractProgram.uniforms['texelSize'],
      1.0 / this.TEXTURE_WIDTH,
      1.0 / this.TEXTURE_HEIGHT
    );
    this.gl.uniform1i(
      this.gradienSubtractProgram.uniforms['uPressure'],
      +this.pressure.first[2]!
    );
    this.gl.uniform1i(
      this.gradienSubtractProgram.uniforms['uVelocity'],
      +this.velocity.first[2]!
    );
    this.blit()(this.velocity.second[1]);
    this.velocity.swap();

    this.gl.viewport(
      0,
      0,
      this.gl.drawingBufferWidth,
      this.gl.drawingBufferHeight
    );
    this.displayProgram.bind();
    this.gl.uniform1i(
      this.displayProgram.uniforms['uTexture'],
      +this.density.first[2]!
    );
    this.blit()(null);
    this.pointer.moved = false;
    requestAnimationFrame(this.update.bind(this));
  }

  splat() {
    this.splatProgram.bind();
    this.gl.uniform1i(
      this.splatProgram.uniforms['uTarget'],
      +this.velocity.first[2]!
    );
    this.gl.uniform1f(
      this.splatProgram.uniforms['aspectRatio'],
      this.TEXTURE_WIDTH / this.TEXTURE_HEIGHT
    );
    this.gl.uniform2f(
      this.splatProgram.uniforms['point'],
      this.pointer.x / this.canvas.nativeElement.width,
      1.0 - this.pointer.y / this.canvas.nativeElement.height
    );
    this.gl.uniform3f(
      this.splatProgram.uniforms['color'],
      this.pointer.deltax,
      -this.pointer.deltay,
      1.0
    );
    this.gl.uniform1f(this.splatProgram.uniforms['radius'], this.SPLAT_RADIUS);
    this.blit()(this.velocity.second[1]);
    this.velocity.swap();

    this.gl.uniform1i(
      this.splatProgram.uniforms['uTarget'],
      +this.density.first[2]!
    );
    this.gl.uniform3f(
      this.splatProgram.uniforms['color'],
      this.pointer.color[0] * 0.2,
      this.pointer.color[1] * 0.2,
      this.pointer.color[2] * 0.2
    );
    this.blit()(this.density.second[1]);
    this.density.swap();
  }

  resizeCanvas() {
    if (
      this.canvas.nativeElement.width !=
        this.canvas.nativeElement.clientWidth ||
      this.canvas.nativeElement.height != this.canvas.nativeElement.clientHeight
    ) {
      const displayHeight = this.canvas.nativeElement.clientHeight;
      this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;
      this.canvas.nativeElement.height = displayHeight;
    }
  }

  clampDelta(delta: number) {
    return delta * 10;
  }

  onPointerDown() {
    this.pointer.down = true;
    this.pointer.deltax = 0;
    this.pointer.deltay = 0;
    this.pointer.color = [0.57, 0.988, 0.988]; //smoke color
  }
}

class GLProgram {
  uniforms: { [key: string]: WebGLUniformLocation } = {};
  program: WebGLProgram;
  gl: WebGLRenderingContext;
  constructor(
    vertexShader: WebGLProgram,
    fragmentShader: WebGLShader,
    gl: WebGLRenderingContext
  ) {
    this.program = gl.createProgram()!;
    this.gl = gl;

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw this.gl.getProgramInfoLog(this.program);
    }

    const uniformCount = this.gl.getProgramParameter(
      this.program,
      this.gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = this.gl.getActiveUniform(this.program, i)!.name;
      this.uniforms[uniformName] = this.gl.getUniformLocation(
        this.program,
        uniformName
      ) as WebGLUniformLocation;
    }
  }
  bind() {
    this.gl.useProgram(this.program);
  }
}
