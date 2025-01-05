import { cx } from '@/utils';

import { Copy } from './copy';

export const CodeBlock = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { children: string }
) => {
  const { className, children } = props;
  return (
    <div
      className={cx(
        'group relative h-full w-[360px] break-all rounded bg-[#1a1a1a] p-4 pr-12 font-mono transition',
        className
      )}
    >
      <Copy
        content={children}
        className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100 data-[copying=true]:opacity-100"
      ></Copy>
      <pre>{children}</pre>
    </div>
  );
};
