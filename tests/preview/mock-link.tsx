import { ComponentProps } from 'react';

type Props = ComponentProps<'a'> & {
  prefetch?: boolean;
  scroll?: boolean;
  onNavigate?: () => void;
};

export default function Link({ prefetch, scroll, onNavigate, ...props }: Props) {
  void prefetch;
  void scroll;

  return <a {...props} onClick={onNavigate} />;
}

export const useLinkStatus = () => ({ pending: false });
