import { useAtom } from 'jotai';

import { resultAtom } from '.';

export const DisplayInfo = () => {
  const [info] = useAtom(resultAtom);
  const { initial, min, max, duration } = info;
  return (
    initial || (
      <div className="flex flex-col gap-2 py-4">
        {Object.entries({ min, max, duration }).map(([key, value]) => (
          <div key={key}>
            {key}:{value}
          </div>
        ))}
      </div>
    )
  );
};
