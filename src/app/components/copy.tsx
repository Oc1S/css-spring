import copy from 'copy-to-clipboard';

import { Check, Clipboard } from './icons';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as motion } from 'framer-motion';
import { cx } from '../utils';

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.5 },
  transition: {
    duration: 0.15,
  },
};

export const Copy: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    content: string;
  }
> = (props) => {
  const { className, onClick, content, ...rest } = props;
  const [copying, setCopying] = useState(false);

  let timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const crearTimer = () => {
    clearTimeout(timerRef.current!);
  };

  const onCopy = () => {
    copy(content);
    if (copying) return;
    setCopying(true);
    crearTimer();
    timerRef.current = setTimeout(() => {
      setCopying(false);
    }, 2000);
  };

  useEffect(() => {
    return () => crearTimer();
  });

  return (
    <button
      aria-label="Copy code"
      {...rest}
      className={cx(
        'flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md border border-[#303030] bg-transparent text-[#eeeeee] transition duration-200 focus-visible:opacity-100 focus-visible:shadow-[0_0_0_1px_#303030]',
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        onCopy();
      }}
      data-copying={copying}
    >
      <AnimatePresence initial={false} mode="wait">
        {copying ? (
          <motion.div
            key="check"
            initial={variants.hidden}
            animate={variants.visible}
            exit={variants.hidden}
            transition={variants.transition}
            className="flex"
          >
            <Check />
          </motion.div>
        ) : (
          <motion.div
            key="clipboard"
            initial={variants.hidden}
            animate={variants.visible}
            exit={variants.hidden}
            transition={variants.transition}
            className="flex"
          >
            <Clipboard />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
