import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react';
import { atom, useAtom } from 'jotai';
import { useDebounceCallback } from 'usehooks-ts';

import { properties, Property, propertyMap } from '@/constants';
import { lastOfArray } from '@/utils';

export type IConfig = {
  duration: number;
  useVisualDuration?: boolean;
  keyFrames: AnimationKeyFrames;
  property: Property;
  useSample: boolean;
};

const defaultConfig: IConfig = {
  keyFrames: [0, 1],
  useVisualDuration: true,
  property: properties[0],
  duration: 500,
  useSample: false,
};
export const configAtom = atom(defaultConfig);

type KeyLabel<T> = {
  key: T;
  label: string;
};

const PropertyConfig = () => {
  const [config, setConfig] = useAtom(configAtom);

  return (
    <>
      <Select<KeyLabel<Property>>
        selectedKeys={[config.property]}
        className="w-40"
        label="Target Property"
        placeholder="Select target property"
        items={properties.map((p) => ({ key: p, label: p }))}
        onSelectionChange={(p) => {
          setConfig((c) => ({
            ...c,
            property: p.currentKey as Property,
            keyFrames: propertyMap[p.currentKey as Property].default,
          }));
        }}
      >
        {(animal) => <SelectItem>{animal.label}</SelectItem>}
      </Select>
    </>
  );
};

function KeyFrames() {
  const [config, setConfig] = useAtom(configAtom);
  const { property, keyFrames } = config;
  const configDesc = propertyMap[property];
  const frames = keyFrames;

  const maxFrame = lastOfArray(frames);
  const step = maxFrame > 10 ? 1 : 0.1;

  const [values, setValues] = useState(frames);

  const updateKeyFrames = useDebounceCallback((vals: AnimationKeyFrames) => {
    setConfig((c) => ({ ...c, keyFrames: vals }));
  }, 500);

  useEffect(() => {
    setValues(frames);
  }, [frames.toString()]);

  useEffect(() => {
    updateKeyFrames(values);
  }, [values.toString()]);

  return (
    <div className="flex gap-4">
      {values.map((frame, index) => {
        return (
          <Input
            key={index}
            className="w-40"
            label={index === 0 ? 'From' : 'To'}
            placeholder="0"
            type="number"
            step={step}
            labelPlacement="outside"
            min={configDesc.min}
            max={configDesc.max}
            value={frame.toString()}
            onValueChange={(val) => {
              setValues((v) => {
                const newValues = [...v];
                newValues[index] = parseFloat(val);
                return newValues;
              });
            }}
          />
        );
      })}
    </div>
  );
}

const Duration = () => {
  const [config, setConfig] = useAtom(configAtom);
  const { duration } = config;

  const onValueChange = useDebounceCallback((value: string) => {
    setConfig((c) => ({ ...c, duration: parseInt(value) }));
  }, 500);

  return (
    <div className="flex gap-4">
      <Input
        className="w-40"
        label="Duration(ms)"
        placeholder="0"
        type="number"
        step={1}
        labelPlacement="outside"
        min={0}
        defaultValue={String(duration || 0)}
        onValueChange={(val) => onValueChange(val)}
      />
    </div>
  );
};

export const Config = () => {
  const [config, setConfig] = useAtom(configAtom);

  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-12">
          <div className="flex flex-col gap-4">
            <Checkbox
              isSelected={config.useVisualDuration}
              onValueChange={(s) => {
                setConfig((c) => ({ ...c, useVisualDuration: s }));
              }}
            >
              useVisualDuration
            </Checkbox>

            <Tooltip
              content="Sample: Pick only key points, for those who need the generated css string to be short"
              placement="right"
              delay={500}
              closeDelay={0}
            >
              <Checkbox
                isSelected={config.useSample}
                onValueChange={(s) => {
                  setConfig((c) => ({ ...c, useSample: s }));
                }}
              >
                useSample
              </Checkbox>
            </Tooltip>
          </div>
          <div className="flex flex-col items-start gap-4">
            <PropertyConfig />
            <KeyFrames />
            <Duration />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
