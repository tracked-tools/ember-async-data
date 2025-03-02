import { tracked } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';
import { deprecate } from '@ember/debug';
import { buildWaiter } from '@ember/test-waiters';

function _applyDecoratedDescriptor(i, e, r, n, l) {
  var a = {};
  return Object.keys(n).forEach(function (i) {
    a[i] = n[i];
  }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) {
    return n(i, e, r) || r;
  }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _initializerDefineProperty(e, i, r, l) {
  r && Object.defineProperty(e, i, {
    enumerable: r.enumerable,
    configurable: r.configurable,
    writable: r.writable,
    value: r.initializer ? r.initializer.call(l) : void 0
  });
}

var _class, _descriptor, _class2, _token, _state;
const waiter = buildWaiter('ember-async-data');

/** A very cheap representation of the of a promise. */

// We only need a single instance of the pending state in our system, since it
// is otherwise unparameterized (unlike the resolved and rejected states).
const PENDING = ['PENDING'];

// This class exists so that the state can be *wholly* private to outside
// consumers, but its tracked internals can be both read and written directly by
// `TrackedAsyncData` itself. The initial state of every `TrackedAsyncData` is
// `PENDING`, though it may immediately become resolved for some `Promise`
// instances (e.g. with a `Promise.resolve`).
let State = (_class = class State {
  constructor() {
    _initializerDefineProperty(this, "data", _descriptor, this);
  }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, "data", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return PENDING;
  }
}), _class); // NOTE: this class is the implementation behind the types; the public types
// layer on additional safety. See below! Additionally, the docs for the class
// itself are applied to the export, not to the class, so that they will appear
// when users refer to *that*.
let _TrackedAsyncData = (_class2 = (_token = /*#__PURE__*/new WeakMap(), _state = /*#__PURE__*/new WeakMap(), class _TrackedAsyncData {
  /**
    @param promise The promise to load.
   */
  constructor(data) {
    _classPrivateFieldInitSpec(this, _token, void 0);
    /**
      The internal state management for the promise.
       - `readonly` so it cannot be mutated by the class itself after instantiation
      - uses true native privacy so it cannot even be read (and therefore *cannot*
        be depended upon) by consumers.
     */
    _classPrivateFieldInitSpec(this, _state, new State());
    if (this.constructor !== _TrackedAsyncData) {
      throw new Error('tracked-async-data cannot be subclassed');
    }
    if (!isPromiseLike(data)) {
      _classPrivateFieldGet2(_state, this).data = ['RESOLVED', data];
      return;
    }
    const promise = data;
    _classPrivateFieldSet2(_token, this, waiter.beginAsync());

    // Otherwise, we know that haven't yet handled that promise anywhere in the
    // system, so we continue creating a new instance.
    promise.then(value => {
      _classPrivateFieldGet2(_state, this).data = ['RESOLVED', value];
      waiter.endAsync(_classPrivateFieldGet2(_token, this));
    }, error => {
      _classPrivateFieldGet2(_state, this).data = ['REJECTED', error];
      waiter.endAsync(_classPrivateFieldGet2(_token, this));
    });
  }
  /**
   * The resolution state of the promise.
   */
  get state() {
    return _classPrivateFieldGet2(_state, this).data[0];
  }

  /**
    The value of the resolved promise.
     @note It is only valid to access `error` when `.isError` is true, that is,
      when `TrackedAsyncData.state` is `"ERROR"`.
    @warning You should not rely on this returning `T | null`! In a future
      breaking change which drops support for pre-Octane idioms, it will *only*
      return `T` and will *throw* if you access it when the state is wrong.
   */
  get value() {
    deprecate("Accessing `value` when TrackedAsyncData is not in the resolved state is not supported and will throw an error in the future. Always check that `.state` is `'RESOLVED'` or that `.isResolved` is `true` before accessing this property.", _classPrivateFieldGet2(_state, this).data[0] === 'RESOLVED', {
      id: 'tracked-async-data::invalid-value-access',
      for: 'ember-async-data',
      since: {
        available: '1.0.0',
        enabled: '1.0.0'
      },
      until: '2.0.0'
    });
    return _classPrivateFieldGet2(_state, this).data[0] === 'RESOLVED' ? _classPrivateFieldGet2(_state, this).data[1] : null;
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
  get error() {
    deprecate("Accessing `error` when TrackedAsyncData is not in the rejected state is not supported and will throw an error in the future. Always check that `.state` is `'REJECTED'` or that `.isRejected` is `true` before accessing this property.", _classPrivateFieldGet2(_state, this).data[0] === 'REJECTED', {
      id: 'tracked-async-data::invalid-error-access',
      for: 'ember-async-data',
      since: {
        available: '1.0.0',
        enabled: '1.0.0'
      },
      until: '2.0.0'
    });
    return _classPrivateFieldGet2(_state, this).data[0] === 'REJECTED' ? _classPrivateFieldGet2(_state, this).data[1] : null;
  }

  /**
    Is the state `"PENDING"`.
   */
  get isPending() {
    return this.state === 'PENDING';
  }

  /** Is the state `"RESOLVED"`? */
  get isResolved() {
    return this.state === 'RESOLVED';
  }

  /** Is the state `"REJECTED"`? */
  get isRejected() {
    return this.state === 'REJECTED';
  }

  // SAFETY: casts are safe because we uphold these invariants elsewhere in the
  // class. It would be great if we could guarantee them statically, but getters
  // do not return information about the state of the class well.
  toJSON() {
    const {
      isPending,
      isResolved,
      isRejected
    } = this;
    if (isPending) {
      return {
        isPending,
        isResolved,
        isRejected
      };
    } else if (isResolved) {
      return {
        isPending,
        isResolved,
        value: this.value,
        isRejected
      };
    } else {
      return {
        isPending,
        isResolved,
        isRejected,
        error: this.error
      };
    }
  }
  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "state", [dependentKeyCompat], Object.getOwnPropertyDescriptor(_class2.prototype, "state"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "value", [dependentKeyCompat], Object.getOwnPropertyDescriptor(_class2.prototype, "value"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "error", [dependentKeyCompat], Object.getOwnPropertyDescriptor(_class2.prototype, "error"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPending", [dependentKeyCompat], Object.getOwnPropertyDescriptor(_class2.prototype, "isPending"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isResolved", [dependentKeyCompat], Object.getOwnPropertyDescriptor(_class2.prototype, "isResolved"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isRejected", [dependentKeyCompat], Object.getOwnPropertyDescriptor(_class2.prototype, "isRejected"), _class2.prototype), _class2);
/**
  The JSON representation of a `TrackedAsyncData`, useful for e.g. logging.

  Note that you cannot reconstruct a `TrackedAsyncData` *from* this, because it
  is impossible to get the original promise when in a pending state!
 */
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
const TrackedAsyncData = _TrackedAsyncData;

/** Utility type to check whether the string `key` is a property on an object */
function has(key, t) {
  return key in t;
}
function isPromiseLike(data) {
  return typeof data === 'object' && data !== null && has('then', data) && typeof data.then === 'function';
}

export { TrackedAsyncData as default };
//# sourceMappingURL=tracked-async-data.js.map
