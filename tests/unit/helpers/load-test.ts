import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { load } from 'ember-async-data/helpers/load';
import TrackedAsyncData from 'ember-async-data/tracked-async-data';
import { defer } from 'dummy/tests/defer';

module('Unit | load', function (hooks) {
  setupTest(hooks);

  test('given a promise', async function (assert) {
    const { promise, resolve } = defer();
    const result = load(promise, this);
    assert.ok(
      result instanceof TrackedAsyncData,
      'it returns a TrackedAsyncData instance'
    );
    resolve();
    await promise;
  });

  test('given a plain value', async function (assert) {
    const result = load(12, this);
    assert.ok(
      result instanceof TrackedAsyncData,
      'it returns a TrackedAsyncData instance'
    );
  });
});
