import React, {Component} from 'react';
import * as d3 from 'd3';

let x = d3.scaleTime();
let y = d3.scaleLinear();
let lineValue = d3.line();
let lineVertical = d3.line();

class BarChart extends Component {
  constructor(props) {
    super(props);
    
    this.GetVerticalLineData = this.GetVerticalLineData.bind(this);
    this.FetchData = this.FetchData.bind(this);
    this.GraphInitialize = this.GraphInitialize.bind(this);
    this.GraphUpdate = this.GraphUpdate.bind(this);
    
    console.log("OK");
    
    this.state = {
      timeNow : new Date(),
      timer: null,
    };
    this.chartRef = React.createRef ();
  }
  
  GetVerticalLineData(){
    return([{xval: this.state.timeNow, yval:0},
            {xval: this.state.timeNow, yval:5}]);
  }
  
  FetchData(fn){
    var that = this;
    fetch("/logs/camera.json").
    then((response) => {
         return response.json()
         }).then((data) => {
                 //console.log(data); // [{"Hello": "world"}, …]
                 
                 var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
                 var dataClean = data.map(function(d){ return(parseTime(d))}).slice(-75)
                 
                 
                 that.setState({
                               timeNow: new Date(),
                               data: dataClean
                               },() => {
                               fn();
                               });
                 });
  }
  
  GraphInitialize(){
    
    var fullData = this.state.data.concat(this.state.timeNow);
    //console.log(fullData);
    
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    
    //var x = d3.scaleTime()
    x.range([0, width])
    .domain(d3.extent(fullData));
    
    //var y = d3.scaleLinear()
    y.range([height, 0])
    .domain([0, 5]);
    
    const svg = d3.select(this.chartRef.current);
    svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
    var graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add the x Axis
    graph.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    // add the y Axis
    graph.append("g")
    .attr("class","y axis")
    .attr("transform", "translate(0, 0)")
    .call(d3.axisLeft(y).ticks(3));
    
    lineValue
    .x(function(d) { return x(d);})
    .y(function(d) {return y(3);});
    
    lineVertical
    .x(function(d) { console.log(d); return x(d.xval);})
    .y(function(d) {return y(d.yval);});
    
    graph.append("path")
    .data([this.state.data])
    .attr("class", "line")
    .attr("data-name", "lineValue")
    .attr("d", lineValue);
    
    graph.selectAll("circle")
    .data(this.state.data)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("cx", function(d) { return x(d); })
    .attr("cy", function(d) { return y(3); });
    
    graph.append("path")
    .data([this.GetVerticalLineData()])
    .attr("class", "line")
    .attr("data-name", "lineVertical")
    .attr("d", lineVertical);
    
    
    
   /* graph.append("path")
    .data(this.GetVerticalLineData())
    .attr("class", "line")
    .attr("d", lineVertical)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("fill", "none");*/
    
  }
  
  GraphUpdate(){
    console.log("UPDATING")
    var date1 = new Date();
    date1.setMinutes(date1.getMinutes()+5);
    var fullData = this.state.data.concat(this.state.timeNow);
    //fullData = this.state.data.concat(date1);
    
    x.domain(d3.extent(fullData));
    y.domain([0, 5]);
    
    const svg = d3.select(this.chartRef.current);
    /*
    svg.select("[data-name=lineValue]")
    .transition()
    .duration(750)
    .attr("d", lineValue(fullData));
    */
    svg.select("[data-name=lineVertical]")
    .transition()
    .duration(750)
    .attr("d", lineVertical(this.GetVerticalLineData()));
    
    var u = svg.selectAll("circle")
    .data(this.state.data, function(d){
          return d;
          });
    
    u.enter()
    .merge(u)
    .transition()
    .duration(750)
    .attr("r", 4)
    .attr("cx", function(d) { return x(d); })
    .attr("cy", function(d) { return y(3); });
    
    svg.select(".x.axis")
    .transition()
    .duration(750)
    .call(d3.axisBottom(x));
    
  }
  
  componentDidMount () {
    var that = this;
    that.FetchData(that.GraphInitialize);
    
    console.log("0");
    let timer = setInterval(function() { that.FetchData(that.GraphUpdate); }, 5000);
    this.setState({timer});
    console.log("1");
    
  }
  
  componentDidUpdate () {
    //this.Graph();
  }
  
  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }
  
  render () {
    
    return <svg width={this.props.width} height={this.props.height} ref={this.chartRef}  />;
  }
}

export default BarChart;
