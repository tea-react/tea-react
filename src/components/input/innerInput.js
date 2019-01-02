import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import EnhanceComponent from 'utils/EnhanceComponent.js'
import _ from 'lodash'

export default class InnerInput extends EnhanceComponent {
  static defaultProps = {
    prefixCls: 'tim-input',
    disabled: false,
    onChange: () => {},
    onPressEnter: () => {},
    onKeyDown: () => {}
  }
  static propTypes = {
    PropTypes: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }

  $input = null
  state = {
    value: ''
  }

  constructor(props) {
    super(props)
    if (_.has(props, 'defaultValue')) {
      this.state.value = props.defaultValue
    } else {
      this.state.value = props.value || ''
    }
    if (this.state.value === null || this.state.value === undefined) {
      this.state.value = ''
    }
  }

  focus() {
    this.$input.focus()
  }

  blur() {
    this.$input.blur()
  }

  select() {
    this.$input.select()
  }

  setRef = node => {
    this.$input = node
  }

  handleChange = e => {
    const value = _.get(e, 'target.value')
    this.setState({ value })
    this.props.onChange(value, e)
  }

  handleKeyDown = e => {
    const value = _.get(e, 'target.value')
    const {
      onPressEnter,
      onKeyDown
    } = this.props
    if (e.keyCode === 13) {
      onPressEnter(value, e)
    }
    onKeyDown(value, e)
  }

  preRender() {
    const {
      prefixCls,
      disabled,
      className,
      style,
    } = this.props
    this.inputClassName = classNames(prefixCls, {
      [`${prefixCls}-disabled`]: disabled,
    }, className)
    this.inputStyle = style
    this.inputProps = _.omit(this.props, [
      'prefixCls',
      'className',
      'style',
      'value',
      'defaultValue',
      'onChange',
      'onKeyDown',
    ])
  }

  render() {
    console.log('innerInput render')
    if (!this._stateHasChanged) {
      this.preRender()
    }
    return (
      <input ref={this.setRef}
        className={this.inputClassName}
        style={this.inputStyle}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        {...this.inputProps}
      />
    )
  }
}
