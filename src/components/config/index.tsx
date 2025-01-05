import { Select, SelectItem } from '@nextui-org/react';
import { atom, useAtom } from 'jotai';

import { properties, Property } from '@/constants';

export type IConfig = {
  duration?: number;
  visualDuration?: number;
  property: Property;
};

const defaultConfig: IConfig = {
  property: properties[0],
  duration: 800,
};
export const configAtom = atom(defaultConfig);

type KeyLabel<T> = {
  key: T;
  label: string;
};

export const Config = () => {
  const [config, setConfig] = useAtom(configAtom);

  return (
    <>
      <Select<KeyLabel<Property>>
        className="w-40"
        selectedKeys={[config.property]}
        items={properties.map((p) => ({ key: p, label: p }))}
        onSelectionChange={(p) => {
          setConfig((c) => ({ ...c, property: p.currentKey as Property }));
        }}
        label="Target Property"
        placeholder="Select target property"
      >
        {(animal) => <SelectItem>{animal.label}</SelectItem>}
      </Select>
    </>
  );
};
