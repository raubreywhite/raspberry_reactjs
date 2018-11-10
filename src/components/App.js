import React, { Component } from 'react';
import Camera from './Camera.js';
import LiveImage from './LiveImage.js';
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
            <LiveImage image={"/camera/image.jpg"} interval={10*60*1000} />
            <Log width={750} height={300} />
            <p>I am {name}</p>
            </div>
            );
  }
}

