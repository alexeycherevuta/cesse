'use strict'
if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable()
  window.Promise = require('promise/lib/es6-extensions.js')
}
Object.assign = require('object-assign')
if (process && process.env && process.env.hasOwnProperty('WEBAPP_ENV') && process.env.WEBAPP_ENV === 'test') {
  require('raf').polyfill(global)
}
