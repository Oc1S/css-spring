'use client';

import React, { useEffect, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { spring } from 'motion';

import { ClientOnly } from '../components/client-only';
import { CodeBlock } from '../components/code-block';
import { Chart } from '../components/line-chart';
import { generate } from '../utils/generate-easing';

type Data = {
  time: number;
  value: number;
};

const numPattern = /\d+\.?\d*/g;
const toPercent = (num: number) => `${(num * 100).toFixed(0)}%`;

const formatNumber = (num: number) => {
  return +num.toFixed(2);
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

    const endDuration = generate(generator, {
      onUpdate: (result, dur) => {
        const { value } = result;
        min = Math.min(min, value);
        max = Math.max(max, value);
        list.push({ time: dur, value });
      },
    });

    const stringArr = generator
      .toString()
      .split(' ')
      .slice(1)
      .join('')
      .match(numPattern);
    if (!stringArr) return;

    const numbers = stringArr.map((numString) => {
      return formatNumber(+numString);
    });

    const percent = 1 / (numbers.length - 1);

    numbers.forEach((_, i) => {
      console.log(`${toPercent(percent * i)}: ${numbers[i]}`);
    });

    const result = `
@keyframes spring-animation {
${numbers.map(
  (_, i) => `${toPercent(percent * i)} {
   ${numbers[i]}
}`
)}
}`;

    setKeyPoints(list);
    setInfo({
      initial: false,
      min,
      max,
      duration,
      result,
    });

    console.log(endDuration, list, generator.toString(), numbers);
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
