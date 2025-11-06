export const getImageSrcByPath = (
  path: string,
  size: 'w200' | 'w500' | 'original' = 'w500'
): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
