import PropTypes from 'prop-types'
import classNames from 'classnames'
import React from 'utils/ObComponent.js'
import debug from 'utils/debug.js'
import _ from 'lodash'

const log = debug('FormItem Component')

export default class FormItem extends React.ObComponent {
  static defaultProps = {
    prefixCls: 'tea-formItem',
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

  $formItem = null
  formItemCount = 0
  elementStack = []
  elementStackLevel = 0
  state = {
    value: ''
  }

  constructor(props) {
    super(props)
    this.children = this.injectChildren(this.props.children)
    console.log('FormItem constructor')
    this.watch({
    })
    this.a = 'aaaaaaaaaaaaaaaa'
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
      && originalClass._$type === 'FormItem'
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
      this.originalOnChange = originalProps.onChange
      child = this.cloneElement(child, {
        onChange: this.handleChange
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

  handleChange = (...args) => {
    console.log(this.a, args)
    if (_.isFunction(this.originalOnChange)) {
      this.originalOnChange(...args)
    }
  }

  setRef = node => {
    this.$formItem = node
  }

  render() {
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
