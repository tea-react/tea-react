import React, { Component } from 'react';
import './App.css';


import TInput from 'components/input/index.js'

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
    return (
      <div className="App">
        <p>
          <TInput value={this.state.value}
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
