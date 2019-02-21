import _ from 'lodash'
import shallowEqual from './shallowEqual.js'

class Observer {

  constructor(conf) {
    this.isEqual = shallowEqual
    if (conf) {
      if (_.isFunction(conf.isEqual)) {
        this.isEqual = conf.isEqual
      }
    }

    this.notify = null
    this.uid = 0
    this.watcherMap = new Map()
    this._props = {}
    this._state = {}
  }

  defineReactive(obj, key, val, notify, immediate = true) {
    if (!_.isFunction(notify)) {
      throw new Error('observer.depend call is required before defineProperty')
    }
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    const getter = property && property.get
    const setter = property && property.set
    // if ((!getter || setter) && arguments.length === 2) {
    //   val = obj[key]
    // }

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        const value = getter ? getter.call(obj) : val
        return value
      },
      set: (newVal) => {
        const value = getter ? getter.call(obj) : val
        if (this.isEqual(newVal, value)) {
          return
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) {
          return
        }
        if (setter) {
          setter.call(obj, newVal)
        } else {
          val = newVal
        }
        notify()
      }
    })
    if (immediate) {
      notify()
    }
  }

  depend(func) {
    if (this.notify === null) {
      this.uid += 1
      const uid = this.uid
      this.notify = () => {
        if (!this.watcherMap.has(uid)) {
          this.watcherMap.set(uid, func)
        }
      }
    }
  }

  unDepend() {
    this.notify = null
  }

  subscribe(props, state, propKeys, stateKeys, func, immediate) {
    this.depend(func)
    this.subscribeProps(props, propKeys, func, immediate)
    this.subscribeState(state, stateKeys, func, immediate)
  }

  subscribeProps(props, propKeys, func, immediate) {
    this.depend(func)
    _.forEach(propKeys, key => {
      this.defineReactive(this._props, key, props[key], this.notify, immediate)
    })
    this.unDepend()
  }

  subscribeState(state, stateKeys, func, immediate) {
    this.depend(func)
    _.forEach(stateKeys, key => {
      this.defineReactive(this._state, key, state[key], this.notify, immediate)
    })
    this.unDepend()
  }

  publish(...args) {
    _.forEach([...this.watcherMap.values()], func => {
      func.apply(args)
    })
    this.watcherMap.clear()
  }

  clearNotifies() {
    this.watcherMap.clear()
  }

  collectNotifies(props, state) {
    this.collectPropsNotifies(props)
    this.collectStateNotifies(state)
  }

  collectPropsNotifies(props) {
    _.forEach(props, (value, key) => {
      this._props[key] = value
    })
  }

  collectStateNotifies(state) {
    _.forEach(state, (value, key) => {
      this._state[key] = value
    })
  }
}

export default Observer
