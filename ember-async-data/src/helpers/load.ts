/* eslint-disable prefer-const */
import {
  helper,
  type EmptyObject,
  type FunctionBasedHelperInstance,
} from '@ember/component/helper';
import TrackedAsyncData from '../tracked-async-data';

/**
  Given a `Promise`, return a `TrackedAsyncData` object which exposes the state
  of the promise, as well as the resolved value or thrown error once the promise
  resolves or fails.

  The function and helper accept any data, so you may use it freely in contexts
  where you are receiving data which may or may not be a `Promise`.

  ## Example

  Given a backing class like this:

  ```js
  import Component from '@glimmer/component';
  import { cached } from 'ember-cached-decorator-polyfill';
  import { load } from 'ember-tracked-data/helpers/load';

  export default class ExtraInfo extends Component {
    @cached
    get someData() {return load(fetch('some-url', this.args.someArg));
    }
  }
  ```

  You can use the result in your template like this:

  ```hbs
  {{#if this.someData.isLoading}}
    loading...
  {{else if this.someData.isLoaded}}
    {{this.someData.value}}
  {{else if this.someData.isError}}
    Whoops! Something went wrong: {{this.someData.error}}
  {{/if}}
  ```

  You can also use the helper directly in your template:

  ```hbs
  {{#let (load @somePromise) as |data|}}
    {{#if data.isLoading}}
      <LoadingSpinner />
    {{else if data.isLoaded}}
      <SomeComponent @data={{data.value}} />
    {{else if data.isError}}
      <Error @cause={{data.error}} />
    {{/if}}
  {{/let}}
  ```

  @param data The (async) data we want to operate on: a value or a `Promise` of
    a value.
  @param context An optional, but highly recommended, context object to use for
    managing the destruction of the resulting `TrackedAsyncData`, which can be
    any object which participates in Ember's normal destruction lifecycle
    (components, helpers, modifiers, etc.). If you do not supply this parameter,
    and you have a test failure which causes async code to not get cleaned up
    you may see all following tests fail.
  @returns An object containing the state(, value, and error).
  @note Prefer to use `TrackedAsyncData` directly! This function is provided
    simply for symmetry with the helper and backwards compatibility.
 */
export function load<T>(data: T | Promise<T>): TrackedAsyncData<T> {
  return new TrackedAsyncData(data);
}

type Signature<T> = {
  Args: {
    Positional: [T | Promise<T>];
    Named: EmptyObject;
  };
  Return: TrackedAsyncData<T>;
};

let loadHelper: abstract new <T>() => FunctionBasedHelperInstance<Signature<T>>;

// TODO: in v2.0.0, switch this to simply using the function above. (It needs to
// be in a breaking change because of the change in the call signature.)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
loadHelper = helper(function loadHelper<T>([data]: [
  T | Promise<T>
]): TrackedAsyncData<T> {
  return new TrackedAsyncData(data);
});

export default loadHelper;
