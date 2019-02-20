import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import React from 'utils/ObComponent.js'
import debug from 'utils/debug.js'
import {
  _$type,
  TEA_FORM,
  TEA_FORM_ITEM,
  TEA_FORM_ITEM_CHILD,
} from 'utils/symbol'

const log = debug('FormItem Component')

function checkChange(newVal, oldVal) {
  if (_.isArray(newVal) && _.isArray(oldVal)) {
    const newLen = newVal.length
    const oldLen = oldVal.length
    if (newLen !== oldLen) {
      return false
    }
    let rst = true
    _.forEach(newVal, (value, index) => {
      rst = (oldVal[index] === value) && rst
      return rst
    })
    return rst
  }
  if (_.isObject(newVal) && _.isObject(oldVal)) {

  }
  return newVal === oldVal
}

export default class FormItem extends React.ObComponent {
  static defaultProps = {
    prefixCls: 'tea-formItem',
    rules: [],
    triggerEventName: 'onChange',
    validateEnable: true,
    validateWhenChange: true,
    validateWhenBlur: false,
    showLabel: true,
    label: '',
    defaultMessage: '校验失败',
    required: false,
    requiredMessage: '必填',
  }
  static propTypes = {
    form: PropTypes.object,
    name: PropTypes.string,
    label: PropTypes.node,
    showLabel: PropTypes.bool,
    rules: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
    ]),
    extendRules: PropTypes.array,
    triggerEventName: PropTypes.string,
    validateWhenChange: PropTypes.bool,
    validateWhenBlur: PropTypes.bool,
    validateEnable: PropTypes.bool,
    defaultMessage: PropTypes.string,
    required: PropTypes.bool,
    requiredMessage: PropTypes.string,
  }

  static [_$type] = [TEA_FORM_ITEM]

  $formItem = null
  formItemCount = 0
  elementStack = []
  elementStackLevel = 0
  state = {
    value: '',
  }

  constructor(props) {
    super(props)
    this.watch([{
      'props.form': () => {
        if (_.isObject(this.props.form)
          && this.props.form[_$type] === [TEA_FORM]
        ) {
          this.form = this.props.form
        } else {
          this.form = null
        }
      },
    }, {
      // 计算是否required
      subscribe: ['props.rules', 'props.required'],
      handler: () => {
        if (this.props.required === true) {
          this.required = true
        } else {
          if (_.isString(this.props.rules)) {
            this.required = this.props.rules === 'required'
          } else if (_.isArray(this.props.rules)) {
            _.forEach(this.props.rules, item => {
              this.required = item === 'required'
              return !this.required
            })
          } else if (_.isObject(this.props.rules)) {
            _.forEach(this.props.rules, (value, key) => {
              this.required = value === 'required' || key === 'required'
              return !this.required
            })
          } else {
            this.required = false
          }
        }
      },
    }])
  }

  injectChildren(children) {
    this.elementStackLevel += 1
    if (!_.isArray(children)) {
      this.pushElementStack(children)
      children = this.injectChild(children)
      this.popElementStack(children)
    } else {
      children = _.reduce(children, (acc, child) => {
        this.pushElementStack(child)
        acc.push(this.injectChild(child))
        this.popElementStack(child)
        return acc
      }, [])
    }
    this.elementStackLevel -= 1
    return children
  }

  injectChild(child) {
    if (!React.isValidElement(child)) {
      return child
    }
    const originalClass = child.type
    const originalProps = child.props || {}
    if (_.isFunction(originalClass)
      && originalClass[_$type] === [TEA_FORM_ITEM_CHILD]
      && originalProps.isFormItem !== false
    ) {
      // 对于FormItem做计数，超过一个则报错
      // 因递归策略（找到FormItem立即停止）限制
      // 只能对同层级出现多个FormItem做报错
      this.alterElementStackTop()
      if (this.formItemCount > 0) {
        log.warn('only one controlled component can be used in the FormItem.'
          + '\n you can set `isFormItem={false}` on the other component in JSX'
          + '\n which not be treated as FormItem'
          + '\n when there is more than one controlled component'
          + '\n\n please check your dom -->'
          + '\n' + this.genElementStack()
        )
      }
      this.formItemCount += 1
      this.originalTriggerEvent = originalProps[this.props.triggerEventName]
      child = this.cloneElement(child, {
        [this.props.triggerEventName]: this.collectValue
      })
    } else if (_.isObject(originalProps.children)
      && this.formItemCount < 1
    ) { // 对子节点做递归查找，一旦找到FormItem则停止递归
      // React对element和element.props都做了Object.freeze
      // 因此只能使用clone的方式修改子孙节点
      const children = this.injectChildren(originalProps.children)
      child = this.cloneElement(child, {}, children)
    }
    return child
  }

  cloneElement(element, config, children) {
    // 在development环境下React会为每个element注入_store对象
    // 目前（v16）_store中存放了是否已经校验过React element的标志位validated
    // 但每次使用cloneElement后这个标志位会被重置，
    // 导致渲染时可能会报校验的warning信息，如缺失key
    // 因此，在使用cloneElement后需要重写_store
    // 参考 /react/packages/react/src/ReactElement.js:131
    const _store = element._store
    element = React.cloneElement(element, config, children)
    // FIXME: 可能会因React修改字段导致这里出现异常
    // 由于validated被defineProperty({enumerable: false})
    // 不能被Object.keys读到，
    // 因此只能使用直接使用validated显示赋值的方式写入
    if (_store && element._store) {
      element._store.validated = _store.validated
    }
    return element
  }

  getElementName(element) {
    if (_.isString(element.type)) {
      return element.type
    } else if (_.isObject(element.type)) {
      return element.type.name
    }
  }
  pushElementStack(element) {
    if (!element) {
      return
    }
    this.elementStack.push({
      level: this.elementStackLevel,
      tagName: this.getElementName(element),
      className: element.props && element.props.className,
      isFormItem: '',
    })
  }

  popElementStack(element) {
    if (!element) {
      return
    }
    this.elementStack.push({
      level: this.elementStackLevel,
      tagName: this.getElementName(element),
      close: true
    })
  }

  alterElementStackTop() {
    const top = this.elementStack[this.elementStack.length - 1]
    top.isFormItem = ` isFormItem=${this.formItemCount + 1}`
  }

  genElementStack() {
    return _.map(this.elementStack, line => {
      const pre = line.close ? '</' : '<'
      const className = line.className ? ` className='${line.className}'` : ''
      const isFormItem = line.isFormItem || ''
      return ' '
        + Array(line.level).join('  ')
        + `${pre}${line.tagName}${isFormItem}${className}>`
    }).join('\n')
  }

  collectValue = (value, ...args) => {
    this.value = value
    if (_.isFunction(this.originalTriggerEvent)) {
      this.originalTriggerEvent(value, ...args)
    }
  }

  validate(validator) {
    const value = this.state.value
    const hasChange = checkChange(value, this.oldValue)
    const defaultResult = {
      valid: false,
      message: this.props.defaultMessage,
      value,
      hasChange,
    }
    let rst = {}
    if (_.isFunction(this.props.rules)) {
      rst = this.props.rules(value)
    } else if (_.isFunction(validator)) {
      rst = validator(value, this.props.rules)
    }
    if (!_.isObject(rst)) {
      // error
    } else {
      if (!_.isFunction(rst.then)) {
        rst = Promise.resolve(rst)
      }
      return rst.then(data => {
        if (_.has(data, 'valid') && _.has(data, 'message')) {
          return {
            ...data,
            value,
            hasChange
          }
        } else {
          return defaultResult
        }
      })
    }
  }

  reset() {

  }

  getValue() {

  }

  memorize() {

  }

  setRef(node) {
    this.$formItem = node
  }

  render() {
    this.children = this.injectChildren(this.props.children)
    console.log('FormItem render', this.props.children, this.children)
    const itemProps = _.omit(this.props, [
    ])
    return (
      <span>
        {this.children}
      </span>
    )
  }
}
