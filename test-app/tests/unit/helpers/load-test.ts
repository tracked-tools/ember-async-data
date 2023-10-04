import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { load } from 'ember-async-data/helpers/load';
import TrackedAsyncData from 'ember-async-data/tracked-async-data';
import { defer } from 'test-app/tests/defer';

// As ember-async-data is now v2 addon and bundled via webpack,
// we have separate entrypoints for the app and tests.
// As a result, 'ember-async-data/tracked-async-data' gets evaluated twice,
// and we get *another* class, not the same one the addon itself gets.
// For some background info see https://github.com/webpack/webpack/issues/7556

// We can unskip these tests once ember-auto-import gets fixed,
// so we would have single entry point for app and tests.
// Link to track status: https://github.com/ef4/ember-auto-import/issues/503
module.skip('Unit | load', function (hooks) {
  setupTest(hooks);

  test('given a promise', async function (assert) {
    const { promise, resolve } = defer();
    const result = load(promise);
    assert.ok(
      result instanceof TrackedAsyncData,
      'it returns a TrackedAsyncData instance',
    );
    resolve();
    await promise;
  });

  test('given a plain value', async function (assert) {
    const result = load(12);
    assert.ok(
      result instanceof TrackedAsyncData,
      'it returns a TrackedAsyncData instance',
    );
  });
});
