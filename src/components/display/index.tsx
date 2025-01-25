import { atom, ExtractAtomValue } from 'jotai';
import { spring } from 'motion';

export type InfoType = ExtractAtomValue<typeof resultAtom>;

export const resultAtom = atom({
  generator: null as ReturnType<typeof spring> | null,
  initial: true,
  min: 0,
  max: 0,
  duration: 500,
  keyFrameString: '',
  keyPoints: [] as timedValue[],
  // fullString: '',
  // fullList: [] as number[],
  // samples: [] as IndexedValue[],
});
