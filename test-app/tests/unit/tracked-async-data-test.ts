import { module, test } from 'qunit';
import { defer } from '../defer';
import TrackedAsyncData from 'ember-async-data/tracked-async-data';
import { settled } from '@ember/test-helpers';

module('Unit | TrackedAsyncData', function () {
  test('cannot be subclassed', function (assert) {
    // @ts-expect-error: The type is not statically subclassable, either, so
    //   this fails both at the type-checking level and dynamically at runtime.
    class Subclass extends TrackedAsyncData<unknown> {}

    assert.throws(() => new Subclass(Promise.resolve('nope')));
  });

  test('is initially PENDING', async function (assert) {
    const deferred = defer();

    const result = new TrackedAsyncData(deferred.promise);
    assert.strictEqual(result.state, 'PENDING');
    assert.true(result.isPending);
    assert.false(result.isResolved);
    assert.false(result.isRejected);
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    deferred.resolve();
    await deferred.promise;
  });

  test('it updates to resolved state', async function (assert) {
    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise);

    deferred.resolve('foobar');
    await settled();

    assert.strictEqual(result.state, 'RESOLVED');
    assert.false(result.isPending);
    assert.true(result.isResolved);
    assert.false(result.isRejected);
    assert.strictEqual(result.value, 'foobar');
    assert.strictEqual(result.error, null);
  });

  module('it returns resolved state for non-thenable input', function () {
    test('undefined', async function (assert) {
      const loadUndefined = new TrackedAsyncData(undefined);
      await settled();

      assert.strictEqual(loadUndefined.state, 'RESOLVED');
      assert.false(loadUndefined.isPending);
      assert.true(loadUndefined.isResolved);
      assert.false(loadUndefined.isRejected);
      assert.strictEqual(loadUndefined.value, undefined);
      assert.strictEqual(loadUndefined.error, null);
    });

    test('null', async function (assert) {
      const loadNull = new TrackedAsyncData(null);
      await settled();

      assert.strictEqual(loadNull.state, 'RESOLVED');
      assert.false(loadNull.isPending);
      assert.true(loadNull.isResolved);
      assert.false(loadNull.isRejected);
      assert.strictEqual(loadNull.value, null);
      assert.strictEqual(loadNull.error, null);
    });

    test('non-thenable object', async function (assert) {
      const notAThenableObject = { notAThenable: true };
      const loadObject = new TrackedAsyncData(notAThenableObject);
      await settled();

      assert.strictEqual(loadObject.state, 'RESOLVED');
      assert.false(loadObject.isPending);
      assert.true(loadObject.isResolved);
      assert.false(loadObject.isRejected);
      assert.strictEqual(loadObject.value, notAThenableObject);
      assert.strictEqual(loadObject.error, null);
    });

    test('boolean: true', async function (assert) {
      const loadTrue = new TrackedAsyncData(true);
      await settled();

      assert.strictEqual(loadTrue.state, 'RESOLVED');
      assert.false(loadTrue.isPending);
      assert.true(loadTrue.isResolved);
      assert.false(loadTrue.isRejected);
      assert.true(loadTrue.value);
      assert.strictEqual(loadTrue.error, null);
    });

    test('boolean: false', async function (assert) {
      const loadFalse = new TrackedAsyncData(false);
      await settled();

      assert.strictEqual(loadFalse.state, 'RESOLVED');
      assert.false(loadFalse.isPending);
      assert.true(loadFalse.isResolved);
      assert.false(loadFalse.isRejected);
      assert.false(loadFalse.value);
      assert.strictEqual(loadFalse.error, null);
    });

    test('number', async function (assert) {
      const loadNumber = new TrackedAsyncData(5);
      await settled();

      assert.strictEqual(loadNumber.state, 'RESOLVED');
      assert.false(loadNumber.isPending);
      assert.true(loadNumber.isResolved);
      assert.false(loadNumber.isRejected);
      assert.strictEqual(loadNumber.value, 5);
      assert.strictEqual(loadNumber.error, null);
    });

    test('string', async function (assert) {
      const loadString = new TrackedAsyncData('js');
      await settled();

      // loadString
      assert.strictEqual(loadString.state, 'RESOLVED');
      assert.false(loadString.isPending);
      assert.true(loadString.isResolved);
      assert.false(loadString.isRejected);
      assert.strictEqual(loadString.value, 'js');
      assert.strictEqual(loadString.error, null);
    });
  });

  test('it returns error state', async function (assert) {
    assert.expect(8);

    // This handles the error throw from rendering a rejected promise
    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise);

    deferred.reject(new Error('foobar'));
    await deferred.promise.catch((error) => {
      assert.true(error instanceof Error);
      assert.strictEqual(
        (error as Error).message,
        'foobar',
        'thrown promise rejection',
      );
    });

    assert.strictEqual(result.state, 'REJECTED');
    assert.false(result.isPending);
    assert.false(result.isResolved);
    assert.true(result.isRejected);
    assert.strictEqual(result.value, null);
    assert.strictEqual((result.error as Error).message, 'foobar');
  });

  test('it returns loading state and then loaded state', async function (assert) {
    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise);
    assert.strictEqual(result.state, 'PENDING');

    deferred.resolve();
    await deferred.promise;

    assert.strictEqual(result.state, 'RESOLVED');
  });

  test('it returns loading state and then error state', async function (assert) {
    assert.expect(4);

    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise);
    assert.strictEqual(result.state, 'PENDING');

    deferred.reject(new Error('foobar'));
    await deferred.promise.catch((err: Error) => {
      assert.true(err instanceof Error);
      assert.strictEqual(err.message, 'foobar');
    });

    assert.strictEqual(result.state, 'REJECTED');
  });

  test('it returns loaded state for already-resolved promises', async function (assert) {
    const promise = Promise.resolve('hello');
    const result = new TrackedAsyncData(promise);
    await promise;
    assert.strictEqual(result.state, 'RESOLVED');
  });

  test('it returns error state for already-rejected promises', async function (assert) {
    assert.expect(3);

    const promise = Promise.reject(new Error('foobar'));
    const result = new TrackedAsyncData(promise);

    // This handles the error thrown *locally*.
    await promise.catch((error: Error) => {
      assert.true(error instanceof Error);
      assert.strictEqual(error.message, 'foobar');
    });

    assert.strictEqual(result.state, 'REJECTED');
  });
});
