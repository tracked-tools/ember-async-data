# Changelog

## Release (2025-05-12)

* ember-async-data 2.0.1 (patch)

#### :bug: Bug Fix
* `ember-async-data`
  * [#854](https://github.com/tracked-tools/ember-async-data/pull/854) Remove unneeded peer dependency declaration ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* [#821](https://github.com/tracked-tools/ember-async-data/pull/821) Update TypeScript support badge ([@SergeAstapov](https://github.com/SergeAstapov))

#### :house: Internal
* `ember-async-data`
  * [#855](https://github.com/tracked-tools/ember-async-data/pull/855) chore(deps-dev): bump pnpm from 10.6.3 to 10.10.0 ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#834](https://github.com/tracked-tools/ember-async-data/pull/834) Bump release-plan from v0.13 to v0.16 ([@SergeAstapov](https://github.com/SergeAstapov))
* Other
  * [#829](https://github.com/tracked-tools/ember-async-data/pull/829) Update Nightly TypeScript run job ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 2
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-03-02)

ember-async-data 2.0.0 (major)

#### :boom: Breaking Change
* `ember-async-data`, `test-app`
  * [#819](https://github.com/tracked-tools/ember-async-data/pull/819) Throw an error when accessing `.value` or `.error` unsafely ([@SergeAstapov](https://github.com/SergeAstapov))
* `ember-async-data`
  * [#818](https://github.com/tracked-tools/ember-async-data/pull/818) Drop @dependentKeyCompat from addon ([@SergeAstapov](https://github.com/SergeAstapov))
* Other
  * [#816](https://github.com/tracked-tools/ember-async-data/pull/816) Drop support for TypeScript < 5.5 ([@SergeAstapov](https://github.com/SergeAstapov))

#### :rocket: Enhancement
* `ember-async-data`
  * [#814](https://github.com/tracked-tools/ember-async-data/pull/814) Expand @ember/test-waiters dependency range to allow v4 ([@SergeAstapov](https://github.com/SergeAstapov))

#### :memo: Documentation
* `ember-async-data`, `test-app`
  * [#820](https://github.com/tracked-tools/ember-async-data/pull/820) Update documentation and tests to use template tag ([@SergeAstapov](https://github.com/SergeAstapov))
* Other
  * [#773](https://github.com/tracked-tools/ember-async-data/pull/773) Fix Loader Example ([@devotox](https://github.com/devotox))

#### :house: Internal
* `ember-async-data`, `test-app`
  * [#815](https://github.com/tracked-tools/ember-async-data/pull/815) Sync addon with latest addon-blueprint ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#809](https://github.com/tracked-tools/ember-async-data/pull/809) Switch from yarn to pnpm ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#715](https://github.com/tracked-tools/ember-async-data/pull/715) Add TypeScript 5.1 and 5.2 to support matrix ([@SergeAstapov](https://github.com/SergeAstapov))
* `ember-async-data`
  * [#813](https://github.com/tracked-tools/ember-async-data/pull/813) Replace release-it with release-plan ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#806](https://github.com/tracked-tools/ember-async-data/pull/806) chore(deps-dev): Bump actions/checkout from v3 to v4 ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#735](https://github.com/tracked-tools/ember-async-data/pull/735) Bump prettier and eslint-plugin-prettier ([@nlfurniss](https://github.com/nlfurniss))
* Other
  * [#812](https://github.com/tracked-tools/ember-async-data/pull/812) Update TypeScript testing matrix to include >=5.0 ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#810](https://github.com/tracked-tools/ember-async-data/pull/810) Print tsc version to ensure proper TypeScript version usage ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#736](https://github.com/tracked-tools/ember-async-data/pull/736) Bump browserlist ([@nlfurniss](https://github.com/nlfurniss))
* `test-app`
  * [#808](https://github.com/tracked-tools/ember-async-data/pull/808) Bump ember-cli from 5.7 to 5.12 ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 3
- Devonte ([@devotox](https://github.com/devotox))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).







## v1.0.3 (2023-10-01)

#### :bug: Bug Fix
* [#704](https://github.com/tracked-tools/ember-async-data/pull/704) Fix triple-slash reference in complied output, breaking TS consumers ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* [#707](https://github.com/tracked-tools/ember-async-data/pull/707) Update minimum supported Ember.js version in README.md ([@SergeAstapov](https://github.com/SergeAstapov))
* [#693](https://github.com/tracked-tools/ember-async-data/pull/693) Update repository field in package.json ([@SergeAstapov](https://github.com/SergeAstapov))

#### :house: Internal
* [#681](https://github.com/tracked-tools/ember-async-data/pull/681) Replace publish-unstable workflow with push-dist ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 2
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.0.2 (2023-08-02)

#### :rocket: Enhancement
* [#625](https://github.com/tracked-tools/ember-async-data/pull/625) Add ember v5 to peerDependencies ([@SergeAstapov](https://github.com/SergeAstapov))

#### :memo: Documentation
* [#666](https://github.com/tracked-tools/ember-async-data/pull/666) Add brackets for test selector ([@jrjohnson](https://github.com/jrjohnson))

#### :house: Internal
* [#679](https://github.com/tracked-tools/ember-async-data/pull/679) Sync with embroider-addon blueprint ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 2
- Jon Johnson ([@jrjohnson](https://github.com/jrjohnson))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))


## v1.0.1 (2023-03-15)

**Note:** This is a significant bug fix which *does* (very mildly) break the public API, but necessarily so for the sake of fixing a bug.

#### :bug: Bug Fix
* [#578](https://github.com/tracked-tools/ember-async-data/pull/578) Bugfix: drop `context` and stop caching `TrackedAsyncData` ([@chriskrycho](https://github.com/chriskrycho))

    Previously, `TrackedAsyncData` and the `load` function accepted a `context` parameter as their second argument, to use with Ember's destroyables API. However, that was (a) unnecessary and (b) could actually cause memory leaks, literally the opposite of what it was designed to do. To account for this change, simply remove that call from all call sites.

    Additionally, note that this means that you will no longer get a single instance of `TrackedAsyncData` for the same promise. In most cases, this is irrelevant, and it is likely that removing our cache which attempted to be helpful that way will *improve* your performance.

#### Committers: 1
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))

## v1.0.0 (2023-03-15)

#### :boom: Breaking Change
* [#527](https://github.com/tracked-tools/ember-async-data/pull/527) Drop TypeScript support for <= 4.7 ([@SergeAstapov](https://github.com/SergeAstapov))
* [#575](https://github.com/tracked-tools/ember-async-data/pull/575) Add hard error and deprecations for 1.0 ([@chriskrycho](https://github.com/chriskrycho))
* [#473](https://github.com/tracked-tools/ember-async-data/pull/473) Use the types published from Ember itself; require Ember.js v4.8.4 or above ([@chriskrycho](https://github.com/chriskrycho))

#### :rocket: Enhancement
* [#575](https://github.com/tracked-tools/ember-async-data/pull/575) Add hard error and deprecations for 1.0 ([@chriskrycho](https://github.com/chriskrycho))
* [#473](https://github.com/tracked-tools/ember-async-data/pull/473) Use the types published from Ember itself ([@chriskrycho](https://github.com/chriskrycho))

#### :memo: Documentation
* [#546](https://github.com/tracked-tools/ember-async-data/pull/546) Fix wrong Readme example ([@simonihmig](https://github.com/simonihmig))
* [#545](https://github.com/tracked-tools/ember-async-data/pull/545) Fix reference to non-existing `TrackedPromise` in Readme ([@simonihmig](https://github.com/simonihmig))
* [#528](https://github.com/tracked-tools/ember-async-data/pull/528) Fix typo in docs ([@SergeAstapov](https://github.com/SergeAstapov))
* [#508](https://github.com/tracked-tools/ember-async-data/pull/508) Replace /endif with /if ([@kennstenicht](https://github.com/kennstenicht))
* [#456](https://github.com/tracked-tools/ember-async-data/pull/456) Update links in README.md after migration to tracked-tools org ([@SergeAstapov](https://github.com/SergeAstapov))
* [#404](https://github.com/tracked-tools/ember-async-data/pull/404) Add Glint usage docs ([@SergeAstapov](https://github.com/SergeAstapov))
* [#407](https://github.com/tracked-tools/ember-async-data/pull/407) Add note about TypeScript 4.9 support ([@SergeAstapov](https://github.com/SergeAstapov))
* [#406](https://github.com/tracked-tools/ember-async-data/pull/406) Minor tweaks in README.md ([@SergeAstapov](https://github.com/SergeAstapov))

#### :house: Internal
* [#576](https://github.com/tracked-tools/ember-async-data/pull/576) Use `16 || >= 18` in test app engines ([@chriskrycho](https://github.com/chriskrycho))
* [#572](https://github.com/tracked-tools/ember-async-data/pull/572) [BREAKING] Drop support for non-active versions of Node ([@nlfurniss](https://github.com/nlfurniss))
* [#547](https://github.com/tracked-tools/ember-async-data/pull/547) Disable publish-unstable workflow ([@SergeAstapov](https://github.com/SergeAstapov))
* [#474](https://github.com/tracked-tools/ember-async-data/pull/474) Skip publish-unstable for dependabot PRs ([@SergeAstapov](https://github.com/SergeAstapov))
* [#401](https://github.com/tracked-tools/ember-async-data/pull/401) add publish-unstable workflow ([@SergeAstapov](https://github.com/SergeAstapov))
* [#397](https://github.com/tracked-tools/ember-async-data/pull/397) update v2 addon setup ([@SergeAstapov](https://github.com/SergeAstapov))
* [#396](https://github.com/tracked-tools/ember-async-data/pull/396) Remove eslint-plugin-qunit from addon .eslintrc.js ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 5
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))
- Christoph Wiedenmann ([@kennstenicht](https://github.com/kennstenicht))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v0.7.0 (2022-11-10)

#### :boom: Breaking Change
* [#384](https://github.com/chriskrycho/ember-async-data/pull/384) convert addon to v2 format ([@SergeAstapov](https://github.com/SergeAstapov))
* [#300](https://github.com/chriskrycho/ember-async-data/pull/300) Set minimum Ember version to 3.28 ([@chriskrycho](https://github.com/chriskrycho))
* [#301](https://github.com/chriskrycho/ember-async-data/pull/301) Require Node 14, support Node 16 and 18 ([@chriskrycho](https://github.com/chriskrycho))
* [#298](https://github.com/chriskrycho/ember-async-data/pull/298) Set minimum TS version to 4.5, use Ember v4 types ([@chriskrycho](https://github.com/chriskrycho))

#### :rocket: Enhancement
* [#301](https://github.com/chriskrycho/ember-async-data/pull/301) Require Node 14, support Node 16 and 18 ([@chriskrycho](https://github.com/chriskrycho))
* [#299](https://github.com/chriskrycho/ember-async-data/pull/299) Add support for TS 4.6 and 4.7 ([@chriskrycho](https://github.com/chriskrycho))
* [#213](https://github.com/chriskrycho/ember-async-data/pull/213) Add support for TS 4.5 ([@chriskrycho](https://github.com/chriskrycho))

#### :bug: Bug Fix
* [#183](https://github.com/chriskrycho/ember-async-data/pull/183) Fix `paths` location in type tests tsconfig.json ([@chriskrycho](https://github.com/chriskrycho))

#### :memo: Documentation
* [#359](https://github.com/chriskrycho/ember-async-data/pull/359) update hbs import from ember-cli-htmlbars ([@SergeAstapov](https://github.com/SergeAstapov))
* [#213](https://github.com/chriskrycho/ember-async-data/pull/213) Add support for TS 4.5 ([@chriskrycho](https://github.com/chriskrycho))
* [#153](https://github.com/chriskrycho/ember-async-data/pull/153) Docs: improve and fix issues in the README ([@chriskrycho](https://github.com/chriskrycho))

#### :house: Internal
* [#382](https://github.com/chriskrycho/ember-async-data/pull/382) convert to monorepo ([@SergeAstapov](https://github.com/SergeAstapov))
* [#364](https://github.com/chriskrycho/ember-async-data/pull/364) run `npx ember-cli-update --to=4.8.0` to align with the latest blueprint ([@SergeAstapov](https://github.com/SergeAstapov))
* [#380](https://github.com/chriskrycho/ember-async-data/pull/380) Update prettier setup per latest addon blueprint ([@SergeAstapov](https://github.com/SergeAstapov))
* [#243](https://github.com/chriskrycho/ember-async-data/pull/243) Use `finally` for `waiter.endAsync` ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 3
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## v0.6.0 (2021-09-04)

#### :boom: Breaking Change
* [#152](https://github.com/chriskrycho/ember-async-data/pull/152) Breaking: drop support for versions of Ember before 3.24 LTS ([@chriskrycho](https://github.com/chriskrycho))
* [#149](https://github.com/chriskrycho/ember-async-data/pull/149) Breaking: require destroyable context ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 1
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))

## v0.5.1 (2021-09-04)

#### :house: Internal
* [#71](https://github.com/chriskrycho/ember-async-data/pull/71) Configure release-it for future releases ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 2
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))

## [v0.5.0] (2021-06-01)

### Added :star:

- Add support for [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html) (#63)
- Add re-exports from the index (#70): you can now `import { TrackedAsyncData, load } from 'ember-async-data';

### Docs 📖

- Add a section on testing (#69)

## [v0.4.0] (2021-05-13)

### Fixed :hammer_and_wrench:

`@ember/test-waiters` is now a direct dependency as it's used by app code.

## [v0.3.0] (2021-04-12)

### Added :star:

Following on from 0.2.0's support for narrowing with `.isPending`, `.isResolved`, and `.isRejected`, `TrackedAsyncData` instances cab now be "narrowed" by checking the `.state` property ([#6]):

```ts
import TrackedAsyncData from 'ember-async-data/tracked-async-data';

let data = new TrackedAsyncData(Promise.resolve('string'));
switch (data.state) {
  case 'PENDING';
    data.value; // null (and a warning for accessing in an invalid state!)
    data.error; // null (and a warning for accessing in an invalid state!)
    break;
  case 'RESOLVED':
    data.value; // string
    data.error; // null (and a warning for accessing in an invalid state!)
    break;
  case 'REJECTED':
    data.value; // null (and a warning for accessing in an invalid state!)
    data.error; // unknown
    break;
  default:
    break;
}
```

### Fixed :hammer_and_wrench:

Decorated `.state` with `@dependentKeyCompat` so it can be used as a dependent key with classic computed properties.

[#6]: https://github.com/chriskrycho/ember-async-data/pull/6

## [v0.2.0] (2021-03-27)

This is a wholly backwards-compatible change, which just adds one new feature and improves some docs.

### Added :star:

`TrackedAsyncData` now has the ability to use TypeScript’s type-narrowing functionality via the `.isPending`, `.isResolved`, and `.isRejected` ([#2]) checks:

```ts
import TrackedAsyncData from 'ember-async-data/tracked-async-data';

let data = new TrackedAsyncData(Promise.resolve('string'));
if (data.isPending) {
  data.value; // null (and a warning for accessing in an invalid state!)
  data.error; // null (and a warning for accessing in an invalid state!)
} else if (data.isResolved) {
  data.value; // string
  data.error; // null (and a warning for accessing in an invalid state!)
} else if (data.isRejected) {
  data.value; // null (and a warning for accessing in an invalid state!)
  data.error; // unknown
}
```

(Remember that the `null` fallbacks for `.value` and `.error` will be removed in a future version which drops support for Ember Classic computed properties.)

[#2]: https://github.com/chriskrycho/ember-async-data/pull/2

## [v0.1.0] (2021-03-18)

Initial release, with `TrackedAsyncData` and a `load` helper!

[v0.5.0]: https://github.com/chriskrycho/ember-async-data/compare/v0.4.0...v0.5.0
[v0.4.0]: https://github.com/chriskrycho/ember-async-data/compare/v0.3.0...v0.4.0
[v0.3.0]: https://github.com/chriskrycho/ember-async-data/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/chriskrycho/ember-async-data/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/chriskrycho/ember-async-data/compare/b1d0dbf...v0.1.0
