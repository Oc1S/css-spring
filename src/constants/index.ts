export const numPattern = /\d+\.?\d*/g;

export type Property = (typeof properties)[number];
export const properties = [
  'opacity',
  'scale',
  'translateX',
  'translateY',
  'rotate',
] as const;
export const propertyMap: Record<
  Property,
  { min: number; max: number; default: AnimationKeyFrames }
> = {
  opacity: {
    min: 0,
    max: 1,
    default: [0, 1],
  },
  scale: {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    default: [0, 1],
  },
  translateX: {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    default: [0, 100],
  },
  translateY: {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    default: [0, 100],
  },
  rotate: {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    default: [0, 100],
  },
};

export const unit: Record<Property, string> = {
  opacity: '',
  scale: '',
  translateX: 'px',
  translateY: 'px',
  rotate: 'deg',
};
