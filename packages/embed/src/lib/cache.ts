const cacheMap = new Map<string, Promise<any>>();

export function cache<T>(key: string, fn: (...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T> => {
    if (cacheMap.has(key)) {
      console.debug(`[pagering] cache hit for key "${key}"`);
      return await cacheMap.get(key);
    }
    const result = fn(...args);
    cacheMap.set(key, result);
    return await result;
  };
}
