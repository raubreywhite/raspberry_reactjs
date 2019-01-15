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
  //<LiveImage image={"/camera/image.jpg"} interval={10*60*1000} />
  render() {
    const { name } = this.state;
    
    return (
            <div>
            <p>ph</p>
            <Log width={800} height={250} datapoints={-5760} dataurl={"/logs/ph.json"}  />
            <br/>
            <p>pump run</p>
            <Log width={800} height={200} datapoints={-480} dataurl={"/logs/pump_run.json"}  />
            <br/>
            <p>pump acid</p>
            <Log width={800} height={200} datapoints={-48} dataurl={"/logs/pumpAcid.json"}  />
            <br/>
            <p>pump base</p>
            <Log width={800} height={200} datapoints={-48} dataurl={"/logs/pumpBase.json"}  />
            <br/>
            <p>I am {name}</p>
            <h2>1.750L water, 250ml acid!!!</h2>
            </div>
            );
  }
}

