'use strict'

/**
 * exports.
 */

module.exports = concat

/**
 * Copy object properties from an arbitrary number of source objects into a new object.
 *
 * @param {Object} target
 * Object to assign properties to.
 *
 * @param {Object} source0..sourceN
 * Object(s) to pull properties from.
 *
 * @return {Object}
 * Modified target object.
 */

function concat (/* sources */) {
  return [].slice.call(arguments).reduce(merge, {})
}

/**
 * Merge source properties into target.
 *
 * @param {Object} target
 * Object to assign properties to.
 *
 * @param {Object} source
 * Object to pull properties from.
 *
 * @return {Object}
 * Modified target object.
 */

function merge (target, source) {
  for (var key in source) if (source[key] != null) { target[key] = source[key] }
  return target
}
