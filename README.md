# Global Config File _(`global-config-file`)_

Handles all extensions for configuration files.

## Install

```shell
$ yarn add global-config-file

# npm users
$ npm install global-config-file
```

## Usage

This package exports one function that accepts a filename and an options object.

The file provided must be the one with **no extension**.

```javascript
import globalConfigFile from "global-config-file";

const config = globalConfigFile(".examplerc");
```

### Error handling

If the option `quiet` is set to `false`, the package might throw an error if:

1. You pass an extension option that disables all the extensions.
2. No configuration file was found.

In that case you can simply handle it with a `try..catch`.

```javascript
import globalConfigFile from "global-config-file";

let config;

try {
  config = globalConfigFile(".examplerc");
} catch (error) {
  console.error(error);
}
```

Otherwise, if `quite` is on `true`, it will just return `undefined`.

### Supported extensions

The function will look for all the possible files, in the order given in the options.

So, for the `.examplerc` name, it will look for:

- `.examplerc` _(JSON and YML format are supported)_
- `.examplerc.js`
- `example.config.js` _(note that the dot and `rc` got removed)_
- `.examplerc.json`
- `.examplerc.yml`
- `.examplerc.yaml`
- `package.json` _(for a `example` property)_

## Options

| Option     | Type    | Description                                                                     | Default value                                                                                          |
| ---------- | ------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| extensions | Object  | All the file extensions that are enabled.                                       | `{empty: true, js: true, "config.js": true, json: true, yml: true, yaml: true, package: true }`        |
| errors     | Object  | The error messages thrown by the program.                                       | `{noConfigFound: "No configuration file found", noExtensions: "No extensions were found or enabled" }` |
| root       | string  | Where to look for the configuration files.                                      | `process.cwd()`                                                                                        |
| quiet      | boolean | If set to true, the program will return `undefined` instead of throwing Errors. | `false`                                                                                                |

## Mainteiners

[@alexcanessa](https://github.com/alexcanessa)

## Contributing

Feel free to dive in! [Open an issue]() or submit PRs.

On this project we follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/1/3/0/code-of-conduct/).

### Commit messages

This project follows the [Angular commit messages](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit), but it's very open to emojis 🤯.

## Licence

[MIT](https://spdx.org/licenses/MIT.html) @ Alessandro Canessa

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
