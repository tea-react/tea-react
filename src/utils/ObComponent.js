import React from 'react'
import _ from 'lodash'
import shallowEqual from './shallowEqual'
import Observer from './Observer.js'

function transformKeys(target) {
  const rst = {
    props: [],
    state: [],
    rest: [],
  }
  _.forEach(target, item => {
    if (_.isString(item)) {
      const attrs = item.split('.')
      if (attrs[1]) {
        if (attrs[0] === 'props') {
          rst.props.push(attrs[1])
        } else if (attrs[0] === 'state') {
          rst.state.push(attrs[1])
        }
      } else {
        rst.rest.push(item)
      }
    }
  })
  return rst
}

const originSetState = React.Component.prototype.setState

class ObComponent extends React.Component {

  _stateHasChanged = false

  constructor(props, context, updater, conf) {
    super(props, context, updater)
    this.isEqual = shallowEqual
    if (conf) {
      if (_.isFunction(conf.customEqual)) {
        this.isEqual = conf.customEqual
      }
    }
    this._$observer = new Observer({
      isEqual: this.isEqual
    })
  }

  setState(...args) {
    this._stateHasChanged = true
    originSetState.apply(this, args)
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (_.isFunction(this._shouldComponentUpdate) &&
      this._shouldComponentUpdate(nextProps, nextState, nextContext) === false) {
      return false
    }
    let rst = true
    this._$observer.clearNotifies()
    if (this._stateHasChanged) {
      this._stateHasChanged = false
      rst = !this.isEqual(nextState, this.state)
      this._$observer.collectStateNotifies(nextState)
    } else {
      const propsHasChanged = !this.isEqual(nextProps, this.props)
      rst = propsHasChanged
      if (_.has(this.state, 'value') && _.has(nextProps, 'value')) {
        const prevValue = this.state.value
        this.state.value = nextProps.value
        rst = propsHasChanged ||
          this.state.value !== prevValue
      }
      this._$observer.collectPropsNotifies(nextProps)
    }
    if (rst) {
      // NOTE:
      // shouldComponentUpdate执行后才会赋值props,state,context等
      // 但publish执行时shouldComponentUpdate并没有执行完
      // 为了数据一致性，需要手动赋值
      // 参考源码 react/packages/react-test-renderer/src/ReactShallowRenderer.js :302
      //
      const prevProps = this.props  // react内部保证了props每次都是新的对象
      const prevState = { ...this.state } // react内部对state并没有使用新对象
      const prevContext = { ...this.context }
      this.props = nextProps
      this.state = nextState
      this.context = nextContext
      this._$observer.publish(this, prevProps, prevState, prevContext)
    }
    return rst
  }

  watch(targets) {
    // Object usage multi
    // {
    //    'props.xxx': () => {}
    //    'props.yyy': () => {}
    // }
    // or single
    // {
    //    subscribe: [],
    //    handler: () => {}
    // }
    if (!_.isArray(targets)) {
      const keys = _.keys(targets)
      if (keys.indexOf('handler') !== -1
        && keys.indexOf('subscribe') !== -1) {
        targets = [targets]
      } else {
        targets = _.map(targets, (handler, subscribe) => {
          return {
            subscribe,
            handler,
            immediate: true
          }
        })
      }
    }
    try {
      let immediate = false
      _.forEach(targets, target => {
        if (!_.isPlainObject(target)) {
          throw new Error('watch target should be type of Object')
        }
        // simple usage
        // [{'props.xxx': () => {}}]
        //
        // full usage
        // [{'props.xxx': {
        //    handler: () => {}
        //    immediate: false // default true
        // }}]
        const keys = _.keys(target)
        if (keys.length === 1
          && keys[0] !== 'handler'
          && keys[0] !== 'subscribe'
          && keys[0] !== 'immediate'
        ) {
          const key = keys[0]
          let rest = target[key]
          if (_.isFunction(rest)) {
            rest = {
              handler: target[key],
              immediate: true
            }
          } else if (!_.isPlainObject(target[key])) {
            throw new Error('watch target.value type should be one of Function or Object')
          }
          target = {
            subscribe: [key],
            ...rest
          }
        } else if (keys.indexOf('handler') === -1
          || keys.indexOf('subscribe') === -1) {
          throw new Error('watch target should has subscribe and handler attr')
        }
        // [{
        //    subscribe: ['props.xxx', 'state.yyy'],
        //    handler: () => {},
        //    immediate: false // default true
        // }]
        if (_.isString(target.subscribe)) {
          target.subscribe = [target.subscribe]
        }
        if (!_.isArray(target.subscribe)) {
          throw new Error('watch target.subscribe should be type of Array')
        }
        if (!_.isFunction(target.handler)) {
          throw new Error('watch target.handler should be type of Function')
        }
        const { props, state } = transformKeys(target.subscribe)
        this._subscribe(props, state, target.handler, target.immediate)
        if (target.immediate !== false) {
          immediate = true
        }
      })
      if (immediate) {
        this._$observer.publish(this, this.props, this.state, this.context)
      }
    } catch(e) {

    }
  }

  _subscribe(props, state, func, immediate) {
    if (arguments.length === 3) {
      func = state
      state = []
    }
    this._$observer.subscribe(this.props, this.state, props, state, func, immediate)
  }

  _subscribeProps(props, func, immediate) {
    if (_.isString(props)) {
      props = [props]
    }
    this._$observer.subscribeProps(this.props, props, func, immediate)
  }

  _subscribeState(state, func, immediate) {
    if (_.isString(state)) {
      state = [state]
    }
    this._$observer.subscribeState(this.state, state, func, immediate)
  }

}

React.ObComponent = ObComponent
export default React
