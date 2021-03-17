import TrackedAsyncData from "ember-async-data/tracked-async-data";
import { expectTypeOf } from "expect-type";

expectTypeOf(TrackedAsyncData).toBeConstructibleWith(12);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith("hello");
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(true);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(null);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(undefined);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith({ cool: "story" });
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(["neat"]);
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.resolve());
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.resolve(12));
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.reject());
expectTypeOf(TrackedAsyncData).toBeConstructibleWith(Promise.reject("gah"));

declare class PublicAPI<T> {
  get state(): "PENDING" | "RESOLVED" | "REJECTED";
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

expectTypeOf<TrackedAsyncData<string>>().toEqualTypeOf<PublicAPI<string>>();
