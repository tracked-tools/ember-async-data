import TrackedAsyncData from '../src/tracked-async-data';
import loadHelper, { load } from '../src/helpers/load';
import { expectTypeOf } from 'expect-type';
import {
  EmptyObject,
  FunctionBasedHelperInstance,
} from '@ember/component/helper';

expectTypeOf(load).toEqualTypeOf<
  <T>(data: T | Promise<T>) => TrackedAsyncData<T>
>();

expectTypeOf(load(true)).toEqualTypeOf(new TrackedAsyncData(true));

type LoadHelper = abstract new <T>() => FunctionBasedHelperInstance<{
  Args: {
    Positional: [T | Promise<T>];
    Named: EmptyObject;
  };
  Return: TrackedAsyncData<T>;
}>;

expectTypeOf(loadHelper).toEqualTypeOf<LoadHelper>();
