import { tracked } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';
import { deprecate } from '@ember/debug';
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
  @dependentKeyCompat
  get state(): State<T>['data'][0] {
    return this.#state.data[0];
  }

  /**
    The value of the resolved promise.

    @note It is only valid to access `error` when `.isError` is true, that is,
      when `TrackedAsyncData.state` is `"ERROR"`.
    @warning You should not rely on this returning `T | null`! In a future
      breaking change which drops support for pre-Octane idioms, it will *only*
      return `T` and will *throw* if you access it when the state is wrong.
   */
  @dependentKeyCompat
  get value(): T | null {
    deprecate(
      "Accessing `value` when TrackedAsyncData is not in the resolved state is not supported and will throw an error in the future. Always check that `.state` is `'RESOLVED'` or that `.isResolved` is `true` before accessing this property.",
      this.#state.data[0] === 'RESOLVED',
      {
        id: 'tracked-async-data::invalid-value-access',
        for: 'ember-async-data',
        since: {
          available: '1.0.0',
          enabled: '1.0.0',
        },
        until: '2.0.0',
      },
    );

    return this.#state.data[0] === 'RESOLVED' ? this.#state.data[1] : null;
  }

  /**
    The error of the rejected promise.

    @note It is only valid to access `error` when `.isError` is true, that is,
      when `TrackedAsyncData.state` is `"ERROR"`.
    @warning You should not rely on this returning `null` when the state is not
      `"ERROR"`! In a future breaking change which drops support for pre-Octane
      idioms, it will *only* return `E` and will *throw* if you access it when
      the state is wrong.
   */
  @dependentKeyCompat
  get error(): unknown {
    deprecate(
      "Accessing `error` when TrackedAsyncData is not in the rejected state is not supported and will throw an error in the future. Always check that `.state` is `'REJECTED'` or that `.isRejected` is `true` before accessing this property.",
      this.#state.data[0] === 'REJECTED',
      {
        id: 'tracked-async-data::invalid-error-access',
        for: 'ember-async-data',
        since: {
          available: '1.0.0',
          enabled: '1.0.0',
        },
        until: '2.0.0',
      },
    );

    return this.#state.data[0] === 'REJECTED' ? this.#state.data[1] : null;
  }

  /**
    Is the state `"PENDING"`.
   */
  @dependentKeyCompat
  get isPending(): boolean {
    return this.state === 'PENDING';
  }

  /** Is the state `"RESOLVED"`? */
  @dependentKeyCompat
  get isResolved(): boolean {
    return this.state === 'RESOLVED';
  }

  /** Is the state `"REJECTED"`? */
  @dependentKeyCompat
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

  match<V>(matcher: {
    pending: () => V;
    resolved: (value: T) => V;
    rejected: (reason: unknown) => V;
  }) {
    switch (this.#state.data[0]) {
      case 'PENDING':
        return matcher.pending();
      case 'RESOLVED':
        return matcher.resolved(this.#state.data[1]);
      case 'REJECTED':
        return matcher.rejected(this.#state.data[1]);
    }
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

/**
  A `TrackedAsyncData` whose wrapped promise is still pending, and which
  therefore does not have a `value` or an `error` property.
 */
interface Pending<T> extends Omit<_TrackedAsyncData<T>, 'value' | 'error'> {
  state: 'PENDING';
  isPending: true;
  isResolved: false;
  isRejected: false;
}

/**
  A `TrackedAsyncData` whose wrapped promise has resolved, and which therefore
  has a `value` property with the value the promise resolved to.
 */
interface Resolved<T> extends Omit<_TrackedAsyncData<T>, 'error'> {
  state: 'RESOLVED';
  isPending: false;
  isResolved: true;
  isRejected: false;
  value: T;
}

/**
  A `TrackedAsyncData` whose wrapped promise has rejected, and which therefore
  has an `error` property with the rejection value of the promise (if any).
 */
interface Rejected<T> extends Omit<_TrackedAsyncData<T>, 'value'> {
  state: 'REJECTED';
  isPending: false;
  isResolved: false;
  isRejected: true;
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
  import type Store from '@ember-data/store';
  import { TrackedAsyncData, Match } from 'ember-async-data';
  import LoadingSpinner from './loading-spinner';
  import PresentTheData from './present-the-data';

  interface ProfileSignature {
    Args: {
      id: number;
    };
  }

  export default class SmartProfile extends Component<ProfileSignature> {
    @service declare store: Store;

    @cached get someData() {
      let recordPromise = this.store.findRecord('user', this.args.id);
      return new TrackedAsyncData(recordPromise);
    }

    <template>
      <Match this.someData>
        <:pending>
          <LoadingSpinner />
        </:pending>
        <:resolved as |value|>
          <PresentTheData @data={{value}} />
        </:resolved>
        <:rejected>
          <p>Whoops! Looks like something went wrong!</p>
        </:rejected>
      </Match>
    </template>
  }
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
