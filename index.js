'use strict'

/**
 * imports.
 */

var env = require('env-accessors')

/**
 * imports (local).
 */

var concat = require('./lib/concat')
var ensure = require('./lib/ensure')

/**
 * exports.
 */

module.exports = parametersNamed

/**
 * Named parameters supporting default value, validation, and environment variables.
 *
 * @param {String} string
 * string literal.
 *
 * @return {String}
 * string literal.
 */

function parametersNamed (spec) {
  var defs = {}
  var envs = {}

  for (var opt in spec || {}) {
    if (spec[opt].def) defs[opt] = spec[opt].def
    if (spec[opt].env) envs[opt] = env.get(spec[opt].env)
  }

  return function (params) {
    var opts = concat(defs, envs, params)
    var errs = []

    ensure.req(opts, spec, errs)
    ensure.val(opts, spec, errs)

    return {
      error: errs.length ? errs[0] : null,
      errors: errs,
      params: opts
    }
  }
}
