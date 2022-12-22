interface Deferred<T> {
  resolve: (value: T) => void;
  reject: (value?: unknown) => void;
  promise: Promise<unknown>;
}

export type PrimitiveForTest =
  | string
  | number
  | null
  | boolean
  | null
  | undefined;

export function defer<
  T extends PrimitiveForTest = PrimitiveForTest
>(): Deferred<T> {
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
