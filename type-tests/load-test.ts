import Helper from "@ember/component/helper";
import TrackedAsyncData from "ember-async-data/tracked-async-data";
import Load, { load } from "ember-async-data/helpers/load";
import { expectTypeOf } from "expect-type";

expectTypeOf(load).toEqualTypeOf<
  <T>(data: T | Promise<T>, context?: object) => TrackedAsyncData<T>
>();

expectTypeOf(load(true)).toEqualTypeOf(new TrackedAsyncData(true));
expectTypeOf(load(true, {})).toEqualTypeOf(new TrackedAsyncData(true, {}));

interface PublicAPIForHelper<T> extends Helper {
  compute([data]: [T | Promise<T>]): TrackedAsyncData<T>;
}

expectTypeOf<Load<string>>().toEqualTypeOf<PublicAPIForHelper<string>>();
