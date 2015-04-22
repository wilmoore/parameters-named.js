'use strict'

/*!
 * imports.
 */

var test = require('tape-catch')
var validator = require('validator')
var env = require('env-accessors')

/*!
 * imports (local).
 */

var parametersNamed = require('./')

/*!
 * setup.
 */

var params = {
  app: {
    def: 'awesome',
    env: 'EXAMPLE_SEARCH_API_APP',
    req: true,
    val: validator.isAlphanumeric
  },

  key: {
    def: '902fc637-3c79-43e8-adf4-56dea615f7d9',
    env: 'EXAMPLE_SEARCH_API_KEY',
    req: true,
    val: validator.isUUID
  },

  url: {
    def: 'https://api.example.com/search',
    env: 'EXAMPLE_SEARCH_API_URL',
    req: true,
    val: validator.isURL
  }
}

/*!
 * parameters.
 */

var parameters = [
  {
    name: 'Override via param',
    args: [ { app: 'parameter-override' } ],
    expectedKey: 'app', expectedVal: 'parameter-override'
  },

  {
    name: 'Override via env',
    args: [],
    envs: { EXAMPLE_SEARCH_API_APP: 'env-override' },
    expectedKey: 'app', expectedVal: 'env-override'
  },

  {
    name: 'Default value is set',
    args: [],
    expectedKey: 'key', expectedVal: '902fc637-3c79-43e8-adf4-56dea615f7d9'
  },

  {
    name: 'Type error',
    args: [ { url: 'obviously-not-a-url' } ],
    errs: 1
  }
]

/*!
 * test helpers.
 */

function resetEnvs (envs) {
  if (!envs) return
  Object.keys(envs).forEach(env.del)
}

/*!
 * tests.
 */

test('parametersNamed()', function (t) {
  t.plan(parameters.length)

  parameters.forEach(function (p) {
    env.set(p.envs)

    var parse = parametersNamed(params)
    var actual = parse.apply(null, p.args)

    if (p.expectedKey) {
      t.equal(actual.params[p.expectedKey], p.expectedVal, p.name)
    }

    if (p.errs) {
      t.equal(actual.errors.length, p.errs, p.name)
    }

    resetEnvs(p.envs)
  })
})
