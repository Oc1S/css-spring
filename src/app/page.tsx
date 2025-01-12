'use client';

import React, { useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { atom, useAtom } from 'jotai';
import { spring } from 'motion';

import { Config, configAtom } from '@/components/config';
import { lastOfArray } from '@/utils';

import { ClientOnly } from '../components/client-only';
import { CodeBlock } from '../components/code-block';
import { Chart } from '../components/line-chart';
import { generate, generateKeyFrameString } from '../utils/generate-easing';

type Data = {
  time: number;
  value: number;
};

const numbersToKeyFrameString = (
  numbers: number[],
  config: Parameters<typeof generateKeyFrameString>[1]
) => {
  const percent = 1 / (numbers.length - 1);
  return generateKeyFrameString(
    numbers.map((_, i) => ({
      percent: percent * i,
      value: numbers[i],
    })),
    config
  );
};

const indexedValueArrToKeyFrameString = (
  indexedValues: IndexedValue[],
  config: Parameters<typeof generateKeyFrameString>[1]
) => {
  /** 1 / gutter */
  const percent = 1 / lastOfArray(indexedValues).index;

  return generateKeyFrameString(
    indexedValues.map(({ value, index }) => ({
      percent: percent * index,
      value,
    })),
    config
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

const resultAtom = atom({
  initial: true,
  min: 0,
  max: 0,
  duration: 0,
  fullString: '',
  keyPointString: '',
  fullList: [] as number[],
  samples: [] as IndexedValue[],
  keyPoints: [] as Data[],
});

function Home() {
  const [config] = useAtom(configAtom);
  const { property, keyFrames } = config;

  const [info, setInfo] = useAtom(resultAtom);
  const { initial, keyPointString: keyFrameString, min, max, duration } = info;

  useEffect(() => {
    const list: Data[] = [];
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    const duration = 500;

    const generator = spring({
      keyframes: keyFrames,
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

    const { list: fullList } = generate(generator, { onUpdate, step: 30 });
    const samples = getUpAndDowns(fullList);

    const fullString = numbersToKeyFrameString(fullList, { property });
    const keyPointString = indexedValueArrToKeyFrameString(samples, {
      property,
    });

    setInfo({
      initial: false,
      min,
      max,
      duration,
      fullString,
      keyPointString,
      fullList,
      samples,
      keyPoints: samples.map(({ value, index }) => {
        return {
          time: (duration * index) / (list.length - 1),
          value,
        };
      }),
    });

    // console.log('full:', fullList, fullString, samples, keyPointString);
    // console.log('KeyPoints@:', samples, keyPointString);
  }, [config.property, config.keyFrames.toString()]);

  console.log(config.keyFrames.toString());

  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-20 p-8 pt-32">
      <div className="flex gap-4 py-4">
        {initial || (
          <div className="flex flex-col gap-2 py-4">
            {Object.entries({ min, max, duration }).map(([key, value]) => (
              <div key={key}>
                {key}:{value}
              </div>
            ))}
          </div>
        )}
        <Config />
      </div>
      <div className="flex items-center justify-center gap-8">
        <ClientOnly>
          {() => (
            <>
              <Chart data={info.keyPoints} keys="value"></Chart>
            </>
          )}
        </ClientOnly>

        <style>{keyFrameString}</style>
        {keyFrameString && (
          <CodeBlock className="max-h-[400px] overflow-x-hidden overflow-y-scroll">
            {keyFrameString}
          </CodeBlock>
        )}
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
