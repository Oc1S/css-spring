import { useEffect, useState } from 'react';
import parserCss from 'prettier/parser-postcss';
import prettier from 'prettier/standalone';

import { cx } from '@/utils';

import { BlurFade } from './blue-fade';
import { Copy } from './copy';

export const CodeBlock = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { children: string }
) => {
  const { className, children } = props;

  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    (async () => {
      setFormatted(
        await prettier.format(children, {
          parser: 'css',
          plugins: [parserCss],
          printWidth: 40,
        })
      );
    })();
  }, [children]);

  return (
    <BlurFade
      key={formatted}
      inView
      className={cx(
        'group relative h-full max-h-[400px] min-h-5 w-[414px] overflow-scroll break-all rounded bg-[#151515] p-4 text-sm transition',
        className
      )}
    >
      <Copy
        content={formatted}
        className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100 data-[copying=true]:opacity-100"
      />
      <pre>{formatted}</pre>
    </BlurFade>
  );
};
