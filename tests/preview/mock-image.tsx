import { ComponentProps } from 'react';

export default function Image({ fill, ...props }: ComponentProps<'img'> & { fill?: boolean }) {
  // Match next/image's fill geometry; no image optimizer runs in the local fixture.
  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      {...props}
      style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : undefined}
    />
  );
}
