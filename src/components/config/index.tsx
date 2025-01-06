import { Input, Select, SelectItem } from '@nextui-org/react';
import { atom, useAtom } from 'jotai';

import { properties, Property, propertyMap } from '@/constants';

export type IConfig = {
  duration?: number;
  visualDuration?: number;
  keyFrames: AnimationKeyFrames;
  property: Property;
};

const defaultConfig: IConfig = {
  keyFrames: [0, 1],
  property: properties[0],
  duration: 800,
};
export const configAtom = atom(defaultConfig);

type KeyLabel<T> = {
  key: T;
  label: string;
};

export default function KeyFrames() {
  const [config, setConfig] = useAtom(configAtom);
  const { property, keyFrames } = config;
  const configDesc = propertyMap[property];
  const frames = keyFrames || configDesc.default;

  return (
    <div className="flex gap-4">
      {frames.map((frame, index) => {
        return (
          <Input
            key={index}
            label={index === 0 ? 'From' : 'To'}
            placeholder="0"
            type="number"
            className="w-40"
            labelPlacement="outside"
            min={configDesc.min}
            max={configDesc.max}
            value={frame.toString()}
            onValueChange={(value) => {
              const newKeyFrames: AnimationKeyFrames = [...keyFrames];
              newKeyFrames[index] = parseFloat(value);
              setConfig((c) => ({ ...c, keyFrames: newKeyFrames }));
            }}
          />
        );
      })}
    </div>
  );
}

export const PropertyConfig = () => {
  const [config, setConfig] = useAtom(configAtom);

  return (
    <>
      <Select<KeyLabel<Property>>
        className="w-40"
        selectedKeys={[config.property]}
        items={properties.map((p) => ({ key: p, label: p }))}
        onSelectionChange={(p) => {
          setConfig((c) => ({
            ...c,
            property: p.currentKey as Property,
            keyFrames: propertyMap[p.currentKey as Property].default,
          }));
        }}
        label="Target Property"
        placeholder="Select target property"
      >
        {(animal) => <SelectItem>{animal.label}</SelectItem>}
      </Select>
    </>
  );
};

export const Config = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <PropertyConfig></PropertyConfig>
      <KeyFrames></KeyFrames>
    </div>
  );
};
