import React, { Component } from 'react'

class Counter extends Component {
  handleOnClick(){
    this.props.store.dispatch({type: 'INCREASE_COUNT'})
  }
  render(){
    return (<div>
      
      <button onClick={this.handleOnClick.bind(this)}> Click Me</button>
      <div> {this.props.store.getState().count} </div>
    </div>
    )
  }
}

export default Counter;
