export const sequentialPromises = async <T>(
  promises: (() => Promise<T>)[]
): Promise<T[]> => {
  const results: T[] = [];
  for (const promise of promises) {
    const result = await promise();
    results.push(result);
  }
  return results;
};
