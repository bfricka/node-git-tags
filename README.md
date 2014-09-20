# Node Git Tags

Gets and parses [semver](http://semver.org/) tags using Git and Node.js

## Usage

Assuming you have the following git tags:

* `v1.0.1`
* `v1.0.0`
* `v0.1.0-beta`
* `NonSemverTag`

**Get all semver tags**
#### `gittags.get([repo], callback(err, tags))`

Argument            | Type                | Description
------------------- | ------------------- | -------------
`repo` *(optional)* | `string`            | Optional repo path. Defaults to `process.cwd()`
`callback`          | `function`          | Required callback fn
`callback(err)`     | `null \| Error`     | Error, if there is one
`callback(tags)`    | `Array.<string>`    | Array of semver tags found (e.g. `['1.0.1', '1.0.0']`)

```js
var gittags = require('git-tags');

gittags.get(function(err, tags) {
  if (err) throw err;

  console.log(tags);
  // ['1.0.1', '1.0.0', '0.1.0-beta']
});

// Also takes a repo location:
gittags.get('/foorepo', function(err, tags) {});
```

**Latest**
#### `gittags.latest([repo], callback(err, latest))`

| Name                | Type            | Description                                     |
| ------------------- | --------------- | ----------------------------------------------- |
| `repo` *(optional)* | `string`        | Optional repo path. Defaults to `process.cwd()` |
| `callback`          | `function`      | Required callback                               |
| `err`               | `null \| Error` | Error if, there is one                          |
| `latest`            | `string`        | Latest semver tag found (e.g. `'1.0.1'`)        |

```js
gittags.latest(function(err, latest) {
  console.log(latest);
  // '1.0.1'
});
```

**Oldest**
#### `gittags.oldest([repo], callback(err, oldest))`
Same as `latest` but opposite.
```js
gittags.oldest(function(err, oldest) {
  console.log(oldest);
  // '0.1.0-beta'
});
```

**Semver Parse**

Two functions relating to semver exist for convenience. `parse` is just `semver.parse`, and `mmp` which stands for "Major, Minor, Patch". If you need more semver stuff, you should [use the node-semver module](https://github.com/npm/node-semver) directly.

#### `gittags.parse(tag) -> SemVer`

| Name  | Type     | Description         |
| ----- | -------- | ------------------- |
| `tag` | `string` | Version string to parse (e.g. `'v1.0.2-beta'`). See [node-semver](https://github.com/npm/node-semver) for more info. |

#### `gittags.mmp(tag) -> formattedTag`

| Name           | Type     | Description                                      |
| -------------- | -------- | ------------------------------------------------ |
| `tag`          | `string` | Tag to format (e.g. `'v1.0.2-beta'`)             |
| `formattedTag` | `string` | Major.Minor.Patch formatted tag (e.g. `'1.0.2'`) |

```js
gittags.mmp('v1.3.10-beta.12');
// => '1.3.10'

var version = gittags.parse('v1.3.10-beta.12');
// <SemVer "1.3.10-beta.12">
version.prerelease;
// ['beta', 12]
version.compare('v1.3.10');
// -1
version.compare('v1.3.9');
// 1
// etc...
```

**Note**
Stating the obvious, this module uses the callback fashion of async handling. This makes them easy to integrate w/ promises.

**Bluebird, for example**
```js
var Q = require('bluebird');
var gittags = Q.promisifyAll(require('gittags'));

gittags.latestAsync().then(console.log);
// 1.0.1
```

I originally intended this to use `child_process.spawn` and return a stream, but I then realized these are blocking in Linux/Unix, limiting the usefulness of that. And it's Git tags so who cares?

If you want streams, you can use something like [highland.js](http://highlandjs.org/) which is awesome, BTW.

## License
MIT
