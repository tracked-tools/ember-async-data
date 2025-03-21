import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('ember-async-data');

/** A very cheap representation of the of a promise. */
type StateRepr<T> =
  | [tag: 'PENDING']
  | [tag: 'RESOLVED', value: T]
  | [tag: 'REJECTED', error: unknown];

// We only need a single instance of the pending state in our system, since it
// is otherwise unparameterized (unlike the resolved and rejected states).
const PENDING = ['PENDING'] as [tag: 'PENDING'];

// This class exists so that the state can be *wholly* private to outside
// consumers, but its tracked internals can be both read and written directly by
// `TrackedAsyncData` itself. The initial state of every `TrackedAsyncData` is
// `PENDING`, though it may immediately become resolved for some `Promise`
// instances (e.g. with a `Promise.resolve`).
class State<T> {
  @tracked data: StateRepr<T> = PENDING;
}

// NOTE: this class is the implementation behind the types; the public types
// layer on additional safety. See below! Additionally, the docs for the class
// itself are applied to the export, not to the class, so that they will appear
// when users refer to *that*.
class _TrackedAsyncData<T> {
  #token: unknown;

  /**
    @param promise The promise to load.
   */
  constructor(data: T | Promise<T>) {
    if (this.constructor !== _TrackedAsyncData) {
      throw new Error('tracked-async-data cannot be subclassed');
    }

    if (!isPromiseLike(data)) {
      this.#state.data = ['RESOLVED', data];
      return;
    }

    const promise = data;
    this.#token = waiter.beginAsync();

    // Otherwise, we know that haven't yet handled that promise anywhere in the
    // system, so we continue creating a new instance.
    promise.then(
      (value) => {
        this.#state.data = ['RESOLVED', value];
        waiter.endAsync(this.#token);
      },
      (error) => {
        this.#state.data = ['REJECTED', error];
        waiter.endAsync(this.#token);
      },
    );
  }

  /**
    The internal state management for the promise.

    - `readonly` so it cannot be mutated by the class itself after instantiation
    - uses true native privacy so it cannot even be read (and therefore *cannot*
      be depended upon) by consumers.
   */
  readonly #state = new State<T>();

  /**
   * The resolution state of the promise.
   */
  get state(): State<T>['data'][0] {
    return this.#state.data[0];
  }

  /**
    The value of the resolved promise.

    @note It is only valid to access `error` when `.isError` is true, that is,
      when `TrackedAsyncData.state` is `"ERROR"`.
    @warning You should not rely on this returning `T | null`!
   */
  get value(): T | null {
    assert(
      "Accessing `value` when TrackedAsyncData is not in the resolved state is not supported. Always check that `.state` is `'RESOLVED'` or that `.isResolved` is `true` before accessing this property.",
      this.#state.data[0] === 'RESOLVED',
    );

    return this.#state.data[0] === 'RESOLVED' ? this.#state.data[1] : null;
  }

  /**
    The error of the rejected promise.

    @note It is only valid to access `error` when `.isError` is true, that is,
      when `TrackedAsyncData.state` is `"ERROR"`.
    @warning You should not rely on this returning `null` when the state is not
      `"ERROR"`!
   */
  get error(): unknown {
    assert(
      "Accessing `error` when TrackedAsyncData is not in the rejected state is not supported. Always check that `.state` is `'REJECTED'` or that `.isRejected` is `true` before accessing this property.",
      this.#state.data[0] === 'REJECTED',
    );

    return this.#state.data[0] === 'REJECTED' ? this.#state.data[1] : null;
  }

  /**
    Is the state `"PENDING"`.
   */
  get isPending(): boolean {
    return this.state === 'PENDING';
  }

  /** Is the state `"RESOLVED"`? */
  get isResolved(): boolean {
    return this.state === 'RESOLVED';
  }

  /** Is the state `"REJECTED"`? */
  get isRejected(): boolean {
    return this.state === 'REJECTED';
  }

  // SAFETY: casts are safe because we uphold these invariants elsewhere in the
  // class. It would be great if we could guarantee them statically, but getters
  // do not return information about the state of the class well.
  toJSON(): JSONRepr<T> {
    const { isPending, isResolved, isRejected } = this;
    if (isPending) {
      return { isPending, isResolved, isRejected } as JSONRepr<T>;
    } else if (isResolved) {
      return {
        isPending,
        isResolved,
        value: this.value,
        isRejected,
      } as JSONRepr<T>;
    } else {
      return {
        isPending,
        isResolved,
        isRejected,
        error: this.error,
      } as JSONRepr<T>;
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

/**
  The JSON representation of a `TrackedAsyncData`, useful for e.g. logging.

  Note that you cannot reconstruct a `TrackedAsyncData` *from* this, because it
  is impossible to get the original promise when in a pending state!
 */
export type JSONRepr<T> =
  | { isPending: true; isResolved: false; isRejected: false }
  | { isPending: false; isResolved: true; isRejected: false; value: T }
  | { isPending: false; isResolved: false; isRejected: true; error: unknown };

// The exported type is the intersection of three narrowed interfaces. Doing it
// this way has two nice benefits:
//
// 1.  It allows narrowing to work. For example:
//
//     ```ts
//     let data = new TrackedAsyncData(Promise.resolve("hello"));
//     if (data.isPending) {
//       data.value;  // null
//       data.error;  // null
//     } else if (data.isPending) {
//       data.value;  // null
//       data.error;  // null
//     } else if (data.isRejected) {
//       data.value;  // null
//       data.error;  // unknown, can now be narrowed
//     }
//     ```
//
//     This dramatically improves the usability of the type in type-aware
//     contexts (including with templates when using Glint!)
//
// 2.  Using `interface extends` means that (a) it is guaranteed to be a subtype
//     of the `_TrackedAsyncData` type, (b) that the docstrings applied to the
//     base type still work, and (c) that the types which are *common* to the
//     shared implementations (i.e. `.toJSON()` and `.toString()`) are shared
//     automatically.

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
const TrackedAsyncData = _TrackedAsyncData as new <T>(
  data: T | Promise<T>,
) => TrackedAsyncData<T>;
export default TrackedAsyncData;

/** Utility type to check whether the string `key` is a property on an object */
function has<K extends PropertyKey, T extends object>(
  key: K,
  t: T,
): t is T & Record<K, unknown> {
  return key in t;
}

function isPromiseLike(data: unknown): data is PromiseLike<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    has('then', data) &&
    typeof data.then === 'function'
  );
}
