import TrackedAsyncData, { JSONRepr } from '../src/tracked-async-data';
import { expectTypeOf } from 'expect-type';

declare function unreachable(x: never): never;

declare class PublicAPI<T> {
  constructor(data: T | Promise<T>);
  get state(): 'PENDING' | 'RESOLVED' | 'REJECTED';
  get value(): T | null;
  get error(): unknown;
  get isPending(): boolean;
  get isResolved(): boolean;
  get isRejected(): boolean;
  toJSON():
    | { isPending: true; isResolved: false; isRejected: false }
    | { isPending: false; isResolved: true; value: T; isRejected: false }
    | { isPending: false; isResolved: false; isRejected: true; error: unknown };
  toString(): string;
}

expectTypeOf(TrackedAsyncData).toBeConstructibleWith(12);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith('hello');
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(true);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(null);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(undefined);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith({ cool: 'story' });
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(['neat']);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.resolve());
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.resolve(12));
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.reject());
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.reject('gah'));

// We use `toMatchTypeOf` here to confirm the union type which makes up
// `TrackedAsyncData` is structurally compatible with the desired public
// interface, but then use explicit `toEqualTypeOf` checks on each individual
// property below to guarantee they don't accidentally widen the actual type
// of each property.
declare let data: TrackedAsyncData<string>;
declare let expected: PublicAPI<string>;
expectTypeOf(data).toMatchTypeOf(expected);

expectTypeOf(data.state).toEqualTypeOf<'PENDING' | 'RESOLVED' | 'REJECTED'>();
expectTypeOf(data.value).toEqualTypeOf<string | null>();
expectTypeOf(data.error).toEqualTypeOf<unknown>();
expectTypeOf(data.isPending).toEqualTypeOf<boolean>();
expectTypeOf(data.isResolved).toEqualTypeOf<boolean>();
expectTypeOf(data.isRejected).toEqualTypeOf<boolean>();
expectTypeOf(data.toJSON).toBeFunction();
expectTypeOf(data.toJSON()).toEqualTypeOf<JSONRepr<string>>();
expectTypeOf(data.toString).toBeFunction();
expectTypeOf(data.toString()).toEqualTypeOf<string>();

if (data.isPending) {
  expectTypeOf(data.value).toEqualTypeOf(null);
  expectTypeOf(data.error).toEqualTypeOf(null);
} else if (data.isResolved) {
  expectTypeOf(data.value).toEqualTypeOf<string>();
  expectTypeOf(data.error).toEqualTypeOf(null);
} else if (data.isRejected) {
  expectTypeOf(data.value).toEqualTypeOf(null);
  expectTypeOf(data.error).toEqualTypeOf<unknown>();
} else {
  unreachable(data);
}

if (data.state === 'PENDING') {
  expectTypeOf(data.value).toEqualTypeOf(null);
  expectTypeOf(data.error).toEqualTypeOf(null);
} else if (data.state === 'RESOLVED') {
  expectTypeOf(data.value).toEqualTypeOf<string>();
  expectTypeOf(data.error).toEqualTypeOf(null);
} else if (data.state === 'REJECTED') {
  expectTypeOf(data.value).toEqualTypeOf(null);
  expectTypeOf(data.error).toEqualTypeOf<unknown>();
} else {
  unreachable(data);
}
