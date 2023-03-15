<p align="center">

  <a href="https://github.com/tracked-tools/ember-async-data/actions/workflows/ci.yml">
    <img src="https://github.com/tracked-tools/ember-async-data/actions/workflows/ci.yml/badge.svg" alt="CI" style="max-width:100%;">
  </a>
  <a href='https://www.npmjs.com/package/ember-async-data'>
    <img src='https://img.shields.io/npm/v/ember-async-data.svg' alt='npm'>
  </a>
  <a href='https://github.com/tracked-tools/ember-async-data/blob/main/.github/workflows/CI.yml#L98'>
    <img src='https://img.shields.io/badge/TypeScript-4.8%20%7C%204.9%20%7C%20next-3178c6' alt='supported TypeScript versions'>
  </a>
  <a href='https://github.com/tracked-tools/ember-async-data/blob/main/.github/workflows/Nightly.yml'>
    <img src='https://github.com/tracked-tools/ember-async-data/workflows/Nightly%20TypeScript%20Run/badge.svg' alt='Nightly TypeScript Run'>
  </a>
  <img src='https://img.shields.io/badge/stability-active-663399' alt='Stability: Active'>
  <a href='https://github.com/tracked-tools/ember-async-data/blob/master/LICENSE.md'>
    <img src='https://img.shields.io/github/license/tracked-tools/true-myth.svg'>
  </a>
</p>

# ember-async-data

A utility/helper and data structure for representing a `Promise` in a declarative, reactive way in Glimmer.js and Ember Octane.

- Render a promise in a declarative way in template-only code:

    ```hbs
    {{#let (load @somePromise) as |result|}}
      {{#if result.isResolved}}
        <PresentTheData @data={{result.value}} />
      {{else if result.isPending}}
        <LoadingSpinner />
      {{else if result.isRejected}}
        <p>
          Whoops! Looks like something went wrong!
          {{result.error.message}}
        </p>
      {{/if}}
    {{/let}}
    ```

- Create declarative data fetches based on arguments to a component in a backing class:

    ```js
    import Component from '@glimmer/component';
    import { cached } from '@glimmer/tracking';
    import { inject as service } from '@ember/service';
    import { TrackedAsyncData } from 'ember-async-data';

    export default class SmartProfile extends Component {
      @service store;

      @cached
      get someData() {
        let recordPromise = this.store.findRecord('user', this.args.id);
        return new TrackedAsyncData(recordPromise);
      }
    }
    ```

    (See the guide [below](#in-javascript) for why this uses `@cached`!)

    ```hbs
    {{#if this.someData.isResolved}}
      <PresentTheData @data={{this.someData.value}} />
    {{else if this.someData.isPending}}
      <LoadingSpinner />
    {{else if this.someData.isRejected}}
      <p>
        Whoops! Looks like something went wrong!
        {{this.someData.error.message}}
      </p>
    {{/if}}
    ```


## Contents <!-- omit in toc -->

- [Compatibility](#compatibility)
  - [TypeScript](#typescript)
- [Installation](#installation)
- [Motivation](#motivation)
- [Usage](#usage)
  - [In JavaScript](#in-javascript)
    - [With TypeScript](#with-typescript)
    - [Note on Usage with API Calls](#note-on-usage-with-api-calls)
    - [`load` function](#load-function)
    - [Subclassing](#subclassing)
  - [In templates](#in-templates)
  - [Testing](#testing)
    - [Unit testing](#unit-testing)
    - [Integration testing](#integration-testing)
- [API](#api)
  - [`TrackedAsyncData`](#trackedasyncdata)
    - [Notes](#notes)
  - [`load` function](#load-function-1)
  - [In templates](#in-templates-1)
- [Explanation](#explanation)
  - [Background and history](#background-and-history)
- [Contributing](#contributing)
- [License](#license)
- [Credit](#credit)

---

## Compatibility

* Ember.js v3.28 or above (requires Octane Edition)
* Embroider or ember-auto-import v2.0.0 or above (this is [v2 addon](https://emberjs.github.io/rfcs/0507-embroider-v2-package-format.html))

### TypeScript

This project follows the current draft of [the Semantic Versioning for TypeScript Types][semver] proposal.

- **Currently supported TypeScript versions:** v4.3, v4.4, v4.5, v4.6, v4.7, v4.8, v4.9
- **Compiler support policy:** [simple majors][sm]
- **Public API:** all published types not in a `-private` module are public

[semver]: https://www.semver-ts.org
[sm]: https://www.semver-ts.org/#simple-majors


## Installation

```
ember install ember-async-data
```

## Motivation

Sometimes it doesn't make sense for a route to fetch the data required by a given component. This can be the case for a number of reasons:

- The data for the component is not essential for the route and is not driven by a URL.
- In some contexts, it is impossible to know which data to load ahead of time. In these cases the data must be loaded at the point of user interaction.
- Having a component drive its own consumption of data can make the component easier to reuse and increase readability where the data fetching would otherwise be far removed from the actual component usage.

Additionally, it's often valuable to load data only when required, because it factors into network speed and CPU cost and often goes unused entirely. Though these concerns are present everywhere, they are especially important in rural areas and emerging markets where:

- Networks are slower, so it costs more CPU and therefore energy/battery to accomplish the same task
- Devices are slower, so both the network call and the response parsing further degrade page performance
- Data loading often has a 1:1 bytes-used-to-amount-paid cost to the user


## Usage

You can use `TrackedAsyncData` either directly in JavaScript or via the `{{load}}` helper in templates.

- [In JavaScript](#in-javascript)
    - [With TypeScript](#with-typescript)
    - [Note on Usage with API Calls](#note-on-usage-with-api-calls)
    - [`load` function](#load-function)
    - [Subclassing](#subclassing)
- [In Templates](#in-templates)
- [Testing](#testing)


### In JavaScript

To create a `TrackedAsyncData`, simply import it from the library and call its constructor with a `Promise`.

First, a small utility function for being able to resolve or reject a `Promise` at will (so we can see how the lifecycle behaves):

```ts
function defer() {
  let deferred!: {
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  } = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}
```

Now we can create promises to resolve or reject and pass them to `TrackedAsyncData`:

```ts
import { TrackedAsyncData } from 'ember-async-data';

let firstDeferred = defer();
let willResolve = new TrackedAsyncData(firstDeferred.promise);

console.log(willResolve);
/*
TrackedAsyncData: {
  "isPending": true,
  "isResolved": false,
  "isRejected": false
}
*/

await firstDeferred.resolve('potato');
console.log(willResolve);
/*
TrackedAsyncData: {
  "isPending": false,
  "isResolved": true,
  "value": "potato",
  "isRejected": false
}
*/

// create another promise, this time to reject
let secondDeferred = defer();
let willReject = new TrackedAsyncData(secondDeferred.promise);

console.log(willReject);
/*
TrackedAsyncData: {
  "isPending": true,
  "isResolved": false,
  "isRejected": false
}
*/

await secondDeferred.reject('wat');
console.log(willReject);
/*
TrackedAsyncData: {
  "isPending": false,
  "isResolved": false,
  "isRejected": true,
  "error": "wat"
}
*/
```

You can use `TrackedAsyncData` with *any* value, not just a `Promise`, which is convenient when working with data which may or may not already be in a `Promise`.


#### With TypeScript

This library provides full type safety for `TrackedAsyncData`; see [**API**](#api) below for details. The resulting `value` will always be of the same type as the `Promise` you pass in. Type narrowing works correctly: if you check the `.state` property or any of the `.isPending`, `.isResolved`, or `.isRejected` properties, the resulting type will have the correct corresponding types for `.value` and `.error`.

- With `.state`:

    ```ts
    let example = new TrackedAsyncData(Promise.resolve({ theAnswer: 42 }));
    switch (example.state) {
      case 'PENDING':
        console.log(example.value?.theAnswer);  // 🛑 WARN; type is `number | null`
        console.log(example.error);             // 🛑 WARN
        break;
      case 'RESOLVED':
        console.log(example.value.theAnswer);   // ✅
        console.log(example.error);             // 🛑 WARN
        break;
      case 'REJECTED':
        console.log(example.value?.theAnswer);  // 🛑 WARN; type is `number |
        console.log(example.error);             // ✅
        break;
      default:
        assertUnreachable(example);             // ✅ as long as all cases covered
    }
    ```


- With the boolean property checks `.isPending`, `.isResolved`, or `.isRejected`:

    ```ts
    let example = new TrackedAsyncData(Promise.resolve("a string"));
    if (example.isResolved) {
      console.log(example.value.length); // ✅ type is `string`
    }
    ```


#### Note on Usage with API Calls

When using `TrackedAsyncData` with an API call in a getter, it is important to use [`@cached`](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/cached) (for Ember.js < 4.5 via the [ember-cached-decorator-polyfill](https://github.com/ember-polyfills/ember-cached-decorator-polyfill)) with the getter. Otherwise, you can end up triggering the creation of multiple API calls. For example, given a backing class like this:

```ts
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import { TrackedAsyncData } from 'ember-async-data';

export default class Profile extends Component<{ userId: string }> {
  @service store: Store;

  get fullProfile() {
    return new TrackedAsyncData(this.store.findRecord('user', userId));
  }
}
```

Then if the template checks the `fullProfile` state in multiple places, it will invoke the getter multiple times per render:

```hbs
{{#if this.fullProfile.isPending}}
  <LoadingSpinner />
{{/if}}

<div class='profile {{if (not this.fullProfile.isResolved) "pending"}}'>
  {{#if this.fullProfile.isResolved}}
    {{#let this.fullProfile.value as |profile|}}
      <p>{{profile.name}} ({{profile.description}})</p>

      <img
        src={{profile.avatar}}
        alt="avatar for {{profile.name}}"
      />
    {{/let}}
  {{/if}}
</div>
```

This code would invoke the getter twice on first render, which would therefore trigger two separate calls to the store, one of which would effectively be thrown away. Then, once the second call *did* resolve, it would invoke the getter multiple *more* times, and the result would be a sort of ping-ponging back and forth between pending and resolved states as a cascade of new API calls are triggered by each invocation of the getter.

This is the *correct* default behavior, even though it might be surprising at first:

- For getters and templates: in Octane, caching is something we layer onto getters where it makes sense to pay for them, rather than paying for them *everywhere* (as in Ember classic) even when that's far more costly than just rerunning the getter a couple times. For API calls, it always makes sense!
- For the `TrackedAsyncData` API, this similarly means we don't pay for extra caching of arguments in the many cases we don't need it.

_**Note:** in the future, we will make a set of [Resources](https://www.pzuraq.com/introducing-use/) layered on top of the core data types here, which will allow us to build in caching for API calls._


#### `load` function

For symmetry with templates, you can also use `load` in JavaScript; it has the exact same semantics as calling `new TrackedAsyncData`. Using `load`, the example from the top of the README would look like this:

```ts
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { load } from 'ember-async-data';

export default class SmartProfile extends Component {
  @service store;

  @cached
  get someData() {
    return load(this.store.findRecord('user', this.args.id));
  }
}
```

Note that this has the exact same requirements around API calls as the direct use of the constructor.

#### Subclassing

It is illegal to subclass `TrackedAsyncData`; trying to invoke a subclass will throw an error.


### In templates

To use a `TrackedAsyncData` in templates, we provide the `load` helper. You can pass it any value, and it will return a `TrackedAsyncData` for that value. You can then use the `.isPending`, `.isResolved`, and `.isRejected` properties to conditionally render content based on the state of the promise.

You could use this to build a component which uses named blocks to provide a nice API for end users:

```hbs
<div class='loader'>
  {{#let (load @promise) as |result|}}
    {{#if result.isPending}}
      <div class='loader__pending'>
        {{if (has-block "pending")}}
          {{yield to="pending"}}
        {{else}}
          Loading...
        {{/if}}
      </div>
    {{else if result.isResolved}}
      <div class='loader__resolved'>
        {{if (has-block "resolved")}}
          {{yield result.value to="resolved"}}
        {{else}}
          {{result.value}}
        {{/if}}
      </div>
    {{else if result.isRejected}}
      <div class='loader__rejected'>
        {{if (has-block "rejected")}}
          {{yield result.error to="rejected"}}
        {{else}}
          {{result.error}}
        {{/if}}
      </div>
    {{/if}}
  {{/let}}
</div>
```

Then callers could use it like this:

```hbs
<Loader @promise={{this.someQuery}}>
  <:pending>Hang on, we’ll get that data for you!</:pending>

  <:resolved as |value|>
    Cool! The value you asked for was: {{value}}.
  <:/resolve>

  <:rejected as |error|>
    Oh no, we couldn't get that data for you. Here's what we know: {{error}}
  <:/rejected>
</Loader>
```

This project ships [Glint](https://github.com/typed-ember/glint) types,
which allow you when using TypeScript to get strict type checking in your templates.

Unless you are using [strict mode](http://emberjs.github.io/rfcs/0496-handlebars-strict-mode.html) templates
(via [first class component templates](http://emberjs.github.io/rfcs/0779-first-class-component-templates.html)),
Glint needs a [Template Registry](https://typed-ember.gitbook.io/glint/using-glint/ember/template-registry)
that contains entries for the template helper provided by this addon.
To add these registry entries automatically to your app, you just need to import `ember-async-data/template-registry`
from somewhere in your app. When using Glint already, you will likely have a file like
`types/glint.d.ts` where you already import glint types, so just add the import there:

```ts
import '@glint/environment-ember-loose';
import type EmberAsyncDataRegistry from 'ember-async-data/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends EmberAsyncDataRegistry, /* other addon registries */ {
    // local entries
  }
}
```

> **Note:** Glint itself is still under active development, and as such breaking changes might occur.
> Therefore, Glint support by this addon is also considered experimental, and not covered by our SemVer contract!

### Testing

Working with the full range of behavior from `TrackedAsyncData` in tests will require you to manage the inherent asynchrony of the system much more explicitly than you may be used to. This is unavoidable: the point of the helper and data type *is* dealing with asynchrony in an explicit way.

As a starting point, you can and should ask: "Is testing the a loading spinner when `someTrackedAsyncData.isLoading` something I actually need an automated test for, or can I verify it manually just once?" Depending on your app, your answer might be that just verifying it manually is a better use of your time! In other cases, testing that behavior might be essential: for example, if you are building an abstraction on top of `TrackedAsyncData` for *others* to consume.

#### Unit testing

Unit testing is straightforward. Using a tool like [`RSVP.defer()`](https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/defer.js), you can create a promise and control its resolution and verify that your use of `TrackedAsyncData` does what you need it to. Whenever you trigger a change in the state of the underlying promise, you will need to wait for promise resolution in the test. There are two ways to do this:

1. If you are working with a promise directly, you can simply `await` the promise itself.
2. If you are working with things which might or might not be promises, or working at a higher level of abstraction where you don’t have direct access to the promise, you can `await` the `settled()` helper from `@ember/test-helpers`, since `TrackedAsyncData` integrates into Ember’s test waiter system.

```js
import { TrackedAsyncData } from 'ember-async-data';
import { defer } from 'rsvp';
import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';

module('my very own tests', function (hooks) {
  test('directly awaiting the promise works', async function (assert) {
    let { promise, resolve } = defer();
    let asyncData = new TrackedAsyncData(promise);
    assert.true(asyncData.isPending);

    let expectedValue = "cool";
    resolve(expectedValue);
    await promise;
    assert.true(asyncData.isResolved);
    asset.equal(asyncData.value, expectedValue);
  });

  test('awaiting `settled` also works', async function (assert) {
    let { promise, resolve } = defer();
    let asyncData = new TrackedAsyncData(promise);
    assert.true(asyncData.isPending);

    let expectedValue = "cool";
    resolve(expectedValue);
    await settled();
    assert.true(asyncData.isResolved);
    asset.equal(asyncData.value, expectedValue);
  });
});
```

Handling errors is slightly more complicated: `TrackedAsyncData` “re-throws” the promises it works with when they have errors, to avoid silently swallowing them in a way that prevents you from using them with logging infrastructure or otherwise dealing with them in your app’s infrastructure. However, this means you must also account for them in your testing:

```js
  test('it handles errors', function (assert) {
    assert.expect(2);

    let { promise, reject } = defer();
    let asyncData = new TrackedAsyncData(promise);

    reject(new Error("this is the error!"));
    await promise.catch((error) => {
      assert.equal(error.message, "this is the error!");
    });

    assert.true(asyncData.isRejected);
    assert.equal(asyncData.error.message, "this is the error!");
  });
```

#### Integration testing

Integration/render tests are similar to those with unit testing, but with an additional wrinkle: all of Ember’s integration test helpers are *also* asynchronous, and the asynchrony of those test helpers and the `TrackedAsyncData` become “entangled” when they interact. That is: when you render something which depends on the state of the `TrackedAsyncData`, the promise which `TrackedAsyncData` is handling and the promise for rendering are effectively tied together.

So this code, which you might write if you haven’t dealt with this before, ***WILL NOT WORK***:

```js
import { TrackedAsyncData } from 'ember-async-data';
import { defer } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from '@ember/test-helpers';
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module('my very own tests', function (hooks) {
  setupRenderingTest(hooks);

  test('THIS DOES NOT WORK', function (assert) {
    let { promise, resolve } = defer();
    this.data = new TrackedAsyncData(promise);

    await render(hbs`
      <div data-test-data>
        {{#if this.data.isPending}}
          Loading...
        {{else if this.data.isResolved}}
          Loaded: {{this.data.value}}
        {{else if this.data.isRejected}}
          Error: {{this.data.error.message}}
        {{/if}}
      </div>
    `);

     assert.dom('[data-test-data]').hasText('Loading...');
  });
});
```

This test will simply time out without ever having finished, because the test waiters in the render promise and the test waiters in `TrackedAsyncData` are tangled up together. Instead, we need to separate the rendering promise from the promise in `TrackedAsyncData`. We can instead render the template and, instead of waiting for *that* promise to resolve, use Ember’s `waitFor` helper to wait for the *results* of rendering to happen. Then when we are done dealing with the promise, we can resolve it and *then* `await` the result of the render promise. This will let the test clean up correctly:

```js
import { TrackedAsyncData } from 'ember-async-data';
import { defer } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from '@ember/test-helpers';
import { render, waitFor } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module('my very own tests', function (hooks) {
  setupRenderingTest(hooks);

  test('this actually works', function (assert) {
    let { promise, resolve } = defer();
    this.data = new TrackedAsyncData(promise);

    const renderPromise = render(hbs`
      <div data-test-data>
        {{#if this.data.isPending}}
          Loading...
        {{else if this.data.isResolved}}
          Loaded: {{this.data.value}}
        {{else if this.data.isRejected}}
          Error: {{this.data.error.message}}
        {{/if}}
      </div>
    `);

     // Here we waits for the *result* of rendering, rather than the render
     // promise itself. Once we have rendered, we can make assertions about
     // what rendered:
     await waitFor('data-test-data');
     assert.dom('[data-test-data]').hasText('Loading...');

     // Then to clean up the test, we need the original promise to resolve
     // so the test waiter system isn't just stuck waiting for it forever.
     resolve();
     // Finally, we
     await renderPromise;
  });
});
```

While this might seem a bit annoying, it means that we actually *can* control all the related bits of asynchronous code that we need, and—more just as importantly—it means we avoid leaking promises across tests (a common cause of test instability) and means that in general tests following the “happy path” *don’t* have to worry about managing this asynchrony themselves.

For that happy path, you can use a *resolved* `TrackedAsyncData` and everything will always “just work” as you’d expect:

```js
  test('the "happy path" works easily', async function (assert) {
    this.data = new TrackedAsyncData(Promise.resolve("a value"));

    await render(hbs`
      <div data-test-data>
        {{#if this.data.isPending}}
          Loading...
        {{else if this.data.isResolved}}
          Loaded: {{this.data.value}}
        {{else if this.data.isRejected}}
          Error: {{this.data.error.message}}
        {{/if}}
      </div>
    `);

     assert.dom('[data-test-data]').hasText('Loaded: a value');
  });
```

In other words, the only time you have to care about the details of handling async in your tests is when you want to render and step through the different async states explicitly.

## API

You can currently use this in three distinct ways:

1. By using the `TrackedAsyncData` class directly in JavaScript.
2. With the `load` utility function exported from the helper file. (This is not preferred, but exists for backwards compatibility and symmetry with the helper, until we have a `Resource`-style API available.)
3. With the `{{load}}` helper in templates.


### `TrackedAsyncData`

The public API for `TrackedAsyncData`:

```ts
class TrackedAsyncData<T> {
  constructor(data: T | Promise<T>);

  get state(): "PENDING" | "RESOLVED" | "REJECTED";
  get isPending(): boolean;
  get isResolved(): boolean;
  get isRejected(): boolean;

  // Only available if `isResolved`.
  get value(): T | null;

  // Only available if `isRejected`.
  get error(): unknown;
}
```


#### Notes

- `value` is `T | null` today, but only for the sake of safe interop with Ember Classic computed properties (which eagerly evaluate getters for the sake of). You *should not* rely on the `null` fallback, as accessing `value` when `isResolved` is false will become a hard error at the 1.0 release. The same is true of `error`.
- The class is *not* intended for subclassing, and will in fact throw in the constructor if you try to subclass it!
- The `value` and `error` getters will *warn* if you access them and the underlying promise is in the wrong state. In the future, this will be converted to throwing an error. (It currently only warns because classic computed properties actively lookup and cache the values returned from their dependent keys.)


### `load` function

The `load` helper function is basically just a static constructor for `TrackedAsyncData`:

```ts
function load<T>(data: T | Promise<T>): TrackedAsyncData<T>;
```


### In templates

The `{{load}}` helper is identical to the `load` function but in template space: it accepts a single positional parameter of a promise as its only argument, and yields a `TrackedAsyncData` for that promise. (See usage examples [above](#in-templates).)

## Explanation

For a deep dive, see this pair of blog posts (the API has changed slightly since these were authored, but the fundamental ideas are the same):

- [Migrating Off of `PromiseProxyMixin` in Ember Octane](https://v5.chriskrycho.com/journal/migrating-off-of-promiseproxymixin-in-ember-octane/)
- [Async Data and Autotracking in Ember Octane](https://v5.chriskrycho.com/journal/async-data-and-autotracking-in-ember-octane/)

You can think of this as an autotracked, Ember-friendly implementation of the idea in [How Elm Slays a UI Antipattern](http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html).

### Background and history

In the past, Ember developers tended to reach for `PromiseProxyMixin` to solve this problem. However, `PromiseProxyMixin` has two significant issues:

1.  Because it directly proxies to the underlying promise values, it is possible to misuse by accessing the properties of the resolved type synchronously, instead of properly awaiting the value of the promise (either with `await` or with `.then()`).
2.  Because it is a mixin, it cannot be used with Glimmer components, and in general is not compatible with the future direction of Ember, which is moving *away* from mixins and *toward* appropriate use of delegates (whether services or non-singleton regular classes), composition, and pure functions.

The `load` helper is a fully-featured replacement for `PromiseProxyMixin`, with none of these pitfalls. This takes a promise as a parameter and returns a `TrackedAsyncData` object which handles the pending/resolved/rejected state as well as value/error data. The associated `load` helper provides a consistent way for developers to load data in their component templates.


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Credit

Research into the ideas behind this code happened at [LinkedIn](https://www.linkedin.com), with key work done by [Yaobin Dong](https://www.linkedin.com/in/yaobin-dong-8a881481/), [Lucy Lin](https://www.linkedin.com/in/lucylylin/), [Lewis Miller](https://www.linkedin.com/in/lewis-miller/), and [Chris Krycho](https://www.linkedin.com/in/chriskrycho/). While this new implementation is distinct from that one in many ways, it would have been impossible without those initial efforts!
