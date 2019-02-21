import _ from 'lodash'
import {
  _$type,
  TEA_FORM,
} from 'utils/symbol'
import debug from 'utils/debug.js'

const log = debug('Form Component')


class Form {

  [_$type] = TEA_FORM
  items = {}

  constructor(options) {

  }

  pushItem(name, item) {
    if (!this.items[name]) {
      this.items[name] = item
    } else if (this.items[name] !== item) {
      log.warn(`duplicate FormItem(name = ${name}) in Form`)
    }
  }

  popItem(name, item) {
    if (this.items[name] && this.items[name] === item) {
      delete this.items[name]
    }
  }

  submit(func) {
    return Promise.all(_.map(this.items, item => {
      return item.validate(this.validator)
    })).then(data => {
      rst = _.reduce(data, (acc, item) => {
        acc.valid = item.valid && acc.valid
        acc.message[item.name] = item.message
        acc.value[item.name] = item.value
        if (item.hasChange) {
          acc.changed[item.name] = true
        }
        return acc
      }, {
        valid: true,
        message: {},
        changed: {},
        value: {}
      })
      if (_.isFunction(func)) {
        func(rst)
      }
      return rst
    })
  }

  reset() {
    _.forEach(this.items, item => {
      item.reset()
    })
  }

  memorize() {
    _.forEach(this.items, item => {
      item.memorize()
    })
  }

  getValue() {
    return _.reduce(this.items, (acc, item, name) => {
      acc[name] = item.getValue()
      return acc
    }, {})
  }

}

function registerValidator(validator) {
  if (!_.isFunction(validator)) {
    log.warn('validator should be function')
    return
  }
  Form.prototype.validator = validator
}

function createInstance() {

}
