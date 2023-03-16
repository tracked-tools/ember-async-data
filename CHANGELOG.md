# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).




## v0.6.1 (2023-03-16)

#### :bug: Bug Fix
* [#582](https://github.com/tracked-tools/ember-async-data/pull/582) Backport context bug fix to 0.6.x ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 1
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))

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
