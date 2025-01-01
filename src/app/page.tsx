'use client';

import React, { useEffect, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { spring } from 'motion';

import { ClientOnly } from './components/client-only';
import { CodeBlock } from './components/code-block';
import { Chart } from './components/line-chart';
import { generate } from './utils/generate-easing';

type Data = {
  time: number;
  value: number;
};

export const formatNumber = (num: number) => {
  return +num.toFixed(2);
};

const config: Omit<Parameters<typeof spring>[0], 'keyframes'> = {
  duration: 800,
};

function Home() {
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
      keyframes: [0, 100],
      // bounce: 0,
      duration,
      // visualDuration: duration / 1_000,
    });

    const endDuration = generate(generator, {
      onUpdate: (result, dur) => {
        const { value } = result;
        min = Math.min(min, value);
        max = Math.max(max, value);
        list.push({ time: dur, value });
      },
    });

    setKeyPoints(list);
    setInfo({
      initial: false,
      min,
      max,
      duration,
      result: generator.toString(),
    });

    console.log(endDuration, list, generator.toString().split(','));
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
        {/* <div
          className="demo h-40 w-40 bg-white"
          onClick={(e) => {
            const element = e.currentTarget;
            element.animate(
              [{ transform: 'scale(1)' }, { transform: 'scale(2)' }],
              {
                duration: 1000,
                iterations: 1,
                fill: 'forwards',
                easing: 'linear(0, 0.1, 1.5)',
              }
            );
          }}
        ></div> */}
        <ClientOnly>
          {() => <Chart data={keyPoints} keys="value"></Chart>}
        </ClientOnly>
        <CodeBlock>{result}</CodeBlock>
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
