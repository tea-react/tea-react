import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import _ from 'lodash'
import EnhanceComponent from 'utils/EnhanceComponent.js'
import InnerInput from './innerInput.js'

export default class AffixInput extends EnhanceComponent {
  static defaultProps = {
    prefixCls: 'tn-input',
    type: 'text',
    disabled: false,
  }
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
  }

  constructor(props) {
    super(props)
  }

  reInputAffix() {
    const {
      prefix,
      suffix,
      style,
      prefixCls,
      className
    } = this.props
    if (prefix !== null && prefix !== undefined) {
      this.prefixNode = (
        <span className={`${prefixCls}-prefix`}>
          {prefix}
        </span>
      )
    }
    if (suffix !== null && suffix !== undefined) {
      this.suffixNode = (
        <span className={`${prefixCls}-suffix`}>
          {suffix}
        </span>
      )
    }
  }

  preRender() {
  }

  render() {
    console.log('input render')
    return (
      <span
        className={this.spanClassName}
        style={this.spanStyle}
      >
        {prefix}
        <InnerInput {...this.inputProps} />
        {suffix}
      </span>
    )
  }
}
