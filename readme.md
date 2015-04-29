# parameters-named
> Named parameters supporting default value, validation, and environment variables.

[![Build Status](http://img.shields.io/travis/wilmoore/parameters-named.js.svg)](https://travis-ci.org/wilmoore/parameters-named.js) [![Code Climate](https://codeclimate.com/github/wilmoore/parameters-named.js/badges/gpa.svg)](https://codeclimate.com/github/wilmoore/parameters-named.js) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

```shell
npm install parameters-named --save
```

###### npm stats

[![npm](https://img.shields.io/npm/v/parameters-named.svg)](https://www.npmjs.org/package/parameters-named) [![NPM downloads](http://img.shields.io/npm/dm/parameters-named.svg)](https://www.npmjs.org/package/parameters-named) [![Dependency Status](https://gemnasium.com/wilmoore/parameters-named.js.svg)](https://gemnasium.com/wilmoore/parameters-named.js) 

## Example

```js
var assert = require('assert')
var params = require('./')({
  app: {
    def: 'awesome',
    env: 'AWESOME_APP_NAME'
  },

  max: {
    req: true,
    env: 'AWESOME_APP_MAX',
    val: function (val) { return /\d+$/.test(val) } // must be numeric
  }
})

assert.deepEqual(params({ max: 5 }).params, {
  app: 'awesome',
  max: 5
})

process.env.AWESOME_APP_MAX = 30

assert.deepEqual(params({}).params, {
  app: 'awesome',
  max: process.env.AWESOME_APP_MAX
})
```

## Features

- Handles `options = options || {}` so you don't have to.
- Support for default parameter values.
- Support for validation.
- Support for input via environment variable.

## API

### `parameters(spec)`

###### Arguments

 * **`spec: (Object)`** parameter definition object:
     * `key (Object)` argument name:
         * `def` default value.
         * `env` environment variable name.
         * `req` whether required
         * `val` validation predicate function (must return `Boolean` value).

## Reference

- [Named parameter](http://en.wikipedia.org/wiki/Named_parameter)
- [Named parameters](http://rosettacode.org/wiki/Named_parameters)

## Alternatives

- [named-parameters](https://www.npmjs.com/package/named-parameters)
- [kwargs](https://www.npmjs.com/package/kwargs)
- [named-args](https://www.npmjs.com/package/named-args)
- [hashargs](https://www.npmjs.com/package/hashargs)
- [byname](https://www.npmjs.com/package/byname)

## Licenses

[![GitHub license](https://img.shields.io/github/license/wilmoore/parameters-named.js.svg)](https://github.com/wilmoore/parameters-named.js/blob/master/license)
