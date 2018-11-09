import React, {Component} from 'react';
import * as d3 from 'd3';

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.Graph = this.Graph.bind(this);
    
    console.log("OK");
    
    
    
    this.state = {
      timeNow : new Date()
    };
    this.chartRef = React.createRef ();
  }
  
  Graph(){
    
    var fullData = this.state.data.concat(this.state.timeNow);
    console.log(fullData);
    
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    
    var x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(fullData));
    
    var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 5]);
    
    const svg = d3.select(this.chartRef.current);
    svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
    var graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add the x Axis
    graph.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    // add the y Axis
    graph.append("g")
    .attr("transform", "translate(0, 0)")
    .call(d3.axisLeft(y).ticks(3));
    
    var valueLine = d3.line()
    .x(function(d) { return x(d);})
    .y(function(d) {return y(3);});
    
    graph.append("path")
    .data([this.state.data])
    .attr("class", "line")
    .attr("d", valueLine);
    
    graph.selectAll("dot")
    .data(this.state.data)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("cx", function(d) { return x(d); })
    .attr("cy", function(d) { return y(3); });
    
    graph.append("line")
    .attr("x1", x(this.state.timeNow))  //<<== change your code here
    .attr("y1", y(0))
    .attr("x2", x(this.state.timeNow))  //<<== and here
    .attr("y2", y(5))
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("fill", "none");
    
    
    
    
    
    /*
     const chart = d3.select (this.chartRef.current);
     const barWidth = 20;
     const chartHeight = 200;
     const yScale = d3
     .scaleLinear()
     .range ([0, d3.max (dataVals)])
     .domain ([0, chartHeight]);
     const bar = chart
     .selectAll ('g')
     .data (dataVals)
     .enter ()
     .append ('g')
     .attr ('transform', (value, i) => `translate(0,${i * barWidth})`);
     bar
     .append ('rect')
     .attr ('height', value => yScale (value))
     .attr ('width', barWidth - 1)
     .attr ('style', 'fill: steelblue;');
     bar
     .append ('text')
     .attr ('y', value => yScale (value) - 5)
     .attr ('x', barWidth / 2)
     .attr ('dy', '.35em')
     .attr ('style', 'fill: white; font: 14px sans-serif; text-anchor: end;')
     .text (value => value);
     */
  }
  
  componentDidMount () {
    console.log("1");
    var that = this;
    fetch("/logs/camera.json").
      then((response) => {
        return response.json()
      }).then((data) => {
        console.log(data); // [{"Hello": "world"}, …]
        
        var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
        var dataClean = data.map(function(d){ return(parseTime(d))}).slice(-75)
        
        
        that.setState({
          data: dataClean
        },() => {
          that.Graph();
        });
      });
    console.log("3");
  }
  
  componentDidUpdate () {
    //this.Graph();
  }
  
  render () {
    
    return <svg width={this.props.width} height={this.props.height} ref={this.chartRef}  />;
  }
}

export default BarChart;
