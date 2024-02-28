export interface MagneticOptions {
  hDelta?: number;
  vDelta?: number;
  speed?: number;
  releaseSpeed?: number;
  scroller?: {
    selector: string;
    scrollType: 'normal' | 'transform';
  };
};
