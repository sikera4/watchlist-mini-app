'use client';

import NextImage from 'next/image';
import { useState } from 'react';
import { FaFilm } from 'react-icons/fa6';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';

type Props = { path?: string | null; title: string; className?: string; sizes?: string };

export default function Poster({ path, title, className = '', sizes = '160px' }: Props) {
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const hasImage = Boolean(path) && path !== failedPath;

  return (
    <span className={`relative block overflow-hidden bg-surface-secondary ${className}`}>
      {hasImage ? (
        <NextImage
          src={getImageSrcByPath(path!)}
          alt={`Постер: ${title}`}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFailedPath(path!)}
        />
      ) : (
        <span
          role="img"
          aria-label={`Нет постера: ${title}`}
          className="flex h-full min-h-12 items-center justify-center text-muted"
        >
          <FaFilm aria-hidden="true" className="size-6" />
        </span>
      )}
    </span>
  );
}
