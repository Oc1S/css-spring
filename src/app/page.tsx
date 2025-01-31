'use client';

import React, { useEffect } from 'react';
import { Button, Card, CardBody, NextUIProvider } from '@nextui-org/react';
import { useAtom } from 'jotai';
import { spring } from 'motion';

import { ClientOnly } from '@/components/client-only';
import { CodeBlock } from '@/components/code-block';
import { Config, configAtom } from '@/components/config';
import { InfoType, resultAtom } from '@/components/display';
import { Chart } from '@/components/line-chart';
import { Title } from '@/components/title';
import { lastOfArray } from '@/utils';
import {
  generateAnimation,
  generateKeyFrameString,
  generateLinearFuncString,
} from '@/utils/generate-easing';

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

function Home() {
  const [config, setConfig] = useAtom(configAtom);
  const { property, keyFrames } = config;

  const [info, setInfo] = useAtom(resultAtom);
  const { keyFrameString: keyFrameString } = info;

  const getResult = (useSample: boolean): InfoType => {
    const list: timedValue[] = [];
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    const configDuration = config.duration;

    const generator = spring({
      keyframes: keyFrames,
      bounce: 0.5,
      ...(config.useVisualDuration
        ? {
            visualDuration: configDuration / 1_000,
          }
        : {
            duration: configDuration,
          }),
    });

    const onUpdate: Parameters<typeof generateAnimation>[1]['onUpdate'] = (
      result,
      dur
    ) => {
      const { value } = result;
      min = Math.min(min, value);
      max = Math.max(max, value);
      list.push({ time: dur, value });
    };

    const { list: fullList, duration: finalDuration } = generateAnimation(
      generator,
      {
        onUpdate,
        step: 30,
      }
    );

    if (useSample) {
      const samples = getUpAndDowns(fullList);
      const keyPointString = indexedValueArrToKeyFrameString(samples, {
        property,
      });
      return {
        generator,
        initial: false,
        min,
        max,
        duration: finalDuration,
        keyFrameString: keyPointString,
        keyPoints: samples.map(({ value, index }) => {
          return {
            time: (finalDuration * index) / (list.length - 1),
            value,
          };
        }),
      };
    }

    const fullString = numbersToKeyFrameString(fullList, { property });
    const linearString = generateLinearFuncString(generator, finalDuration, 30);

    return {
      generator,
      initial: false,
      min,
      max,
      duration: finalDuration,
      keyFrameString: fullString,
      keyPoints: fullList.map((value, index) => {
        return {
          time: (finalDuration * index) / (list.length - 1),
          value,
        };
      }),
    };
  };

  useEffect(() => {
    setInfo(getResult(config.useSample));
  }, [
    config.property,
    config.keyFrames.toString(),
    config.duration,
    config.useVisualDuration,
    config.useSample,
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-12 p-8 pt-20">
      <div className="flex gap-8">
        <div>
          <Config />
        </div>

        <div className="flex flex-col gap-4">
          {info.keyPoints.length > 0 && (
            <Card>
              <CardBody>
                <ClientOnly>
                  {() => (
                    <>
                      <Chart data={info.keyPoints} keys="value" />
                    </>
                  )}
                </ClientOnly>
              </CardBody>
            </Card>
          )}

          {info.generator && (
            <Card>
              <CardBody>
                {
                  <div className="flex flex-col gap-2">
                    <div className="text-lg">Transition:</div>
                    {config.useSample ? (
                      <div className="flex flex-col gap-4 p-4">
                        linear() func is not compatible with sample mode
                        <Button
                          variant="flat"
                          color="secondary"
                          onPress={() => {
                            setConfig((prev) => ({
                              ...prev,
                              useSample: false,
                            }));
                          }}
                        >
                          Disable sample mode
                        </Button>
                      </div>
                    ) : (
                      <CodeBlock>
                        {'transition: all ' + info.generator.toString() || ''}
                      </CodeBlock>
                    )}
                  </div>
                }
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody>
              {keyFrameString && (
                <div className="flex flex-col gap-2">
                  <Title>Animation:</Title>
                  <CodeBlock className="h-auto">
                    {/* TODO: */}
                    {`animation: ${'0.5s'} 
spring-animation linear`}
                  </CodeBlock>
                  <CodeBlock>{keyFrameString}</CodeBlock>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
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
