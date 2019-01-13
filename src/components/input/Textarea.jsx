import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import React from 'utils/ObComponent.js'

export default class Textarea extends React.ObComponent {
  static defaultProps = {
    prefixCls: 'tea-textarea',
    disabled: false,
  }
  static propTypes = {
    disabled: PropTypes.bool,
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  }

  $textarea = null
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
    this.watch([{
      subscrib: [
        'props.prefixCls',
        'props.className',
        'props.disabled',
      ],
      handler: () => {
        const { prefixCls, className, disabled } = this.props
        this.textareaCls = classNames(prefixCls, className, {
          [`${prefixCls}-disabled`]: disabled,
        })
      }
    }])
  }

  focus() {
    this.$textarea.focus()
  }

  blur() {
    this.$textarea.blur()
  }

  select() {
    this.$textarea.select()
  }

  setRef = node => {
    this.$textarea = node
  }

  handleChange = e => {
    const value = _.get(e, 'target.value')
    this.setState({ value })
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(value, e)
    }
  }

  handleKeyDown = e => {
    const value = _.get(e, 'target.value')
    const {
      onPressEnter,
      onKeyDown
    } = this.props
    if (e.keyCode === 13 && _.isFunction(onPressEnter)) {
      onPressEnter(value, e)
    }
    if (_.isFunction(onKeyDown)) {
      onKeyDown(value, e)
    }
  }

  render() {
    const textareaProps = _.omit(this.props, [
      'value',
      'defaultValue',
      'prefixCls',
      'className',
      'onPressEnter',
      'onKeyDown',
      'onChange',
    ])
    return (
      <textarea ref={this.setRef}
        className={this.textareaCls}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        {...textareaProps}
      />
    )
  }
}
