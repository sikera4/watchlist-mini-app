import { ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

const Skeleton = ({ children, className, ...otherProps }: Props) => {
  return (
    <div className={`animate-pulse bg-gray-300 ${className}`} {...otherProps}>
      {children}
    </div>
  );
};

export default Skeleton;
