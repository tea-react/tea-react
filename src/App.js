import React, { Component } from 'react';
import './App.css';


import Input, {
  Textarea,
} from 'components/input/index.js'
import {
  FormItem
} from 'components/form/index.js'
import FormItemTest from './FormItemTest'

const block = {
  borderBottom: '1px solid'
}

class App extends Component {

  state = {
    value: 2
  }

  handleChange = (value, ...args) => {
    // this.state.value = value
    console.log('Demo handleChange', this.state.value, ...args)
  }

  handleClick = () => {
    // console.log('handleClick', this.state.value)
    this.setState({
      value: Math.random()
      // value: 1,
    })
  }
  render() {
    const prefix = <i className='prefix'/>
    const suffix = 'suffix'
    const addonBefore = <button>addonBefore</button>
    const addonAfter = this.state.value > 0.5 ? <button>addonAfter</button> : ''
    return (
      <div className="App">
        <p style={block}>
          <Input value={this.state.value}
            data-ss='xxxx'
            style={{border: '1px', color: '#f00'}}
            className='ssss'
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            prefix={prefix}
            suffix={suffix}
            onChange={this.handleChange}/>
          <button onClick={this.handleClick}>tttt</button>
        </p>
        <p style={block}>
          <FormItem>
            <span>
              <Input value={this.state.value}
                data-ss='xxxx'
                style={{border: '1px', color: '#f00'}}
                className='ssss'
                addonBefore={addonBefore}
                addonAfter={addonAfter}
                prefix={prefix}
                suffix={suffix}
                onChange={this.handleChange}/>
              <span></span>
              <span>
                <Input value={this.state.value}
                  data-ss='xxxx'
                  style={{border: '1px', color: '#f00'}}
                  className='ssss'
                  addonBefore={addonBefore}
                  addonAfter={addonAfter}
                  prefix={prefix}
                  suffix={suffix}
                  onChange={this.handleChange}/>
                <span><span></span></span>
              </span>
            </span>
            <button onClick={this.handleClick}>tttt</button>
          </FormItem>
        </p>
        <p style={block}>
          <Textarea value={this.state.value}
            data-ss='xxxx'
            style={{border: '1px', color: '#f00'}}
            className='ssss'
            onChange={this.handleChange}/>
          <button onClick={this.handleClick}>tttt</button>
        </p>
        <div>===========</div>
        <FormItem>
          <FormItemTest />
        </FormItem>
      </div>
    );
  }
}

export default App;
