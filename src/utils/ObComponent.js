import React from 'react'
import _ from 'lodash'
import shallowEqual from './shallowEqual'
import Observer from './Observer.js'

const originSetState = React.Component.prototype.setState

class ObComponent extends React.Component {

  _stateHasChanged = false

  constructor(props, conf) {
    super(props)
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

  _subscribe(props, state, func) {
    if (arguments.length === 2) {
      func = state
      state = []
    }
    this._$observer.subscribe(this.props, this.state, props, state, func)
  }

  _subscribeProps(props, func) {
    if (_.isString(props)) {
      props = [props]
    }
    this._$observer.subscribeProps(this.props, props, func)
  }

  _subscribeState(state, func) {
    if (_.isString(state)) {
      state = [state]
    }
    this._$observer.subscribeState(this.state, state, func)
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
}

export default ObComponent
