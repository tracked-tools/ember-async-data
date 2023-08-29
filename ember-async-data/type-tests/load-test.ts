import TrackedAsyncData from '../src/tracked-async-data';
import loadHelper, { load } from '../src/helpers/load';
import { expectTypeOf } from 'expect-type';

expectTypeOf(load).toEqualTypeOf<
  <T>(data: T | Promise<T>) => TrackedAsyncData<T>
>();

expectTypeOf(load(true)).toEqualTypeOf(new TrackedAsyncData(true));

expectTypeOf<ReturnType<typeof loadHelper<number>>>().toEqualTypeOf<
  TrackedAsyncData<number>
>();

expectTypeOf<ReturnType<typeof loadHelper<string>>>().toEqualTypeOf<
  TrackedAsyncData<string>
>();
