# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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

[v0.3.0]: https://github.com/chriskrycho/ember-async-data/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/chriskrycho/ember-async-data/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/chriskrycho/ember-async-data/compare/b1d0dbf...v0.1.0
