import React from 'react'
import _ from 'lodash'
import TInput from './input/index.js'
import EnhanceComponent from './utils/EnhanceComponent.js'


const page = {
    margin: '100px auto'
}

export default class Demo extends EnhanceComponent {

    state = {
        value: 2
    }

    handleChange = e => {
        this.state.value = e
        console.log('Demo handleChange', this.state.value, e)
    }

    handleClick = () => {
        console.log('handleClick', this.state.value)
        this.setState({
            value: Math.random()
            // value: 1,
        })
    }

    render() {
      console.log('demo render')
        return (
            <div style={page}>
                <p>=========================================</p>
                <TInput value={this.state.value}
                    data-ss='xxxx'
                    style={{border: '1px', color: '#f00'}}
                    className='ssss'
                    onChange={this.handleChange}/>
                <button onClick={this.handleClick}>tttt</button>
                <p>=========================================</p>
            </div>
        )
    }
}
