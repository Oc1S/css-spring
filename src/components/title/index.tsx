import { cx } from '@/utils';

export const Title = ({
  className,
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return <div className={cx('mb-2 text-lg', className)} {...rest} />;
};
