export const numPattern = /\d+\.?\d*/g;

export type Property = (typeof properties)[number];
export const properties = [
  'opacity',
  'scale',
  'translateX',
  'translateY',
  'rotate',
] as const;

export const unit: Record<Property, string> = {
  opacity: '',
  scale: '',
  translateX: 'px',
  translateY: 'px',
  rotate: 'deg',
};
