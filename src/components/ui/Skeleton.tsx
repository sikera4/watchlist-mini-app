import { ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

const Skeleton = ({ children, className, ...otherProps }: Props) => {
  return (
    <div
      className={`animate-pulse motion-reduce:animate-none bg-surface-secondary ${className}`}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default Skeleton;
