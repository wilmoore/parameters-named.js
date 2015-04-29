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
 * defaults.
 */

var DEFAULT_APP = 'awesome'
var DEFAULT_KEY = '902fc637-3c79-43e8-adf4-56dea615f7d9'
var DEFAULT_URL = 'https://api.example.com/search'

/*!
 * setup.
 */

var params = {
  app: {
    def: DEFAULT_APP,
    env: 'EXAMPLE_SEARCH_API_APP',
    req: true,
    val: validator.isAlphanumeric
  },

  key: {
    def: DEFAULT_KEY,
    env: 'EXAMPLE_SEARCH_API_KEY',
    req: true,
    val: validator.isUUID
  },

  url: {
    def: DEFAULT_URL,
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
    args: [ { app: 'parameterOverride' } ],
    expectedKey: 'app', expectedVal: 'parameterOverride'
  },

  {
    name: 'Override via env',
    args: [],
    envs: { EXAMPLE_SEARCH_API_APP: 'envOverride' },
    expectedKey: 'app', expectedVal: 'envOverride'
  },

  {
    name: 'Default value is set for app',
    args: [],
    expectedKey: 'app', expectedVal: DEFAULT_APP
  },

  {
    name: 'Default value is set for key',
    args: [],
    expectedKey: 'key', expectedVal: DEFAULT_KEY
  },

  {
    name: 'Default value is set for url',
    args: [],
    expectedKey: 'url', expectedVal: DEFAULT_URL
  },

  {
    name: 'has errors but still produces params',
    args: [{
      url: 'obviously-not-a-url'
    }],
    expectedKey: 'key', expectedVal: DEFAULT_KEY,
    errs: 1
  },

  {
    name: 'single error',
    args: [{
      url: 'obviously-not-a-url'
    }],
    errs: 1
  },

  {
    name: 'multiple errors',
    args: [{
      app: null,
      key: 'not-a-uuid',
      url: 'obviously-not-a-url'
    }],
    errs: 3
  },

  {
    name: 'undefined parameter error',
    args: [{
      not_defined_parameter: 'not defined'
    }],
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
  parameters.forEach(function (p) {
    env.set(p.envs)

    var parse = parametersNamed(params)
    var actual = parse.apply(null, p.args)

    if (p.expectedKey) {
      t.equal(actual.params[p.expectedKey], p.expectedVal, p.name + ' (.param check)')
    }

    if (p.errs) {
      t.equal(actual.errors.length, p.errs, p.name + ' (.errors check)')
    }

    resetEnvs(p.envs)
  })

  t.end()
})
