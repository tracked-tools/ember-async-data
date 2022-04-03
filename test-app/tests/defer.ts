interface Deferred {
  resolve: (value?: unknown) => void;
  reject: (value?: unknown) => void;
  promise: Promise<unknown>;
}

export function defer(): Deferred {
  const deferred = {
    resolve: undefined,
    reject: undefined,
    promise: undefined,
  } as Partial<Deferred>;

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred as Deferred;
}
