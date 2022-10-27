import { module, test } from "qunit";
import { defer } from "../defer";
import TrackedAsyncData from "ember-async-data/tracked-async-data";
import { settled } from "@ember/test-helpers";

module("Unit | TrackedAsyncData", function () {
  test("cannot be subclassed", function (assert) {
    // @ts-expect-error: The type is not statically subclassable, either, so
    //   this fails both at the type-checking level and dynamically at runtime.
    class Subclass extends TrackedAsyncData<unknown> {}

    assert.throws(() => new Subclass(Promise.resolve("nope"), this));
  });

  test("is initially PENDING", async function (assert) {
    assert.expect(6);
    const deferred = defer();

    const result = new TrackedAsyncData(deferred.promise, this);
    assert.equal(result.state, "PENDING");
    assert.equal(result.isPending, true);
    assert.equal(result.isResolved, false);
    assert.equal(result.isRejected, false);
    assert.equal(result.value, null);
    assert.equal(result.error, null);

    deferred.resolve();
    await deferred.promise;
  });

  test("it updates to resolved state", async function (assert) {
    assert.expect(6);

    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise, this);

    deferred.resolve("foobar");
    await settled();

    assert.equal(result.state, "RESOLVED");
    assert.equal(result.isPending, false);
    assert.equal(result.isResolved, true);
    assert.equal(result.isRejected, false);
    assert.equal(result.value, "foobar");
    assert.equal(result.error, undefined);
  });

  module("it returns resolved state for non-thenable input", function () {
    test("undefined", async function (assert) {
      assert.expect(6);

      const loadUndefined = new TrackedAsyncData(undefined, this);
      await settled();

      assert.equal(loadUndefined.state, "RESOLVED");
      assert.equal(loadUndefined.isPending, false);
      assert.equal(loadUndefined.isResolved, true);
      assert.equal(loadUndefined.isRejected, false);
      assert.equal(loadUndefined.value, undefined);
      assert.equal(loadUndefined.error, null);
    });

    test("null", async function (assert) {
      assert.expect(6);

      const loadNull = new TrackedAsyncData(null, this);
      await settled();

      assert.equal(loadNull.state, "RESOLVED");
      assert.equal(loadNull.isPending, false);
      assert.equal(loadNull.isResolved, true);
      assert.equal(loadNull.isRejected, false);
      assert.equal(loadNull.value, null);
      assert.equal(loadNull.error, null);
    });

    test("non-thenable object", async function (assert) {
      assert.expect(6);

      const notAThenableObject = { notAThenable: true };
      const loadObject = new TrackedAsyncData(notAThenableObject, this);
      await settled();

      assert.equal(loadObject.state, "RESOLVED");
      assert.equal(loadObject.isPending, false);
      assert.equal(loadObject.isResolved, true);
      assert.equal(loadObject.isRejected, false);
      assert.equal(loadObject.value, notAThenableObject);
      assert.equal(loadObject.error, null);
    });

    test("boolean: true", async function (assert) {
      assert.expect(6);

      const loadTrue = new TrackedAsyncData(true, this);
      await settled();

      assert.equal(loadTrue.state, "RESOLVED");
      assert.equal(loadTrue.isPending, false);
      assert.equal(loadTrue.isResolved, true);
      assert.equal(loadTrue.isRejected, false);
      assert.equal(loadTrue.value, true);
      assert.equal(loadTrue.error, null);
    });

    test("boolean: false", async function (assert) {
      assert.expect(6);

      const loadFalse = new TrackedAsyncData(false, this);
      await settled();

      assert.equal(loadFalse.state, "RESOLVED");
      assert.equal(loadFalse.isPending, false);
      assert.equal(loadFalse.isResolved, true);
      assert.equal(loadFalse.isRejected, false);
      assert.equal(loadFalse.value, false);
      assert.equal(loadFalse.error, null);
    });

    test("number", async function (assert) {
      assert.expect(6);

      const loadNumber = new TrackedAsyncData(5, this);
      await settled();

      assert.equal(loadNumber.state, "RESOLVED");
      assert.equal(loadNumber.isPending, false);
      assert.equal(loadNumber.isResolved, true);
      assert.equal(loadNumber.isRejected, false);
      assert.equal(loadNumber.value, 5);
      assert.equal(loadNumber.error, null);
    });

    test("string", async function (assert) {
      assert.expect(6);

      const loadString = new TrackedAsyncData("js", this);
      await settled();

      // loadString
      assert.equal(loadString.state, "RESOLVED");
      assert.equal(loadString.isPending, false);
      assert.equal(loadString.isResolved, true);
      assert.equal(loadString.isRejected, false);
      assert.equal(loadString.value, "js");
      assert.equal(loadString.error, null);
    });
  });

  test("it returns error state", async function (assert) {
    assert.expect(7);

    // This handles the error throw from rendering a rejected promise
    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise, this);

    // eslint-disable-next-line ember/no-array-prototype-extensions
    deferred.reject(new Error("foobar"));
    await deferred.promise.catch((error) => {
      assert.ok(
        error instanceof Error && error.message === "foobar",
        "thrown promise rejection"
      );
    });

    assert.equal(result.state, "REJECTED");
    assert.equal(result.isPending, false);
    assert.equal(result.isResolved, false);
    assert.equal(result.isRejected, true);
    assert.equal(result.value, undefined);
    assert.equal((result.error as Error).message, "foobar");
  });

  test("it returns loading state and then loaded state", async function (assert) {
    assert.expect(2);

    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise, this);
    assert.equal(result.state, "PENDING");

    deferred.resolve();
    await deferred.promise;

    assert.equal(result.state, "RESOLVED");
  });

  test("it returns loading state and then error state", async function (assert) {
    assert.expect(3);

    const deferred = defer();
    const result = new TrackedAsyncData(deferred.promise, this);
    assert.equal(result.state, "PENDING");

    // eslint-disable-next-line ember/no-array-prototype-extensions
    deferred.reject(new Error("foobar"));
    await deferred.promise.catch((err: unknown) => {
      assert.ok(err instanceof Error && err.message === "foobar");
    });

    assert.equal(result.state, "REJECTED");
  });

  test("it returns loaded state for already-resolved promises", async function (assert) {
    assert.expect(1);

    const promise = Promise.resolve("hello");
    const result = new TrackedAsyncData(promise, this);
    await promise;
    assert.equal(result.state, "RESOLVED");
  });

  test("it returns error state for already-rejected promises", async function (assert) {
    assert.expect(2);

    const promise = Promise.reject(new Error("foobar"));
    const result = new TrackedAsyncData(promise, this);

    // This handles the error thrown *locally*.
    await promise.catch((error: unknown) => {
      assert.equal(error instanceof Error && error.message, "foobar");
    });

    assert.equal(result.state, "REJECTED");
  });
});
