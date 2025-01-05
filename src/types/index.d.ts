interface AnimationState<V> {
  value: V;
  done: boolean;
}

interface KeyframeGenerator<V = number> {
  calculatedDuration: null | number;
  next: (t: number) => AnimationState<V>;
  toString: () => string;
}
