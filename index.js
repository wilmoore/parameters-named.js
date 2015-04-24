'use strict'

/**
 * imports.
 */

var cat = require('object-concat')
var fmt = require('util').format
var get = require('env-accessors').get
var has = require('env-accessors').has

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
    if (has(spec[opt].env)) envs[opt] = get(spec[opt].env)
  }

  return function (params) {
    var opts = cat(defs, envs, params)
    var errs = []

    req(opts, spec, errs)
    val(opts, spec, errs)

    return {
      error: errs.length ? errs[0] : null,
      errors: errs,
      params: opts
    }
  }
}

/**
 * Ensure that required keys are set.
 *
 * @param {Object} params
 * Parameters value object.
 *
 * @param {String} spec
 * Parameters definition object.
 *
 * @param {Array} errs
 * Errors list.
 */

function req (params, spec, errs) {
  for (var key in spec) {
    if (spec[key].req && !params.hasOwnProperty(key)) reqError(key, errs)
  }
}

/**
 * Push a `ReferenceError` into `errs` list.
 *
 * @param {Object} params
 * Parameters object.
 *
 * @param {String} key
 * Key for which error is being created.
 *
 * @param {Array} errs
 * Errors list.
 */

function reqError (key, errs) {
  errs.push(new ReferenceError(fmt('% is required!', key)))
}

/**
 * Ensure that validation predicates pass.
 *
 * @param {Object} params
 * Parameters value object.
 *
 * @param {String} spec
 * Parameters definition object.
 *
 * @param {Array} errs
 * Errors list.
 */

function val (params, spec, errs) {
  for (var key in params) {
    if (isFunction(spec[key].val) && !spec[key].val(params[key])) valError(key, errs)
  }
}

/**
 * Push a `TypeError` into `errs` list.
 *
 * @param {String} key
 * Key for which error is being created.
 *
 * @param {Array} errs
 * Errors list.
 */

function valError (key, errs) {
  errs.push(new TypeError(fmt('% is not valid!', key)))
}

/**
 * Whether `fn` is a function.
 *
 * @param {String} fn
 * Value that may or may not be a function.
 *
 * @param {Boolean}
 * Whether `fn` is a function.
 */

function isFunction (fn) {
  return typeof fn === 'function'
}
