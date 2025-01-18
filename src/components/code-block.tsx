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
        'group relative h-full max-h-[400px] w-[360px] overflow-scroll break-all rounded bg-[#111] p-4 px-2 font-mono text-sm transition',
        className
      )}
    >
      <Copy
        content={children}
        className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100 data-[copying=true]:opacity-100"
      />
      <pre className="break-words">{children}</pre>
    </div>
  );
};
