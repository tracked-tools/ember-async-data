import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import TrackedAsyncData from '../tracked-async-data';

export interface AsyncSignature<T> {
  Args: {
    /** The `TrackedAsyncData` to render. */
    data: T | Promise<T>;
  };
  Blocks: {
    /** To render while waiting on the promise */
    pending: [];
    /** To render once the promise has resolved, with the resolved value. */
    resolved: [value: T];
    /** To render if the promise has rejected, with the associated reason. */
    rejected: [reason: unknown];
  };
}

/**
  Render a `TrackedAsyncData` in a template, with named blocks for each of the
  states the value may be in. This is somewhat nicer than doing the same with
  an `if`/`else if` chain, and composes nicely with other template primitives.

  It is also less error prone, in that you *cannot* access the value of the data
  in the `pending` or `rejected` blocks: it is only yielded by the `resolved`
  named block.

  ```ts
  import { Async } from 'ember-async-data'
  import LoadingSpinner from './loading-spinner';

  function dumpError(error: unknown) {
    return JSON.stringify(error);
  }

  let example = new TrackedAsyncData("hello");

  <template>
    <Async @data={{example}}>
      <:pending>
        <LoadingSpinner />
      </:pending>

      <:resolved as |value|>
        <SomeComponent @arg={{value}} />
      </:resolved>

      <:rejected as |reason|>
        <p>Whoops, something went wrong!</p>
        <pre><code>
          {{dumpErr reason}}
        </code></pre>
      </:rejected>
    </Async>
  </template>
  ```
 */
// IMPLEMENTATION NOTE: yes, future maintainer, this *does* have to be a class,
// not a template-only component. This is because it must be generic over the
// type passed in so that the yielded type can preserve that ("parametricity").
// That is: if we pass in a `TrackedAsyncData<string>`, the value yielded from
// the `resolved` named block should be a string. The only things which can
// preserve the type parameter that way are functions and classes, and we do not
// presently have a function-based way to define components, so we have to use
// a class instead to preserve the type!
export default class Async<T> extends Component<AsyncSignature<T>> {
  @cached get data() {
    return new TrackedAsyncData(this.args.data);
  }

  <template>
    {{#if this.data.isResolved}}
      {{yield this.data.value to='resolved'}}
    {{else if this.data.isRejected}}
      {{yield this.data.error to='rejected'}}
    {{else}}
      {{yield to='pending'}}
    {{/if}}
  </template>
}
