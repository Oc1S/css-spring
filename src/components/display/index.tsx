import { atom } from 'jotai';
import { spring } from 'motion';

export const resultAtom = atom({
  generator: null as ReturnType<typeof spring> | null,
  initial: true,
  min: 0,
  max: 0,
  duration: 500,
  fullString: '',
  keyPointString: '',
  fullList: [] as number[],
  samples: [] as IndexedValue[],
  keyPoints: [] as timedValue[],
});
