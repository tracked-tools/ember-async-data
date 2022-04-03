import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, waitFor, type TestContext } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import { defer } from "../../defer";

interface LocalTestContext extends TestContext {
  promise: Promise<unknown>;
}

module("Integration | Helper | load", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders loading state", async function (this: LocalTestContext, assert) {
    assert.expect(1);

    const { promise, resolve } = defer();
    this.set("promise", promise);

    const renderPromise = render(hbs`
      <div data-test-load-helper>
        {{#let (load this.promise) as |result|}}
          {{#if result.isResolved}}
            RESOLVED {{result.value}}
          {{else if result.isPending}}
            PENDING
          {{else if result.isRejected}}
            REJECTED
          {{/if}}
        {{/let}}
      </div>
    `);

    await waitFor("[data-test-load-helper]");

    assert.dom("[data-test-load-helper]").hasText("PENDING");

    resolve();
    await renderPromise;
  });

  test("it renders loaded state", async function (this: LocalTestContext, assert) {
    assert.expect(2);

    const deferred = defer();
    deferred.resolve("foobar");
    await deferred.promise;
    this.set("promise", deferred.promise);

    const renderPromise = render(hbs`
      <div data-test-load-helper>
        {{#let (load this.promise) as |result|}}
          {{#if result.isResolved}}
            RESOLVED {{result.value}}
          {{else if result.isPending}}
            PENDING
          {{else if result.isRejected}}
            REJECTED
          {{/if}}
        {{/let}}
      </div>
    `);

    await waitFor("[data-test-load-helper]");
    assert.dom("[data-test-load-helper]").containsText("RESOLVED");
    assert.dom("[data-test-load-helper]").containsText("foobar");

    await renderPromise;
  });

  test("it renders error state", async function (this: LocalTestContext, assert) {
    assert.expect(2);

    const { promise, reject } = defer();

    // This handles the error throw from rendering a rejected promise
    promise.catch((error: unknown) => {
      assert.ok(error instanceof Error && error.message === "foobar");
    });

    reject(new Error("foobar"));
    this.set("promise", promise);

    const renderPromise = render(hbs`
      <div data-test-load-helper>
        {{#let (load this.promise) as |result|}}
          {{#if result.isResolved}}
            RESOLVED {{result.value}}
          {{else if result.isPending}}
            PENDING
          {{else if result.isRejected}}
            REJECTED
          {{/if}}
        {{/let}}
      </div>
    `);

    await waitFor("[data-test-load-helper]");
    assert.dom("[data-test-load-helper]").hasText("REJECTED");

    await renderPromise;
  });

  test("it renders loading state and then loaded state", async function (this: LocalTestContext, assert) {
    assert.expect(2);

    const { promise, resolve } = defer();
    this.set("promise", promise);

    const renderPromise = render(hbs`
      <div data-test-load-helper>
        {{#let (load this.promise) as |result|}}
          {{#if result.isResolved}}
            <div data-test-state="RESOLVED">RESOLVED {{result.value}}</div>
          {{else if result.isPending}}
            <div data-test-state="PENDING">PENDING</div>
          {{else if result.isRejected}}
            <div data-test-state="REJECTED">REJECTED</div>
          {{/if}}
        {{/let}}
      </div>
    `);

    await waitFor("[data-test-load-helper]");
    assert.dom("[data-test-load-helper]").hasText("PENDING");

    resolve();

    await waitFor("[data-test-state='RESOLVED']");
    assert.dom("[data-test-load-helper]").hasText("RESOLVED");

    await renderPromise;
  });

  test("it renders loading state and then error state", async function (this: LocalTestContext, assert) {
    assert.expect(3);

    const { promise, reject } = defer();
    this.set("promise", promise);

    const renderPromise = render(hbs`
      <div data-test-load-helper>
        {{#let (load this.promise) as |result|}}
          {{#if result.isResolved}}
            <div data-test-state="RESOLVED">RESOLVED {{result.value}}</div>
          {{else if result.isPending}}
            <div data-test-state="PENDING">PENDING</div>
          {{else if result.isRejected}}
            <div data-test-state="REJECTED">REJECTED</div>
          {{/if}}
        {{/let}}
      </div>
    `);

    await waitFor("[data-test-load-helper]");
    assert.dom("[data-test-load-helper]").hasText("PENDING");

    reject(new Error("foobar"));

    // This handles the error thrown at the top level
    await promise.catch(() => {
      assert.ok(true, "things are neat!");
    });

    await waitFor("[data-test-state='REJECTED']");
    assert.dom("[data-test-load-helper]").hasText("REJECTED", "rejected");

    await renderPromise;
  });

  test("it renders the state for the new promise if a new promise is sent and resolves before the old promise is done loading", async function (this: LocalTestContext, assert) {
    assert.expect(3);

    const { promise: oldPromise, reject: rejectOld } = defer();
    this.set("promise", oldPromise);

    // This handles the error throw from rendering a rejected promise
    oldPromise.catch((error) => {
      assert.ok(error instanceof Error && error.message, "foobar");
    });

    const renderPromise = render(hbs`
      <div data-test-load-helper>
        {{#let (load this.promise) as |result|}}
            {{#if result.isResolved}}
              <div data-test-state="RESOLVED">RESOLVED {{result.value}}</div>
            {{else if result.isPending}}
              <div data-test-state="PENDING">PENDING</div>
            {{else if result.isRejected}}
              <div data-test-state="REJECTED">REJECTED</div>
            {{/if}}
          {{/let}}
        </div>
      `);

    await waitFor("[data-test-load-helper]");
    assert.dom("[data-test-load-helper]").hasText("PENDING");

    const { promise: newPromise, resolve: resolveNew } = defer();
    this.set("promise", newPromise);

    resolveNew();
    await newPromise;
    rejectOld(new Error("foobar"));

    await waitFor('[data-test-state="RESOLVED"]');
    assert.dom("[data-test-load-helper]").hasText("RESOLVED");

    await renderPromise;
  });

  test("it renders the state and value for the new promise if a new promise with a different value is sent before the old promise is done loading", async function (this: LocalTestContext, assert) {
    assert.expect(3);

    const { promise: oldPromise, resolve: resolveOld } = defer();
    this.set("promise", oldPromise);

    const renderPromise = render(hbs`
        <div data-test-load-helper>
          {{#let (load this.promise) as |result|}}
            {{#if result.isResolved}}
              <div data-test-state="RESOLVED">RESOLVED {{result.value}}</div>
            {{else if result.isPending}}
              <div data-test-state="PENDING">PENDING</div>
            {{else if result.isRejected}}
              <div data-test-state="REJECTED">REJECTED</div>
            {{/if}}
          {{/let}}
        </div>
      `);

    await waitFor("[data-test-load-helper]");
    assert.dom("[data-test-load-helper]").hasText("PENDING");

    const { promise: newPromise, resolve: resolveNew } = defer();
    this.set("promise", newPromise);

    resolveNew("New");
    await newPromise;
    resolveOld("Old");
    await oldPromise;

    await waitFor('[data-test-state="RESOLVED"]');
    assert.dom("[data-test-load-helper]").containsText("RESOLVED");
    assert.dom("[data-test-load-helper]").containsText("New");

    await renderPromise;
  });

  test("it renders error state and then loading state for a retried promise", async function (this: LocalTestContext, assert) {
    assert.expect(3);

    const deferred = defer();
    this.set("promise", deferred.promise);

    // This handles the error throw from rendering a rejected promise
    deferred.promise.catch((error: unknown) => {
      assert.equal(error instanceof Error && error.message, "foobar");
    });

    deferred.reject(new Error("foobar"));

    const renderPromise = render(hbs`
        <div data-test-load-helper>
          {{#let (load this.promise) as |result|}}
            {{#if result.isResolved}}
              <div data-test-state="RESOLVED">RESOLVED {{result.value}}</div>
            {{else if result.isPending}}
              <div data-test-state="PENDING">PENDING</div>
            {{else if result.isRejected}}
              <div data-test-state="REJECTED">REJECTED</div>
            {{/if}}
          {{/let}}
        </div>
      `);

    await waitFor("[data-test-load-helper]");
    assert.dom("[data-test-load-helper]").hasText("REJECTED");

    const retryDeferred = defer();
    this.set("promise", retryDeferred.promise);

    await waitFor('[data-test-state="PENDING"]');
    assert.dom("[data-test-load-helper]").hasText("PENDING");

    retryDeferred.resolve();
    await retryDeferred.promise;
    await renderPromise;
  });
});
