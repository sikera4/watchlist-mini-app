import { Image, ImageProps } from '@heroui/react';
import { useState } from 'react';

const PLACEHOLDER_URL = '/nothing_silhouette.webp';

type Props = ImageProps;

const ImageWithFallback = ({ src, ...otherProps }: Props) => {
  const [imageSrc, setImageSrc] = useState(src);

  return <Image src={imageSrc} onError={() => setImageSrc(PLACEHOLDER_URL)} {...otherProps} />;
};

export default ImageWithFallback;
