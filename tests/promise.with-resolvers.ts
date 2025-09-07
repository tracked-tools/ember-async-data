declare global {
  interface PromiseConstructor {
    withResolvers<T>(): {
      promise: Promise<T>;
      resolve: (value: T | PromiseLike<T>) => void;
      reject: (reason?: Error) => void;
    };
  }
}

export {}; // Ensures this is treated as a module
