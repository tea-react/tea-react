import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import ObservableComponent from 'utils/ObservableComponent.js'
import _ from 'lodash'

export default class Input extends ObservableComponent {
  static defaultProps = {
    prefixCls: 'tn-input',
    type: 'text',
    disabled: false,
  }
  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    maxLength: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    prefixCls: PropTypes.string,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
  }

  $input = null
  _className = ''
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
    console.log('input constructor')
    this._subscribe([
      'className',
      'style',
    ], [], (props, states) => {
      console.log('trigger1', props, states)
    })
    this._subscribe([
      'className',
      'style',
      'value'
    ], [], (props, states) => {
      console.log('trigger2', props, states)
    })
    // let a = this._$props.className
    // this._$props.className = 'xxxx'
    // a = this._$props.className
    // this._$props.className = 'xxxx'
    // a = this._$props.className
    // console.log(this._$props)
    // this._$props.style = ""
  }

  reInputProps() {
    this.inputProps = _.omit(this.props, [
      'value',
      'defaultValue',
      'prefixCls',
      'className',
      'style',
      'onPressEnter',
      'onKeyDown',
      'onChange',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
    ])
    this.inputStyle = this.props.style
    this.inputClassName = this.props.className
  }

  reInputClassName() {
    const { prefixCls, disabled } = this.props
    if (this._prefixCls !== prefixCls
      || this._disabled !== disabled
    ) {
      this._prefixCls = prefixCls
      this._disabled = disabled
      this.inputClassName = classNames(prefixCls, {
        [`${prefixCls}-disabled`]: disabled,
      })
    }
  }

  reInnerInput() {
      this.inputNode = <input ref={this.setRef}
        className={this.inputClassName}
        style={this.inputStyle}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        {...this.inputProps}
      />
  }

  reInputAffix() {
    const { prefix, suffix, style, prefixCls, className } = this.props
    if (!_.has(this.props, 'prefix') && !_.has(this.props, 'suffix')) {
      this.inputStyle = style
      this.affixStyle = null
      this.inputClassName = className
      this.affixClassName = null
      this.prefixNode = null
      this.suffixNode = null
    } else {
      this.inputStyle = null
      this.affixStyle = style
      this.inputClassName = null
      this.affixClassName = className
      if (this._prefix !== prefix) {
        this._prefix = prefix
        if (prefix !== null && prefix !== undefined) {
          this.prefixNode = (
            <span className={`${prefixCls}-prefix`}>
              {prefix}
            </span>
          )
        } else {
          this.prefixNode = null
        }
      }
      if (this._suffix !== suffix) {
        this._suffix = suffix
        if (suffix !== null && suffix !== undefined) {
          this.suffixNode = (
            <span className={`${prefixCls}-suffix`}>
              {suffix}
            </span>
          )
        } else {
          this.suffixNode = null
        }
      }
    }
    if (!_.isEqual(this._inputStyle, this.inputStyle)
      || this._inputClassName !== this.inputClassName
    ) {
      this._inputStyle = this.inputStyle
      this._inputClassName = this.inputClassName
      this.reInnerInput()
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
  preRender() {
    if (!this._stateHasChanged) {
      this.reInputProps()
      this.reInputClassName()
    } else {
      this.reInnerInput()
    }
  }
  render() {
    // this._notify()
    console.log('input render', this.props)
    const {style, className, value} = this.props
    return ''
      /*
    const inputProps = _.omit(this.props, [
      'value',
      'defaultValue',
      'prefixCls',
      'className',
      'style',
      'onPressEnter',
      'onKeyDown',
      'onChange',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
    ])
    const {
      prefixCls,
      className,
      style,
      addonBefore,
      addonAfter,
      prefix,
      suffix,
      disabled
    } = this.props
    this.inputClassName = classNames(prefixCls, {
      [`${prefixCls}-disabled`]: disabled,
    })

    let prefixNode = null
    if (prefix !== null && prefix !== undefined) {
      prefixNode = (
        <span className={`${prefixCls}-prefix`}>
          {prefix}
        </span>
      )
    }
    let suffixNode = null
    if (suffix !== null && suffix !== undefined) {
      this.suffixNode = (
        <span className={`${prefixCls}-suffix`}>
          {suffix}
        </span>
      )
    }
    const addonClassName = `${prefixCls}-group-addon`;
    let addonBeforeNode = null
    if (addonBefore !== null && addonBefore !== undefined) {
      addonBeforeNode = (
        <span className={addonClassName}>
          {addonBefore}
        </span>
      )
    }
    let addonAfterNode = null
    if (addonAfter !== null && addonAfter !== undefined) {
      addonAfterNode = (
        <span className={addonClassName}>
          {addonAfter}
        </span>
      )
    }
    let node = null
    if (addonBeforeNode || addonAfterNode) {
      const groupWrapperClassName = classNames(
        `${prefixCls}-group-wrapper`,
        className,
      )
      const addonClassName = classNames(
        `${prefixCls}-wrapper`,
        `${prefixCls}-group`,
      )
      const inputClassName = ''
      const inputStyle = null
      if (suffixNode || prefixNode) {
        const affixWrapperCls = classNames(
          `${prefixCls}-affix-wrapper`,
        )
        node = (
          <span
            className={groupWrapperClassName}
            style={style}
          >
            <span className={addonClassName}>
              {addonBeforeNode}
              <span
                className={affixWrapperCls}
              >
                {prefix}
                <input ref={this.setRef}
                  className={inputClassName}
                  style={inputStyle}
                  value={this.state.value}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  {...inputProps}
                />
                {suffix}
              </span>
              {addonAfterNode}
            </span>
          </span>
        )
      } else {
        node = (
          <span
            className={groupWrapperClassName}
            style={style}
          >
            <span className={addonClassName}>
              {addonBeforeNode}
              <input ref={this.setRef}
                className={inputClassName}
                style={inputStyle}
                value={this.state.value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                {...inputProps}
              />
              {addonAfterNode}
            </span>
          </span>
        )
      }
    } else {
      if (suffixNode || prefixNode) {
        const affixWrapperCls = classNames(
          `${prefixCls}-affix-wrapper`,
          className,
        )
        const inputClassName = ''
        const inputStyle= null
        node =(
          <span
            className={affixWrapperCls}
          >
            {prefix}
            <input ref={this.setRef}
              className={inputClassName}
              style={inputStyle}
              value={this.state.value}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              {...inputProps}
            />
            {suffix}
          </span>
        )
      } else {
        const inputClassName = ''
        const inputStyle= null
        node = (
          <input ref={this.setRef}
            className={inputClassName}
            style={inputStyle}
            value={this.state.value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            {...inputProps}
          />
        )
      }
    }
    return node
      */
  }
}
