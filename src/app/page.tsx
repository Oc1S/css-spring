'use client';

import React, { useEffect, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { spring } from 'motion';

import { numPattern } from '@/constants';
import { lastOfArray } from '@/utils';

import { ClientOnly } from '../components/client-only';
import { CodeBlock } from '../components/code-block';
import { Chart } from '../components/line-chart';
import { generate } from '../utils/generate-easing';

type Data = {
  time: number;
  value: number;
};

const toPercent = (num: number) => `${(num * 100).toFixed(0)}%`;

const formatNumber = (num: number) => {
  return +num.toFixed(2);
};

const generateKeyFrameString = (arr: Record<'percent' | 'value', number>[]) => {
  return `@keyframes spring-animation {
  ${arr.map(
    ({ percent, value }) => `${toPercent(percent)} {
    ${value}
  }`
  ).join(`
  `)}
}`;
};

const numbersToKeyFrameString = (numbers: number[]) => {
  const percent = 1 / (numbers.length - 1);
  return generateKeyFrameString(
    numbers.map((_, i) => ({
      percent: percent * i,
      value: numbers[i],
    }))
  );
};

const indexedValueArrToKeyFrameString = (indexedValues: IndexedValue[]) => {
  const percent = 1 / (lastOfArray(indexedValues).index - 1);
  return generateKeyFrameString(
    indexedValues.map(({ value, index }) => ({
      percent: percent * index,
      value,
    }))
  );
};

type IndexedValue = {
  value: number;
  index: number;
};

const getUpAndDowns = (numbers: number[]): IndexedValue[] => {
  if (numbers.length <= 1)
    return numbers.map((value, index) => ({
      value,
      index,
    }));
  const result: IndexedValue[] = [];

  for (let i = 1; i < numbers.length - 1; i++) {
    const front = numbers[i - 1];
    const current = numbers[i];
    const back = numbers[i + 1];
    const diffFront = front - current;
    const diffBack = current - back;
    if (diffFront * diffBack < 0) {
      result.push({ value: current, index: i });
    }
  }
  return [
    { value: numbers[0], index: 0 },
    ...result,
    { value: lastOfArray(numbers), index: numbers.length - 1 },
  ];
};

const getKeyPoints = (gen: KeyframeGenerator<number>) => {
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

const defaultConfig: Omit<Parameters<typeof spring>[0], 'keyframes'> = {
  duration: 800,
};

function Home() {
  const [config, setConfig] = useState(defaultConfig);

  const [info, setInfo] = useState({
    initial: true,
    min: 0,
    max: 0,
    duration: 0,
    result: '',
  });

  const { initial, result, ...restInfo } = info;
  const [keyPoints, setKeyPoints] = useState<Data[]>([]);

  useEffect(() => {
    const list: Data[] = [];
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    const duration = 500;

    const generator = spring({
      keyframes: [0, 200],
      bounce: 0.5,
      duration,
      // visualDuration: duration / 1_000,
    });

    const onUpdate: Parameters<typeof generate>[1]['onUpdate'] = (
      result,
      dur
    ) => {
      const { value } = result;
      min = Math.min(min, value);
      max = Math.max(max, value);
      list.push({ time: dur, value });
    };

    const { list: gList } = generate(generator, { onUpdate, step: 30 });

    const numbers = getKeyPoints(generator);
    const upAndDowns = getUpAndDowns(gList);

    const result = numbersToKeyFrameString(numbers);
    const keyPointString = indexedValueArrToKeyFrameString(upAndDowns);

    setKeyPoints(list);
    setInfo({
      initial: false,
      min,
      max,
      duration,
      result: result + keyPointString,
    });

    console.log(numbers, gList, upAndDowns, keyPointString);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-20 p-8 pt-32">
      <div className="flex flex-col gap-2 py-4">
        {initial || (
          <>
            {Object.entries(restInfo).map(([key, value]) => (
              <div key={key}>
                {key}:{value}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="flex justify-center gap-8">
        <ClientOnly>
          {() => <Chart data={keyPoints} keys="value"></Chart>}
        </ClientOnly>
        <CodeBlock className="max-h-[400px] overflow-x-hidden overflow-y-scroll">
          {result}
        </CodeBlock>
      </div>
    </div>
  );
}

const Root = () => {
  return (
    <NextUIProvider>
      <Home />
    </NextUIProvider>
  );
};

export default Root;
