/** Bound UI waits without pretending that the underlying request was cancelled. */
export async function withTimeout<T>(request: Promise<T>, milliseconds = 15000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Request timed out')), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
