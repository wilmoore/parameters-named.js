'use strict'

/*!
 * imports.
 */

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

/*!
 * assertions.
 */

assert.deepEqual(params({ max: 5 }).params, {
  app: 'awesome',
  max: 5
})

assert.equal(params({ yunodefined: true, max: 5 }).error.name, 'RangeError')
assert.equal(params({ max: 'why u no provide numeric?' }).error.name, 'TypeError')
assert.equal(params({}).error.name, 'ReferenceError')

process.env.AWESOME_APP_MAX = 30
assert.deepEqual(params({}).params, {
  app: 'awesome',
  max: process.env.AWESOME_APP_MAX
})
