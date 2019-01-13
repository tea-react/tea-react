import PropTypes from 'prop-types'
import classNames from 'classnames'
import React from 'utils/ObComponent.js'
import _ from 'lodash'

export default class Input extends React.ObComponent {
  static defaultProps = {
    prefixCls: 'tea-input',
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
    this.watch({
      'props.prefix': () => {
        const { prefix, prefixCls } = this.props
        if (prefix !== null && prefix !== undefined) {
          this.prefixNode = (
            <span className={`${prefixCls}-prefix`}>
              {prefix}
            </span>
          )
        } else {
          this.prefixNode = null
        }
      },
      'props.suffix': () => {
        const { suffix, prefixCls } = this.props
        if (suffix !== null && suffix !== undefined) {
          this.suffixNode = (
            <span className={`${prefixCls}-suffix`}>
              {suffix}
            </span>
          )
        } else {
          this.suffixNode = null
        }
      },
      'props.addonBefore': () => {
        const { addonBefore, prefixCls } = this.props
        const addonClassName = `${prefixCls}-group-addon`
        if (addonBefore !== null && addonBefore !== undefined) {
          this.addonBeforeNode = (
            <span className={addonClassName}>
              {addonBefore}
            </span>
          )
        } else {
          this.addonBeforeNode = null
        }
      },
      'props.addonAfter': () => {
        const { addonAfter, prefixCls } = this.props
        const addonClassName = `${prefixCls}-group-addon`
        if (addonAfter !== null && addonAfter !== undefined) {
          this.addonAfterNode = (
            <span className={addonClassName}>
              {addonAfter}
            </span>
          )
        } else {
          this.addonAfterNode = null
        }
      },
      'props.type': () => {
        // reset type
        this.inputType = this.props.type
        if (this.inputType === 'button'
          || this.inputType === 'checkbox'
          || this.inputType === 'radio'
          || this.inputType === 'range'
          || this.inputType === 'submit'
          || this.inputType === 'reset'
        ) {
          this.inputType = 'text'
        }
      }
    })
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

  getInputCls(use) {
    const { prefixCls, disabled, className } = this.props
    return classNames(prefixCls, {
      [`${prefixCls}-disabled`]: disabled,
      [className]: !!use,
    })
  }

  getAffixCls(use) {
    const { prefixCls, className } = this.props
    return classNames(`${prefixCls}-affix-wrapper`, {
      [className]: !!use,
    })
  }

  withAddon(affixNode) {
    if (!this.addonBeforeNode && !this.addonAfterNode) {
      return affixNode
    }
    const { prefixCls, className, style } = this.props
    const groupCls = classNames(
      `${prefixCls}-group-wrapper`,
      className,
    )
    const addonCls = classNames(
      `${prefixCls}-group`,
      `${prefixCls}-addon-wrapper`,
    )
    const affixNodeClone = React.cloneElement(affixNode, {
      style: null,
      className: this.getAffixCls()
    })
    return (
      <span
        className={groupCls}
        style={style}
      >
        <span className={addonCls}>
          {this.addonBeforeNode}
          {affixNodeClone}
          {this.addonAfterNode}
        </span>
      </span>
    )
  }

  withAffix(inputNode) {
    if (!this.prefixNode && !this.suffixNode) {
      return inputNode
    }
    const affixWrapperCls = this.getAffixCls(true)
    const inputNodeClone = React.cloneElement(inputNode, {
      style: null,
      className: this.getInputCls()
    })
    return (
      <span
        className={affixWrapperCls}
        style={this.props.style}
      >
        {this.prefixNode}
        {inputNodeClone}
        {this.suffixNode}
      </span>
    )
  }

  render() {
    const inputProps = _.omit(this.props, [
      'value',
      'defaultValue',
      'type',
      'prefixCls',
      'className',
      'onPressEnter',
      'onKeyDown',
      'onChange',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
    ])
    const inputClassName = this.getInputCls(true)
    return this.withAddon(this.withAffix(
      <input ref={this.setRef}
        className={inputClassName}
        type={this.inputType}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        {...inputProps}
      />
    ))
  }
}
