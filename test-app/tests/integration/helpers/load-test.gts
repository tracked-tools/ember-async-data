import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import load from 'ember-async-data/helpers/load';
import { defer } from '../../defer';

class LocalState {
  @tracked promise: Promise<unknown>;

  constructor(promise: Promise<unknown>) {
    this.promise = promise;
  }
}

module('Integration | Helper | load', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders loading state', async function (assert) {
    const { promise, resolve } = defer();

    const renderPromise = render(<template>
      <div data-test-load-helper>
        {{#let (load promise) as |result|}}
          {{#if result.isResolved}}
            RESOLVED {{result.value}}
          {{else if result.isPending}}
            PENDING
          {{else if result.isRejected}}
            REJECTED
          {{/if}}
        {{/let}}
      </div>
    </template>);

    await waitFor('[data-test-load-helper]');

    assert.dom('[data-test-load-helper]').hasText('PENDING');

    resolve();
    await renderPromise;
  });

  test('it renders loaded state', async function (assert) {
    const deferred = defer();
    deferred.resolve('foobar');
    await deferred.promise;

    const renderPromise = render(<template>
      <div data-test-load-helper>
        {{#let (load deferred.promise) as |result|}}
          {{#if result.isResolved}}
            RESOLVED {{result.value}}
          {{else if result.isPending}}
            PENDING
          {{else if result.isRejected}}
            REJECTED
          {{/if}}
        {{/let}}
      </div>
    </template>);

    await waitFor('[data-test-load-helper]');
    assert.dom('[data-test-load-helper]').containsText('RESOLVED');
    assert.dom('[data-test-load-helper]').containsText('foobar');

    await renderPromise;
  });

  test('it renders error state', async function (assert) {
    assert.expect(3);

    const { promise, reject } = defer();

    // This handles the error throw from rendering a rejected promise
    promise.catch((error: Error) => {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.message, 'foobar');
    });

    reject(new Error('foobar'));

    const renderPromise = render(<template>
      <div data-test-load-helper>
        {{#let (load promise) as |result|}}
          {{#if result.isResolved}}
            RESOLVED {{result.value}}
          {{else if result.isPending}}
            PENDING
          {{else if result.isRejected}}
            REJECTED
          {{/if}}
        {{/let}}
      </div>
    </template>);

    await waitFor('[data-test-load-helper]');
    assert.dom('[data-test-load-helper]').hasText('REJECTED');

    await renderPromise;
  });

  test('it renders loading state and then loaded state', async function (assert) {
    const { promise, resolve } = defer();

    const renderPromise = render(<template>
      <div data-test-load-helper>
        {{#let (load promise) as |result|}}
          {{#if result.isResolved}}
            <div data-test-state='RESOLVED'>RESOLVED {{result.value}}</div>
          {{else if result.isPending}}
            <div data-test-state='PENDING'>PENDING</div>
          {{else if result.isRejected}}
            <div data-test-state='REJECTED'>REJECTED</div>
          {{/if}}
        {{/let}}
      </div>
    </template>);

    await waitFor('[data-test-load-helper]');
    assert.dom('[data-test-load-helper]').hasText('PENDING');

    resolve();

    await waitFor('[data-test-state="RESOLVED"]');
    assert.dom('[data-test-load-helper]').hasText('RESOLVED');

    await renderPromise;
  });

  test('it renders loading state and then error state', async function (assert) {
    assert.expect(3);

    const { promise, reject } = defer();

    const renderPromise = render(<template>
      <div data-test-load-helper>
        {{#let (load promise) as |result|}}
          {{#if result.isResolved}}
            <div data-test-state='RESOLVED'>RESOLVED {{result.value}}</div>
          {{else if result.isPending}}
            <div data-test-state='PENDING'>PENDING</div>
          {{else if result.isRejected}}
            <div data-test-state='REJECTED'>REJECTED</div>
          {{/if}}
        {{/let}}
      </div>
    </template>);

    await waitFor('[data-test-load-helper]');
    assert.dom('[data-test-load-helper]').hasText('PENDING');

    reject(new Error('foobar'));

    // This handles the error thrown at the top level
    await promise.catch(() => {
      assert.ok(true, 'things are neat!');
    });

    await waitFor('[data-test-state="REJECTED"]');
    assert.dom('[data-test-load-helper]').hasText('REJECTED', 'rejected');

    await renderPromise;
  });

  test('it renders the state for the new promise if a new promise is sent and resolves before the old promise is done loading', async function (assert) {
    assert.expect(4);

    const { promise: oldPromise, reject: rejectOld } = defer();
    const localState = new LocalState(oldPromise);

    // This handles the error throw from rendering a rejected promise
    oldPromise.catch((error) => {
      assert.ok(error instanceof Error);
      assert.strictEqual((error as Error).message, 'foobar');
    });

    const renderPromise = render(<template>
      <div data-test-load-helper>
        {{#let (load localState.promise) as |result|}}
            {{#if result.isResolved}}
              <div data-test-state='RESOLVED'>RESOLVED {{result.value}}</div>
            {{else if result.isPending}}
              <div data-test-state='PENDING'>PENDING</div>
            {{else if result.isRejected}}
              <div data-test-state='REJECTED'>REJECTED</div>
            {{/if}}
          {{/let}}
        </div>
      </template>);

    await waitFor('[data-test-load-helper]');
    assert.dom('[data-test-load-helper]').hasText('PENDING');

    const { promise: newPromise, resolve: resolveNew } = defer();
   localState.promise = newPromise;

    resolveNew();
    await newPromise;
    rejectOld(new Error('foobar'));

    await waitFor('[data-test-state="RESOLVED"]');
    assert.dom('[data-test-load-helper]').hasText('RESOLVED');

    await renderPromise;
  });

  test('it renders the state and value for the new promise if a new promise with a different value is sent before the old promise is done loading', async function (assert) {
    const { promise: oldPromise, resolve: resolveOld } = defer();
    const localState = new LocalState(oldPromise);

    const renderPromise = render(<template>
        <div data-test-load-helper>
          {{#let (load localState.promise) as |result|}}
            {{#if result.isResolved}}
              <div data-test-state='RESOLVED'>RESOLVED {{result.value}}</div>
            {{else if result.isPending}}
              <div data-test-state='PENDING'>PENDING</div>
            {{else if result.isRejected}}
              <div data-test-state='REJECTED'>REJECTED</div>
            {{/if}}
          {{/let}}
        </div>
      </template>);

    await waitFor('[data-test-load-helper]');
    assert.dom('[data-test-load-helper]').hasText('PENDING');

    const { promise: newPromise, resolve: resolveNew } = defer();
    localState.promise = newPromise;

    resolveNew('New');
    await newPromise;
    resolveOld('Old');
    await oldPromise;

    await waitFor('[data-test-state="RESOLVED"]');
    assert.dom('[data-test-load-helper]').containsText('RESOLVED');
    assert.dom('[data-test-load-helper]').containsText('New');

    await renderPromise;
  });

  test('it renders error state and then loading state for a retried promise', async function (assert) {
    assert.expect(4);

    const deferred = defer();
    const promise = deferred.promise;
    const localState = new LocalState(promise);

    // This handles the error throw from rendering a rejected promise
    deferred.promise.catch((error: Error) => {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.message, 'foobar');
    });

    deferred.reject(new Error('foobar'));

    const renderPromise = render(<template>
        <div data-test-load-helper>
          {{#let (load localState.promise) as |result|}}
            {{#if result.isResolved}}
              <div data-test-state='RESOLVED'>RESOLVED {{result.value}}</div>
            {{else if result.isPending}}
              <div data-test-state='PENDING'>PENDING</div>
            {{else if result.isRejected}}
              <div data-test-state='REJECTED'>REJECTED</div>
            {{/if}}
          {{/let}}
        </div>
      </template>);

    await waitFor('[data-test-load-helper]');
    assert.dom('[data-test-load-helper]').hasText('REJECTED');

    const retryDeferred = defer();
    localState.promise = retryDeferred.promise;

    await waitFor('[data-test-state="PENDING"]');
    assert.dom('[data-test-load-helper]').hasText('PENDING');

    retryDeferred.resolve();
    await retryDeferred.promise;
    await renderPromise;
  });
});
