/** A very cheap representation of the of a promise. */
type StateRepr<T> = [tag: 'PENDING'] | [tag: 'RESOLVED', value: T] | [tag: 'REJECTED', error: unknown];
declare class State<T> {
    data: StateRepr<T>;
}
declare class _TrackedAsyncData<T> {
    #private;
    /**
      @param promise The promise to load.
     */
    constructor(data: T | Promise<T>);
    /**
     * The resolution state of the promise.
     */
    get state(): State<T>['data'][0];
    /**
      The value of the resolved promise.
  
      @note It is only valid to access `error` when `.isError` is true, that is,
        when `TrackedAsyncData.state` is `"ERROR"`.
      @warning You should not rely on this returning `T | null`! In a future
        breaking change which drops support for pre-Octane idioms, it will *only*
        return `T` and will *throw* if you access it when the state is wrong.
     */
    get value(): T | null;
    /**
      The error of the rejected promise.
  
      @note It is only valid to access `error` when `.isError` is true, that is,
        when `TrackedAsyncData.state` is `"ERROR"`.
      @warning You should not rely on this returning `null` when the state is not
        `"ERROR"`! In a future breaking change which drops support for pre-Octane
        idioms, it will *only* return `E` and will *throw* if you access it when
        the state is wrong.
     */
    get error(): unknown;
    /**
      Is the state `"PENDING"`.
     */
    get isPending(): boolean;
    /** Is the state `"RESOLVED"`? */
    get isResolved(): boolean;
    /** Is the state `"REJECTED"`? */
    get isRejected(): boolean;
    toJSON(): JSONRepr<T>;
    toString(): string;
}
/**
  The JSON representation of a `TrackedAsyncData`, useful for e.g. logging.

  Note that you cannot reconstruct a `TrackedAsyncData` *from* this, because it
  is impossible to get the original promise when in a pending state!
 */
export type JSONRepr<T> = {
    isPending: true;
    isResolved: false;
    isRejected: false;
} | {
    isPending: false;
    isResolved: true;
    isRejected: false;
    value: T;
} | {
    isPending: false;
    isResolved: false;
    isRejected: true;
    error: unknown;
};
interface Pending<T> extends _TrackedAsyncData<T> {
    state: 'PENDING';
    isPending: true;
    isResolved: false;
    isRejected: false;
    value: null;
    error: null;
}
interface Resolved<T> extends _TrackedAsyncData<T> {
    state: 'RESOLVED';
    isPending: false;
    isResolved: true;
    isRejected: false;
    value: T;
    error: null;
}
interface Rejected<T> extends _TrackedAsyncData<T> {
    state: 'REJECTED';
    isPending: false;
    isResolved: false;
    isRejected: true;
    value: null;
    error: unknown;
}
/**
  An autotracked `Promise` handler, representing asynchronous data.

  Given a `Promise` instance, a `TrackedAsyncData` behaves exactly lik the
  original `Promise`, except that it makes the state of the `Promise` visible
  via tracked state, so you can check whether the promise is pending, resolved,
  or rejected; and so you can get the value if it has resolved or the error if
  it has rejected.

  Every `Promise` in the system is guaranteed to be associated with at most a
  single `TrackedAsyncData`.

  ## Example

  ```ts
  import Component from '@glimmer/component';
  import { cached } from '@glimmer/tracking';
  import { inject as service } from '@ember/service';
  import TrackedAsyncData from 'ember-async-data/tracked-async-data';

  export default class SmartProfile extends Component<{ id: number }> {
    @service store;

    @cached
    get someData() {
      let recordPromise = this.store.findRecord('user', this.args.id);
      return new TrackedAsyncData(recordPromise);
    }
  }
  ```

  And a corresponding template:

  ```hbs
  {{#if this.someData.isResolved}}
    <PresentTheData @data={{this.someData.data}} />
  {{else if this.someData.isPending}}
    <LoadingSpinner />
  {{else if this.someData.isRejected}}
    <p>
      Whoops! Looks like something went wrong!
      {{this.someData.error.message}}
    </p>
  {{/if}}
  ```
 */
type TrackedAsyncData<T> = Pending<T> | Resolved<T> | Rejected<T>;
declare const TrackedAsyncData: new <T>(data: T | Promise<T>) => TrackedAsyncData<T>;
export default TrackedAsyncData;
//# sourceMappingURL=tracked-async-data.d.ts.map