import React, { Component } from 'react';
import './App.css';


import Input, {
  Textarea,
} from 'components/input/index.js'

class App extends Component {

  state = {
    value: 2
  }

  handleChange = e => {
    this.state.value = e
    // console.log('Demo handleChange', this.state.value, e)
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
    const addonAfter = <button>addonAfter</button>
    return (
      <div className="App">
        <p>
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
        <p>
          <Textarea value={this.state.value}
            data-ss='xxxx'
            style={{border: '1px', color: '#f00'}}
            className='ssss'
            onChange={this.handleChange}/>
          <button onClick={this.handleClick}>tttt</button>
        </p>
      </div>
    );
  }
}

export default App;
