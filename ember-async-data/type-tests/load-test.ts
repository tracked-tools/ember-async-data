import Helper from '@ember/component/helper';
import TrackedAsyncData from '../src/tracked-async-data';
import Load, { load } from '../src/helpers/load';
import { expectTypeOf } from 'expect-type';

expectTypeOf(load).toEqualTypeOf<
  <T>(data: T | Promise<T>, context: {}) => TrackedAsyncData<T>
>();

expectTypeOf(load(true, {})).toEqualTypeOf(new TrackedAsyncData(true, {}));

interface PublicAPIForHelper<T> extends Helper {
  compute([data]: [T | Promise<T>]): TrackedAsyncData<T>;
}

expectTypeOf<Load<string>>().toEqualTypeOf<PublicAPIForHelper<string>>();
