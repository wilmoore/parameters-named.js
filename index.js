'use strict'

/*!
 * imports.
 */

var cat = require('object-concat')
var fmt = require('util').format
var get = require('env-accessors').get
var has = require('env-accessors').has

/*!
 * exports.
 */

module.exports = parameters

/**
 * Named parameters supporting default value, validation, and environment variables.
 *
 * @param {String} string
 * string literal.
 *
 * @return {String}
 * string literal.
 */

function parameters (spec) {
  var defs = {}
  var envs = {}

  return function (params) {
    init(spec, defs, envs)
    var opts = cat(defs, envs, params)
    var errs = []

    def(opts, spec, errs)
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
 * Initialize defaults and environment variables.
 *
 * @param {String} spec
 * Parameters definition object.
 *
 * @param {Object} defs
 * Default values container.
 *
 * @param {String} spec
 * Environment values container.
 */

function init (spec, defs, envs) {
  for (var key in spec || {}) {
    if (spec[key].def) defs[key] = spec[key].def
    if (has(spec[key].env)) envs[key] = get(spec[key].env)
  }
}

/**
 * Ensure that parameter is defined.
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

function def (params, spec, errs) {
  for (var key in params) {
    if (!spec.hasOwnProperty(key)) defError(key, errs)
  }
}

/**
 * Push a `RangeError` into `errs` list.
 *
 * @param {String} key
 * Key for which error is being created.
 *
 * @param {Array} errs
 * Errors list.
 */

function defError (key, errs) {
  errs.push(new RangeError(fmt('%s is not a valid parameter!', key)))
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
 * @param {String} key
 * Key for which error is being created.
 *
 * @param {Array} errs
 * Errors list.
 */

function reqError (key, errs) {
  errs.push(new ReferenceError(fmt('%s is required!', key)))
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
    if (key in spec && isFunction(spec[key].val) && !spec[key].val(params[key])) valError(key, errs)
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
  errs.push(new TypeError(fmt('%s is not valid!', key)))
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
