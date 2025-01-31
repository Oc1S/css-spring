import { atom, ExtractAtomValue } from 'jotai';
import { spring } from 'motion';

export type IResult = ExtractAtomValue<typeof resultAtom>;

export const resultAtom = atom({
  generator: null as ReturnType<typeof spring> | null,
  initial: true,
  min: 0,
  max: 0,
  duration: 500,
  /** string in animation \@keyframe .eg */
  keyFrameString: '',
  /** generated linear(...) string, only for sample mode */
  linearFuncString: '' as string | undefined,
  /** sample key points */
  keyPoints: [] as TimedValue[],
  // fullString: '',
  // fullList: [] as number[],
  // samples: [] as IndexedValue[],
});
