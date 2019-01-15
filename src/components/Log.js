import React, {Component} from 'react';
import * as d3 from 'd3';

let xScale = d3.scaleTime();
let yScale = d3.scaleLinear();let lineValue = d3.line();
let xAxis = d3.axisBottom();
let ylAxis = d3.axisLeft();
let yrAxis = d3.axisRight();
let margin = {top: 20, right: 50, bottom: 30, left: 50};


let lineVertical = d3.line();

class BarChart extends Component {
  constructor(props) {
    super(props);
    
    this.GetVerticalLineData = this.GetVerticalLineData.bind(this);
    this.FetchData = this.FetchData.bind(this);
    this.GraphInitialize = this.GraphInitialize.bind(this);
    this.GraphUpdate = this.GraphUpdate.bind(this);  
    this.SetScale = this.SetScale.bind(this);
  
    console.log("OK");
    
    this.state = {
      timeNow : new Date(),
      timer: null,
      width : this.props.width - margin.left - margin.right,
      height : this.props.height - margin.top - margin.bottom,

    };
    this.chartRef = React.createRef ();
  }
  
  GetVerticalLineData(){
    return([{xval: this.state.timeNow, yval:this.props.refl},
            {xval: this.state.timeNow, yval:this.props.refu}]);
  }
  
  FetchData(fn){
    var that = this;
    fetch(this.props.dataurl).
    then((response) => {
         return response.json()
         }).then((data) => {
                 console.log(data); // [{"Hello": "world"}, …]
                 
                 var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
                 var dataClean = data.map(function(d){ return(
                                                              {time: parseTime(d.time),
                                                              value: d.value
                                                              }
                                                              )}).slice(that.props.datapoints)
                 console.log(dataClean); // [{"Hello": "world"}, …]
                 
                 that.setState({
                               timeNow: new Date(),
                               data: dataClean
                               },() => {
                               fn();
                               });
                 });
  }

  SetScale(fullData){
    xScale.range([0, this.state.width])
      .domain(d3.extent(fullData.map(function(d){
                                   return(d.time)
                                   })));
    
    //var y = d3.scaleLinear()
    var yDom = d3.extent(fullData.map(function(d){
                                     return(d.value)
                                      }));
    yDom[0]=yDom[0]-0.25;
    yDom[1]=yDom[1]+0.25;
    yScale.range([this.state.height, 0])
      .domain(yDom);

    xAxis.scale(xScale);
    ylAxis.scale(yScale)
    yrAxis.scale(yScale);

  }
  
  GraphInitialize(){
    console.log(1);
    var fullData = this.state.data.concat(
                                          {time: this.state.timeNow,
                                          value: this.props.refl});

    this.SetScale(fullData);
    //console.log(fullData);
    
    
    //var x = d3.scaleTime()
       
    const svg = d3.select(this.chartRef.current);
    svg.attr("width", this.state.width + margin.left + margin.right)
    .attr("height", this.state.height + margin.top + margin.bottom);
    var graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("data-name","graph");
    
console.log("OK1");
console.log(this.xAxis);
console.log("OK");
    // add the x Axis
    graph.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + this.state.height + ")")
    .call(xAxis);

    
    // add the y Axis
    graph.append("g")
    .attr("class","y axis left")
    .attr("transform", "translate(0, 0)")
    .call(ylAxis);
    
    graph.append("g")
    .attr("class","y axis right")
    .attr("transform", "translate(" + this.state.width + ",0)")
    .call(yrAxis);
    
    lineValue
    .x(function(d) { return xScale(d.time);})
    .y(function(d) {return yScale(d.value);});
    
    lineVertical
    .x(function(d) { console.log(d); return xScale(d.xval);})
    .y(function(d) {return yScale(d.yval);});
    
    /*
    graph.append("path")
    .data([this.state.data])
    .attr("class", "line")
    .attr("data-name", "lineValue")
    .attr("d", lineValue);
    */
    graph.selectAll("circle")
    .data(this.state.data)
    .enter()
    .append("circle")
    .attr("r", 1)
    .attr("cx", function(d) { return xScale(d.time); })
    .attr("cy", function(d) { return yScale(d.value); });
    
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
    var fullData = this.state.data.concat(
                                          {time: this.state.timeNow,
                                          value: this.props.refl});
    //fullData = this.state.data.concat(date1);
    this.SetScale(fullData);
    
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
    
    var u = svg.select("[data-name=graph]").selectAll("circle")
    .data(this.state.data, function(d){
          return d;
          });
    
    u.enter()
    .append("circle")
    .attr("r", 1)
    .attr("cx", function(d) { return xScale(d.time); })
    .attr("cy", function(d) { return yScale(d.value); })
    .merge(u)
    .transition()
    .duration(750)
    .attr("r", 1)
    .attr("cx", function(d) { return xScale(d.time); })
    .attr("cy", function(d) { return yScale(d.value); });
    
    u.exit().remove();
    
    svg.select(".x.axis")
    .transition()
    .duration(750)
    .call(xAxis);
   
    svg.select(".y.axis.left")
    .transition()
    .duration(750)
    .call(ylAxis);
    
    svg.select(".y.axis.right")
    .transition()
    .duration(750)
    .call(yrAxis);
    
  }
  
  componentDidMount () {
    var that = this;
console.log("x");
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
    clearInterval(this.state.timer);
  }
  
  render () {
    
    return <svg width={this.props.width} height={this.props.height} ref={this.chartRef}  />;
  }
}

export default BarChart;
