'use client';

import { Code, NextUIProvider } from '@nextui-org/react';
import { spring } from 'motion';
import React, { useEffect, useState } from 'react';
import { Chart } from './components/line-chart';
import { ClientOnly } from './components/client-only';
import { generate } from './utils/generate-easing';
import { Copy } from './components/copy';

type Data = {
  time: number;
  value: number;
};

const formatNumber = (num: number) => {
  return +num.toFixed(2);
};

const config: Omit<Parameters<typeof spring>[0], 'keyframes'> = {
  duration: 800,
};

const CodeBlock = ({ children }: { children: string }) => {
  return (
    <div className="group relative w-2/5 break-all rounded bg-[#1a1a1a] p-4 pr-12 font-mono transition">
      <Copy
        content={children}
        className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100"
      ></Copy>
      {children}
    </div>
  );
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
    <div className="grid min-h-screen items-center justify-items-center gap-16 p-8 pb-10 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-2 py-4">
        {initial || (
          <>
            {Object.entries(restInfo).map(([key, value]) => (
              <div key={key}>
                {key}:{value}
              </div>
            ))}
            <CodeBlock>{result}</CodeBlock>
          </>
        )}
      </div>
      <div>
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
