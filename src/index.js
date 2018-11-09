import React, { Component } from 'react';
import { render } from "react-dom";

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
            <img src="/camera/image.jpg"/>
            <h2>Hello!!!</h2>
            <p>I am {name}</p>
            </div>
            );
  }
}

render(<App name={"ok"} />, document.getElementById("app"));
