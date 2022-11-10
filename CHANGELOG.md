# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).




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
