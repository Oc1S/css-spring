interface AnimationState<V> {
  value: V;
  done: boolean;
}

interface KeyframeGenerator<V = number> {
  calculatedDuration: null | number;
  next: (t: number) => AnimationState<V>;
  toString: () => string;
}

type AnimationKeyFrames = number[];

type TimedValue = {
  time: number;
  value: number;
};

type IndexedValue = {
  value: number;
  index: number;
};
