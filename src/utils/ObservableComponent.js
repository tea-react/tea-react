import React from 'react'
import _ from 'lodash'
import shallowEqual from './shallowEqual'
import Observer from './Observer.js'

const originSetState = React.Component.prototype.setState

class ObservableComponent extends React.Component {

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
    this._$props = {}
    this._$state = {}
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

  shouldComponentUpdate(nextProps, nextState) {
    let rst = true
    this._$observer.clearNotifies()
    if (this._stateHasChanged) {
      this._stateHasChanged = false
      rst = !this.isEqual(nextState, this.state)
      this._$observer.collectStateNotify(nextState)
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
      this._$observer.publish(this)
    }
    return rst
  }
}

export default ObservableComponent
