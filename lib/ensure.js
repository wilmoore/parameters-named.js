'use strict'

/**
 * imports.
 */

var fmt = require('util').format
var isFunction = require('util').isFunction

/**
 * exports.
 */

exports.req = req
exports.val = val

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
