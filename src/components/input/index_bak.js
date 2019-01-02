import React from 'react'
import EnhanceComponent from '../utils/EnhanceComponent.js'
import _ from 'lodash'


export default class Input extends React.Component {

    state = {
        value: ''
    }
    _value = null

    constructor(props) {
        super(props)
        this.state.value = props.value
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate', this.causedByState, this._value, nextProps.value, nextState.value)
        const prevValue = this.state.value
        if (!this.causedByState) {
            this.state.value = nextProps.value
        } else {
            this.causedByState = false
        }
        return !_.isEqual(nextProps, this.props)
            || !_.isEqual(nextState, this.state)
            || this.state.value !== prevValue
    }

    get value() {
        if (this._value === null) {
            return this.props.value
        }
        return this._value
    }
        /*
        console.log('get value', this.props, this.prevProps)
        const propsValue = _.get(this, 'props.value')
        const prevPropsValue = _.get(this, 'prevProps.value')
        if (propsValue !== prevPropsValue || propsValue !== this._prevValue) {
            this._prevValue = propsValue
        } else {
            this._prevValue = this.state.value
        }
        // return this._prevValue
        if (this.causedByState) {
            this.causedByState = false
            return this.state.value
        } else {
            return this.props.value
        }
    get props() {
        return this._props
    }
    set props(props) {
        console.log('set props', this.props === props)
        // 基类执行时state=undefined，需要跳过
        if (!this.state) {
            this.state = {}
            return
        }
        // props没有变化需要跳过
        if (this.props === props) {
            return
        }
        const preValue = this.props && this.props.value
        if (_.has(props, 'value') && (!preValue || preValue !== props.value)) {
            console.log(1111111111)
            // this.state.value = props.value
        }
        this._props = props
    }
    */

    handleChange = e => {
        const value = e && e.target && e.target.value
        this.setState({
            value,
        })
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(value, e)
        }
    }

    render() {
        console.log('render')
        return <input value={this.state.value}
            onChange={this.handleChange}
        />
    }
}
