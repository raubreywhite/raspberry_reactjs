import React, { Component } from 'react';
import Camera from './Camera.js';
import Log from './Log.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      name: props.name
    };
  }
  
  render() {
    const { name } = this.state;
    
    return (
            <div>
            <h2>Hello!!!</h2>
            <Camera/>
            <Log width={750} height={500} />
            <p>I am {name}</p>
            </div>
            );
  }
}

