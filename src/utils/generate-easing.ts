import { numPattern, Property } from '@/constants';

import { formatNumber, toPercent } from './format';

/**
  Progress within given range

  Given a lower limit and an upper limit, we return the progress
  (expressed as a number 0-1) represented by the given value, and
  limit that progress to within 0-1.

  @param [number]: Lower limit
  @param [number]: Upper limit
  @param [number]: Value to find progress within given range
  @return [number]: Progress of value within range as expressed 0-1
*/
export const progress = (from: number, to: number, value: number) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};

export type EasingFunction = (v: number) => number;

type GenerateConfig<T> = {
  step?: number;
  onUpdate?: (result: AnimationState<T>, duration: number) => void;
};
export const maxGeneratorDuration = 20_000;
export const generate = <T extends number>(
  generator: KeyframeGenerator<T>,
  { step = 10, onUpdate }: GenerateConfig<T>
) => {
  const list: number[] = [];
  let duration = 0;
  let state = generator.next(duration);
  while (!state.done && duration < maxGeneratorDuration) {
    state = generator.next(duration);
    list.push(state.value);
    onUpdate?.(state, duration);
    duration += step;
  }
  return { duration, list };
};

const formatOpacity = (value: number) => {
  return `opacity: ${value}`;
};

const formatScale = (value: number) => {
  return `transform: scale(${value})`;
};

const formatTranslateX = (value: number) => {
  return `transform: translateX(${value}px)`;
};

const formatTranslateY = (value: number) => {
  return `transform: translateY(${value}px)`;
};

export const generateKeyFrameString = (
  arr: Record<'percent' | 'value', number>[],
  config: {
    property: Property;
    name?: string;
  } = { property: 'opacity' }
) => {
  const { property, name = 'spring-animation' } = config;

  const format =
    property === 'opacity'
      ? formatOpacity
      : property === 'scale'
        ? formatScale
        : property === 'translateX'
          ? formatTranslateX
          : formatTranslateY;

  return `@keyframes ${name} {
  ${arr.map(
    ({ percent, value }) => `${toPercent(percent)} {
    ${format(formatNumber(value))};
  }`
  ).join(`
  `)}
}`;
};

/** @deprecated get points from KeyframeGenerator */
export const _getKeyPoints = (gen: KeyframeGenerator<number>) => {
  const stringArr = gen
    .toString()
    .split(' ')
    .slice(1)
    .join('')
    .match(numPattern);
  if (!stringArr) return [];
  const numbers = stringArr.map((numString) => {
    return formatNumber(+numString);
  });
  return numbers;
};
