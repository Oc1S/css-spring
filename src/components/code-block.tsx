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
        'group relative h-full max-h-[400px] w-[360px] overflow-scroll break-all rounded bg-[#111] p-4 text-sm transition',
        className
      )}
    >
      <Copy
        content={children}
        className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100 data-[copying=true]:opacity-100"
      />
      <pre>{children}</pre>
    </div>
  );
};
