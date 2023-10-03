interface Deferred<T = unknown> {
  resolve: (value: T) => void;
  reject: (value?: unknown) => void;
  promise: Promise<T>;
}

export function defer<T>(): Deferred<T> {
  const deferred = {
    resolve: undefined,
    reject: undefined,
    promise: undefined,
  } as Partial<Deferred<T>>;

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred as Deferred<T>;
}
