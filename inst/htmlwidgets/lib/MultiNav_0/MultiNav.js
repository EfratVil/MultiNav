//---------------------------------------------------------------------------------
// Version 0.1.0
//---------------------------------------------------------------------------------

function mNav_Line_chart(args) {

    //Todo: custom ticklines
    //Todo: add axis lables
    //Todo: configurable grid lines

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var dots = args.add_dots || false;
    var no_line = args.no_line || false;
    var xAxisTickValues = args.xAxisTickValues || "";
   

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;


    //  var parseDate = d3.time.format("%Y-%m-%d hh:mm:ss").parse;
    var x = d3.scaleLinear()//d3.time.scale()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date"}).forEach(function (k) {
            d[k] = +d[k];
        });
    });

    var line = d3.line()
        .x(function (d) { return x(d[x_ds]); })
        .y(function (d) { return y(d[y_ds]); });

    var svg = d3.select("#" + chart).append("svg")
        .attr("id", chart + "_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d[x_ds]; }));
    y.domain(d3.extent(data, function (d) { return d[y_ds]; }));

    var gX = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
      //  .ticks(d3.time.minutes, 15)
      //.tickFormat(d3.time.format("%H:%M"))
        .call(d3.axisBottom(x))
        .append("text")
           .attr("class", "label")
           .attr("x", width)
           .attr("y", -6)
           .style("text-anchor", "end")
           .text(x_ds);      

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
       .append("text")
           .attr("class", "axis-title")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(y_ds);

    // add line
    if (!no_line) {
        svg.append("path")
         .datum(data)
         .attr("class", "line")
         .attr("d", line)
         .attr("id", "line");
    }

    // Add circles 
    if (dots) {
        svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", 1)
        .style("fill", function (d) { return "#74add1;" }) //color
     }  
}


function mNav_scatter_plot(args) {

    //TODO: zoom
    //TODO: color, size, opacity --> by field name
    //TODO: tooltip
    //TODO: option to add gridlines 
    //TODO: Option to add link to other page or another div 

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;

    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 25, right: 25, bottom: 40, left: 82 };

    var color = args.color || "#1f78b4";
    var radius = args.radius || 4;
    var opacity = args.opacity || 0.5;

    var link_id = args.link_id || "";                    // Activate linked chart
	var pointer = args.pointer || 0;                    // Activate linked chart

    width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

    {
        var x = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
        y.domain(d3.extent(data, function (d) { return d[y_ds]; })).nice();

		
		//https://github.com/d3/d3-format
        var xAxis = d3.axisBottom(x).ticks(6),
            yAxis = d3.axisLeft(y).ticks(12 * height / width)
			  .tickFormat(function (d) {
				if (d >-100)
				{
					var array = ['','k','M','G','T','P'];
					var i=0;
					while (d > 1000)
						{
					 	 i++;
						 d = d/1000;
						}
				    d = Math.round(d*100)/100 +' '+array[i];
					return d;
				}			 
			    else
			    {
				  return d3.format(".3s")(d);
			    }  
	    });
													
    }

    var svg = d3.select("#" + chart)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", chart + "_svg");

    if (link_id != "") {
        svg.attr("class", link_id + " scatter_plot");
    }

    // add x and y axis
    {
        svg.append("g")
            .attr("class", "axis ")
            .attr('id', "axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", 33)
            .style("text-anchor", "end")
            .text(x_ds);

        svg.append("g")
            .attr("class", "axis")
            .attr('id', "axis--y")
            .call(yAxis)
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-4.5em")
            .style("text-anchor", "end")
            .text(y_ds);

    }

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", radius)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", opacity)
        .style("fill", color)
        .on("mouseover", function (d) {
           // if (linked)
		   if (pointer == 1) {	
	          
		   d3.select(this).style("cursor", "pointer");
		   }
			if (link_id != "") {
			
                //TODO: check if there is an object with id=link_id. If yes, change the html to the focus_id
                //   d3.select("#" + link_id).html(d["id"]);

                focus_id = d["id"];
				
			 d3.select("#link_" + link_id).html(focus_id);
             d3.select('#link_' + link_id).dispatch('change');


                //select all linked scatter plots
                var svg1 = d3.selectAll("." + link_id + ".scatter_plot");

                // trigger event to change linked line charts (if they exist)
                d3.selectAll('.' + link_id + '.line_chart').dispatch('change_y_var', '{ detail: { focus_id } }');
               
                svg1.selectAll('circle')
                    .transition()
                    .duration(150)
                    .ease(d3.easeLinear)
                    .style("fill", function (d) {
						if (!focus_id)
						 { return color }
					//console.log("link_id");
                   // console.log(link_id);
				
                        else if (d.id == focus_id) { return "red" }
                        else { return color };
                    })
                    //.style("stroke", function (d) {
                    //    if (d.id == focus_id) {return "#2166ac"
                    //    } else {
                    //        if (d.grade_auto == "Good") { return "#1a9850" } else { if (d.grade_auto == "tbd") { return "#fdae61" } else { return "#d73027" } }
                    //    };
                    //})
                    .attr("r", function (d) {
						
						if (!focus_id)
						 { return "4" } 
					 
                        if (d.id == focus_id) {
                            this.parentElement.appendChild(this);
                            return "10"
                        }
                        else { return "4" };
                    })
            }
        })
        .on("click", function (d) {
           // if (linked)
				
			if (link_id != "") {

             focus_id = d["id"];
				
			 d3.select("#link_" + link_id).html(focus_id);
             d3.select('#link_' + link_id).dispatch('click');
			 console.log("dot on click trigger");
			}

        })		
		;
}


function mNav_scatter_plot_orig(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var height = args.height || width / 1.618;
    var color = args.color || "#1f78b4";
    var linked = args.linked || false;
    var link_id = args.link_id || "p_id";// Activate linked chart

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    ////tooltip
    //var tooltip = d3.select("body").append("div")
    //               .attr("class", "tooltip")
    //               .style("opacity", 0);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date"}).forEach(function (k) {
            d[k] = +d[k];
        });
    });

        var x = d3.scaleLinear()
                 .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x).ticks(12),
            yAxis = d3.axisLeft(y).ticks(12 * height / width);

        var svg = d3.select("#" + chart).append("svg")
                 .attr("id", chart + "_svg")
                 .attr("data-margin-right", margin.right)
                 .attr("data-margin-left", margin.left)
                 .attr("data-margin-top", margin.top)
                 .attr("data-margin-bottom", margin.bottom)
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
        y.domain(d3.extent(data, function (d) { return d[y_ds]; })).nice();

        svg.append("g")
        .attr("class", "x axis ")
        .attr('id', "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(x_ds);

        svg.append("g")
            .attr("class", "y axis")
            .attr('id', "axis--y")
            .call(yAxis)
            .append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(y_ds);


        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) { return x(d[x_ds]); })
            .attr("cy", function (d) { return y(d[y_ds]); })
            .attr("opacity", 0.5)
            .style("fill", color)
            .on("mouseover", function (d) {
                if (linked)
                {
                    d3.select("#link_" + link_id).html(d["id"]);
                    d3.select('#link_' + link_id).dispatch('change');
					
					svg.selectAll('circle')
                    .transition()
                    .duration(150)
                    .ease(d3.easeLinear)
                    .style("fill", function (d) {
                        if (d.id == d["id"]) { return "red" }
                        else { return color };
                    })
                    //.style("stroke", function (d) {
                    //    if (d.id == focus_id) {return "#2166ac"
                    //    } else {
                    //        if (d.grade_auto == "Good") { return "#1a9850" } else { if (d.grade_auto == "tbd") { return "#fdae61" } else { return "#d73027" } }
                    //    };
                    //})
                    .attr("r", function (d) {
                        if (d.id == d["id"]) {
                            this.parentElement.appendChild(this);
                            return "10"
                        }
                        else { return "4" };
                    })
					
                }
            });

        }

function mNav_flex_scatter_uni(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var height = args.height || width / 1.618;
    var color = args.color || "#1f78b4";
    var linked = args.linked || false;                    // Activate linked chart

    width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom - 30; //the '-30' is for leaving space for the buttons

    ////tooltip
    //var tooltip = d3.select("body").append("div")
    //               .attr("class", "tooltip")
    //               .style("opacity", 0);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });


    data1 = data.sort(function (a, b) {
        return b[y_ds] - a[y_ds];
    });

    data1 = data1.map(function (d, i) {
        return {
            x: i,
            y: +d[y_ds]
        };
    });


    var min = d3.min(data1, function (d) { return d.y; });

    var log_fix = 0;
    if (min <= 0)
    { log_fix = Math.abs(min) + 0.01 }

    data2 = data1.map(function (d, i) {
        return {
            x: data[i][x_ds],
            x1: +d.x,
            y: +d.y,
            y_exp: Math.exp(+d.y),
            y_log: Math.log(+d.y + log_fix),
            y_diff: data1[i].y + data1[i + 1]

        };
    });


    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x).ticks(12),
        yAxis = d3.axisLeft(y).ticks(12 * height / width);

    d3.select("#" + chart).append("span").html("<button id='" + chart + "_b1' type='button' style='padding:1px' class='btn btn- info btn- sm'>Sort</button>&nbsp;&nbsp;&nbsp;&nbsp;" +
        "<button id='" + chart + "_b2' type='button' style='padding:1px' class='btn btn- info btn- sm'>Exp</button>&nbsp;&nbsp;" +
        "<button id='" + chart + "_b3' type='button' style='padding:1px' class='btn btn- info btn- sm'>Value</button>&nbsp;&nbsp;" +
        "<button id='" + chart + "_b4' type='button' style='padding:1px' class='btn btn- info btn- sm'>Log</button>"
    );
    var svg = d3.select("#" + chart).append("svg")
        .attr("id", chart + "_svg")
        .attr("data-margin-right", margin.right)
        .attr("data-margin-left", margin.left)
        .attr("data-margin-top", margin.top)
        .attr("data-margin-bottom", margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data2, function (d) { return d.x; })).nice();
    y.domain(d3.extent(data2, function (d) { return d.y; })).nice();

    svg.append("g")
        .attr("class", "x axis ")
        .attr('id', "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(x_ds);

    svg.append("g")
        .attr("class", "y axis")
        .attr('id', "axis--y")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(y_ds);


    svg.selectAll(".dot")
        .data(data2)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); })
        .attr("opacity", 0.5)
        .style("fill", color)
        .on("mouseover", function (d) {
            if (linked) {
                d3.select("#p_id").html(d["id"]);
                d3.select('#p_id').dispatch('change');
            }
        });


    var sort_order = 1;

    d3.select("#" + chart + "_b1").on("click", function () {
        var t = svg.transition().duration(1750);

        if (sort_order == 1) {
            svg.selectAll("circle").transition(t)
                .attr("cx", function (d) { return x(d.x1); });
            sort_order = 0;

        }
        else {
            svg.selectAll("circle").transition(t)
                .attr("cx", function (d) { return x(d.x); });
            sort_order = 1;
        }

    });
    // exp
    d3.select("#" + chart + "_b2").on("click", function () {

        y.domain(d3.extent(data2, function (d) { return d.y_exp; })).nice();

        var t = svg.transition().duration(750);
        svg.select("#axis--y").transition(t).call(yAxis);

        svg.selectAll("circle").transition(t)
            .attr("cy", function (d) { return y(d.y_exp); });
    });

    //Value
    d3.select("#" + chart + "_b3").on("click", function () {
        y.domain(d3.extent(data2, function (d) { return d.y; })).nice();

        var t = svg.transition().duration(750);
        svg.select("#axis--y").transition(t).call(yAxis);

        svg.selectAll("circle").transition(t)
            .attr("cy", function (d) { return y(d.y); });
    });


    //log
    d3.select("#" + chart + "_b4").on("click", function () {
        y.domain(d3.extent(data2, function (d) { return d.y_log; })).nice();

        var t = svg.transition().duration(750);
        svg.select("#axis--y").transition(t).call(yAxis);

        svg.selectAll("circle").transition(t)
            .attr("cy", function (d) { return y(d.y_log); });
    });

}

function mNav_force(args) {

    var chart = args.chart;
    var data = args.data;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var radius = args.radius || 4.5;
    var charge = args.charge || -40;
    var labels = args.labels || 0;
    var linked = args.linked || false;                    // Activate linked chart
    var link_id = args.link_id || "p_id";// Activate linked chart

    //  var add_text = args.add_text || false;
    // Todo!! missing margins: { top: 15, right: 15, bottom: 15, left: 15 };

    var svg = d3.select("#" + chart).append("svg")
        .attr("width", width)
        .attr("height", height);

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(function (d) { return d.value / 2; }))//
    .force("charge", d3.forceManyBody().strength(charge)) //- 120
    .force("center", d3.forceCenter(width / 2, height / 2));

    // Create links
    var links = [];
    links = data.map(function (d, i) {
        return {
            index: i + 1,
            source: d.from,
            target: d.to,
            value: +d.weight
        };
    });

    function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = { name: name });
    }

    // Create nodes for each unique source and target.
    var nodesByName = {};
    links.forEach(function (link, i) {
        link.source = nodeByName(link.source);
        link.target = nodeByName(link.target);
    });

    // Extract the array of nodes from the map by name.
    var nodes = d3.values(nodesByName);

    var graph = { "nodes": nodes, "links": links };

    var link = svg.append("g")
       .attr("class", "links")
       .selectAll("line")
       .data(graph.links)
       .enter().append("line")
          .attr("stroke-width", 2);;   //function (d) { return Math.sqrt(d.value); }

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .style("fill", "#2166ac")
        .attr("r", radius)
        .on("mouseover", function (d) {
         if (linked)
             {
    //              d3.select("#p_id").html(d["name"]);
     //             d3.select('#p_id').dispatch('change');
             d3.select("#link_" + link_id).html(d["name"]);
                  d3.select('#link_' + link_id).dispatch('change');

             }
          })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    if (labels !== 0) {

        var label = svg.append("g")
                       .attr("class", "labels")
                       .selectAll("text")
                       .data(graph.nodes)
                       .enter().append("text")
                        .attr("class", "label")
                        .text(function (d) { return d.name; });
    }
    //node.append("text")
    //  .attr("dx", 12)
    //  .attr("dy", ".35em")
    //  .text(function (d) { return d.name });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        if (labels !== 0) {
            label
                .attr("x", function (d) { return d.x - labels.x; })
                .attr("y", function (d) { return d.y + labels.y; })
                .style("font-size", labels.size).style("fill", labels.color);
        }
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function mNav_functional_box_plot(args) {

    var chart = args.chart;
    var quantiles = args.data;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 42, left: 75 };
    var height = args.height || width / 1.618;
	var median_color = args.median_color || "";
	var ylbl = args.ylbl || "";
	var xlbl = args.xlbl || "";
	var title = args.title || "";

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    quantiles.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(quantiles[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });


    var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(['#deebf7', '#c6dbef', '#c6dbef', '#deebf7']);

    var area_data = d3.area()
    .x(function (d) { return x(d.seq_id); })
    .y0(function (d) { return y(d.low); })
    .y1(function (d) { return y(d.high); });


    var svg = d3.select("#" + chart).append("svg")
         .attr("id", chart + "_svg")
         .attr("data-margin-right", margin.right)
         .attr("data-margin-left", margin.left)
         .attr("data-margin-top", margin.top)
         .attr("data-margin-bottom", margin.bottom)
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom);
		 
        // .append("g")
       //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //  var keys = quantiles.columns.slice(1);
  //  var keys = ["quantile_02", "quantile_25", "median", "quantile_75", "quantile_98"];

    var keys = [Object.keys(quantiles[1])[2], Object.keys(quantiles[1])[3], Object.keys(quantiles[1])[4], Object.keys(quantiles[1])[5], Object.keys(quantiles[1])[6]];

	
    x.domain(d3.extent(quantiles, function (d) { return d.seq_id; }));
    //    y.domain([d3.min(quantiles, function (d) { return d.quantile_02; }), d3.max(quantiles, function (d) { return d.quantile_98; })]);
    y.domain([d3.min(quantiles, function (d) { return d.min; }), d3.max(quantiles, function (d) { return d.max; })]);
	
    z.domain(keys);

    for (var i = 0; i < keys.length - 1; i++) {
        area_ds = quantiles.map(function (d) {
            return {
                seq_id: +d.seq_id,
                low: +d[keys[i]],
                high: +d[keys[i + 1]]
            };
        });
        area = area_data(area_ds);
        g.append('path')
            .attr('d', area)
            .style("fill", z(keys[i]));
    }

	
	
	 // add x and y axis
    {
		
		g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(6))      
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", 33)
            .style("text-anchor", "end")
            .text(xlbl);
		
	
		g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y)) 
		.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-4em")
            .style("text-anchor", "end")
            .text(ylbl);
	    
	}
    // g.append("g")
        // .attr("class", "axis axis--x")
        // .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(x));

    // g.append("g")
        // .attr("class", "axis axis--y")
        // .call(d3.axisLeft(y));
		
		
	// Add median line
if (median_color!=="")
{	
		var line = d3.line()
        .x(function (d) { return x(d["seq_id"]); })
        .y(function (d) { return y(d["median"]); });       

		svg.append("path")
        .datum(quantiles)
        .attr("class", "line")
        .attr("d", line)
        .attr("id", "line")
		.style("stroke", median_color)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}


    // Add chart title
	
	if (title!=="")
	{	
		g.append("text")
        .attr("x", (width / 2))  
        .attr("class", "title")		
        .attr("y", 0 - (margin.top / 2)+5)
        .attr("text-anchor", "middle")  
       // .style("font-size", "16px") 
        .text(title);
	}

}

//!!!!!!!!!!!!!!! missing in orig
function mNav_functional_box_plot_with_line(args) {

    var chart = args.chart;
    var quantiles = args.data;
    var raw_data = args.ds_raw;
    var line_id = args.line_id || 21989;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 42, left: 75 };
    var height = args.height || width / 1.618;
	var window_link = args.window_link || 0;
	var ylbl = args.ylbl || "";
	var xlbl = args.xlbl || "";
	var title = args.title || "";

    width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    raw_data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(raw_data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

    quantiles.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(quantiles[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });
    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(['#deebf7', '#c6dbef', '#c6dbef', '#deebf7']);

    var area_data = d3.area()
        .x(function (d) { return x(d.seq_id); })
        .y0(function (d) { return y(d.low); })
        .y1(function (d) { return y(d.high); });


    var svg = d3.select("#" + chart).append("svg")
        .attr("id", chart + "_svg")
        .attr("data-margin-right", margin.right)
        .attr("data-margin-left", margin.left)
        .attr("data-margin-top", margin.top)
        .attr("data-margin-bottom", margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    // .append("g")
    //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  var keys = quantiles.columns.slice(1);
    //  var keys = ["quantile_02", "quantile_25", "median", "quantile_75", "quantile_98"];

    var keys = [Object.keys(quantiles[1])[2], Object.keys(quantiles[1])[3], Object.keys(quantiles[1])[4], Object.keys(quantiles[1])[5], Object.keys(quantiles[1])[6]];

    x.domain(d3.extent(quantiles, function (d) { return d.seq_id; }));
    //    y.domain([d3.min(quantiles, function (d) { return d.quantile_02; }), d3.max(quantiles, function (d) { return d.quantile_98; })]);
    y.domain([d3.min(quantiles, function (d) { return d.min; }), d3.max(quantiles, function (d) { return d.max; })]);
    z.domain(keys);
	
	

    for (var i = 0; i < keys.length - 1; i++) {
        area_ds = quantiles.map(function (d) {
            return {
                seq_id: +d.seq_id,
                low: +d[keys[i]],
                high: +d[keys[i + 1]]
            };
        });
        area = area_data(area_ds);
        g.append('path')
            .attr('d', area)
            .style("fill", z(keys[i]));
    }



	
    // add x and y axis
    {
		
		g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(3))
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", 33)
            .style("text-anchor", "end")
            .text(xlbl);
		
		
		
		
		var yAxis = d3.axisLeft(y).ticks(12 * height / width)
			  .tickFormat(function (d) {
				if (d >-100)
				{
					var array = ['','k','M','G','T','P'];
					var i=0;
					while (d > 1000)
						{
					 	 i++;
						 d = d/1000;
						}
				    d = Math.round(d*100)/100 +' '+array[i];
					return d;
				}			 
			    else
			    {
				  return d3.format(".3s")(d);
			    }  
	    });
		
		
		
		
		g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis) 
		.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-4em")
            .style("text-anchor", "end")
            .text(ylbl);
		
        // svg.append("g")
            // .attr("class", "axis ")
            // .attr('id', "axis--x")
            // .attr("transform", "translate(0," + height + ")")
            // .call(xAxis)
            // .append("text")
            // .attr("class", "label")
            // .attr("x", width)
            // .attr("y", -6)
            // .style("text-anchor", "end")
            // .text(x_ds);

        // svg.append("g")
            // .attr("class", "axis")
            // .attr('id', "axis--y")
            // .call(yAxis)
            // .append("text")
            // .attr("class", "axis-title")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 6)
            // .attr("dy", "-4em")
            // .style("text-anchor", "end")
            // .text(y_ds);

    }
		
		
		
		

    var line = d3.line()
        .x(function (d) { return x(d["seq_id"]); })
        .y(function (d) { return y(d[line_id]); });       //$(#sensor_id).html()

    svg.append("path")
        .datum(raw_data)
        .attr("class", "line")
        .attr("d", line)
        .attr("id", "line")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		
		
    //  Add circles on top of the line 		

		
		if (window_link == 1)
		{
		svg.selectAll(".dot")
        .data(raw_data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2) //radius
        .attr("cx", function (d) { return x(d["seq_id"]); })
        .attr("cy", function (d) { return y(d[line_id]); })
        .attr("opacity", 1)
        .style("fill", "steelblue" )   //color
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  .on("mouseover", function (d) {
		            d3.select(this).style("cursor", "pointer");

			      //  d3.select("#window").html("Showing scores for window " + d["seq_id"]);
			        d3.select("#window").dispatch('change');
/*            if (link_id != "") {
        
             focus_id = d.data.id;
			// console.log(focus_id);
				
			 d3.select("#link_" + link_id).html(focus_id);
             d3.select('#link_' + link_id).dispatch('change');


                //select all linked scatter plots
                var svg1 = d3.selectAll("." + link_id + ".scatter_plot");
                
                // trigger event to change linked line charts (if they exist)
                d3.selectAll('.' + link_id + '.line_chart').dispatch('change_y_var', '{ detail: { focus_id } }');             
               
            } */

        });
		}

		// Add chart title
	
	if (title!=="")
	{	
		g.append("text")
        .attr("x", (width / 2))  
        .attr("class", "title")		
        .attr("y", 0 - (margin.top / 2)+5)
        .attr("text-anchor", "middle")  
       // .style("font-size", "16px") 
        .text(title);
	}

		
}

function mNav_spc_chart(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var cl = args.cl || null;
    var sd = args.sd || null;
    var bg = args.bg || 'na';
    var robust = args.robust || false;
    var trimmed = args.trimmed || null;

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

    // Calculating cl 
    if (cl === null) {
        if (robust) { cl = d3.median(data, function (d) { return d[y_ds]; }); }
        else { cl = d3.mean(data, function (d) { return d[y_ds]; }); }
    }

    // Calculating sd 
    if (sd === null) {
        if (robust) { sd = mad(ds_col_to_array(data, y_ds)); }
        else { sd = d3.deviation(data, function (d) { return d[y_ds]; }); }
    }

    // Calculating sd 
    if (trimmed != null) {
        var trimmed_array = [];
        for (var i = 0; i < data.length; i++) {
            trimmed_array.push(+data[i][y_ds]);
        }
        trimmed_array = trimmed_array.sort(d3.ascending);
        trimmed_array = trimmed_array.slice(Math.floor(trimmed_array.length * (1 - trimmed) / 2), Math.floor(trimmed_array.length - trimmed_array.length * (1 - trimmed) / 2));
        cl = d3.mean(trimmed_array);
        sd = d3.deviation(trimmed_array);  //Todo !!!!!!!!!!!!!  control limits as parameter
    }

    //if (sd == 0)
    //   { data = data.filter(function (d) { return d[y_ds] > cl*0.9 && d[y_ds] < cl*1.1; }); }
    //else
    //   { data = data.filter(function (d) { return d[y_ds] > cl - 10 * sd && d[y_ds] < cl + 10 * sd; }); }

    var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
    var colors = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837']
    var color = d3.scaleOrdinal().range(colors);

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    var svg = d3.select("#" + chart).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
    y.domain([d3.min([d3.min(data, function (d) { return d[y_ds]; }), cl - 4.5 * sd]), d3.max([d3.max(data, function (d) { return d[y_ds]; }), cl + 4.5 * sd])]).nice();

    var gX = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
      //  .ticks(d3.time.minutes, 15)
      //.tickFormat(d3.time.format("%H:%M"))
        .call(d3.axisBottom(x));

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));
    //.append("text")
    //  .attr("class", "axis-title")
    //  .attr("transform", "rotate(-90)")
    //  .attr("y", 6)
    //  .attr("dy", ".71em")
    //  .style("text-anchor", "end")
    //  .text("Temp (C)");

    if (bg == 'bg1') {

        // Defining zone ranges
        var l3 = cl - 3 * sd;
        var l2 = cl - 2 * sd;
        var l1 = cl - sd;
        var c = cl;
        var u3 = cl + 3 * sd;
        var u2 = cl + 2 * sd;
        var u1 = cl + sd;

        spc_height = y(l2) - y(l1);
        spc_width = x(d3.max(data, function (d) { return d[x_ds]; }));

        //Adding zones
        //l3
        {
            svg.append("rect")
               .attr("x", x(0))
               .attr("y", y(l2))
               .attr("width", spc_width)
               .attr("height", spc_height)
               .style("opacity", 0.2)
               .style("fill", "#addd8e"); // #E7D4BD

            //l2
            svg.append("rect")
               .attr("x", x(0))
               .attr("y", y(l1))
               .attr("width", spc_width)
               .attr("height", spc_height)
               .style("opacity", 0.4) 
               .style("fill", "#addd8e");  //#D3DFB7 #F5F3C7

            //l1
            svg.append("rect")
               .attr("x", x(0))
               .attr("y", y(c))
               .attr("width", spc_width)
               .attr("height", spc_height)
               .style("opacity", 0.7)
               .style("fill", "#addd8e"); //#DBE6C3

            //u3
            svg.append("rect")
               .attr("x", x(0))
               .attr("y", y(u3))
               .attr("width", spc_width)
               .attr("height", spc_height)
               .style("opacity", 0.2)
               .style("fill", "#addd8e"); //#E7D4BD

            //u2
            svg.append("rect")
               .attr("x", x(0))
               .attr("y", y(u2))
               .attr("width", spc_width)
               .attr("height", spc_height)
               .style("opacity", 0.4)
               .style("fill", "#addd8e"); //#D3DFB7 #F5F3C7

            //u1
            svg.append("rect")
               .attr("x", x(0))
               .attr("y", y(u1))
               .attr("width", spc_width)
               .attr("height", spc_height)
               .style("opacity", 0.7)
               .style("fill", "#addd8e"); //#BACBA4 #DBE6C3
        }
    }

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", 0.8)
        .style("fill", function (d) {
            if ((d[y_ds] < cl - 3.2 * sd) || (d[y_ds] > cl + 3 * sd))
            { return colors[2]; }   //
            else
            { return "black"; }  //colors[7]
        })
    .on("mouseover", function (d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", .9);

        tooltip.html("x: " + d[x_ds] + "<br/>y: " + d[y_ds])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
        tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    })
    .on("click", function (d) {
    });

    //Add center line
    var ss = svg.append("line")
     .attr("x1", x(d3.min(data, function (d) { return d[x_ds]; })))
     .attr("y1", y(cl))
     .attr("x2", x(d3.max(data, function (d) { return d[x_ds]; })))
     .attr("y2", y(cl))
      .attr("stroke-width", 2)
  .attr("stroke", "gray");

    //Add UCL
    var ss = svg.append("line")
     .attr("x1", x(d3.min(data, function (d) { return d[x_ds]; })))
     .attr("y1", y(cl + 3 * sd))
     .attr("x2", x(d3.max(data, function (d) { return d[x_ds]; })))
     .attr("y2", y(cl + 3 * sd))
      .attr("stroke-width", 2)
  .attr("stroke", "gray");

    //Add LCL
    var ss = svg.append("line")
     .attr("x1", x(d3.min(data, function (d) { return d[x_ds]; })))
     .attr("y1", y(cl - 3 * sd))
     .attr("x2", x(d3.max(data, function (d) { return d[x_ds]; })))
     .attr("y2", y(cl - 3 * sd))
      .attr("stroke-width", 2)
  .attr("stroke", "gray");

}


function mNav_bubbles(args) {

    var chart = args.chart;
    var data = args.data;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var radius = args.radius || "median"; //Object.keys(data[0][0]);
    var on_click_link = args.on_click_link || null;
    var link_id = args.link_id || null;
    var colors = args.colors || d3.scaleOrdinal(d3.schemeCategory10);
    var attributes = args.attributes || Object.keys(data[0]);
		
	
    //  var add_text = args.add_text || false;


    var diameter = 360,
    format = d3.format(",d");
    //   var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var color = d3.scaleOrdinal()
            .range(d3.schemeCategory20);
			
	var color1 = d3.scaleLinear()
                  .domain([40, 45, 50, 55, 60, 65, 70])
                  .range(['#1a9850', '#66bd63', '#a6d96a', '#fdae61', '#f46d43', '#d73027', '#d73027'])
                  .interpolate(d3.interpolateHcl); 	

	var color_att = "median";
				  
    var color2 = d3.scaleSequential(d3.interpolateGreens)
    	.domain(d3.extent(data, function (d) { return d[color_att]; }));				  
    
	
	// Add drop downs
	d3.select("#" + chart).append("p").text("radius: ").style("display", "inline");
    var select =  d3.select("#" + chart).append("select").attr("id", "radius").style("display", "inline");
  
    var options = select.selectAll('option')
        .data(attributes).enter()
        .append('option')
            .text(function (d) { return d; });
			
	d3.select("#" + chart).append("p").text("color: ").style("display", "inline");	
	select =  d3.select("#" + chart).append("select").attr("id", "color").style("display", "inline");
  
    options = select.selectAll('option')
        .data(attributes).enter()
        .append('option')
            .text(function (d) { return d; });	
	

    d3.select("#" + chart).append("div").attr("id", "bubbles");	
	

    var checkOption = function (e) {
        if (e === radius) {
            return d3.select(this).attr("selected", "selected");
        }
    };

    select.selectAll("option").each(checkOption);

  
    var bubble = d3.pack()
                 .size([width,height])  // diameter, diameter//
                 .padding(1.5);

    var svg = d3.select("#bubbles").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bubble");



    var xx = { "children": data };

    var root = d3.hierarchy(xx)
          .sum(function (d) { return d[radius]; })
          .sort(function (a, b) { return b[radius] - a[radius]; });
    bubble(root);

    //console.log("root.children");
    //console.log(root.children);

    var node = svg.selectAll(".node")
        .data(root.children)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
      .text(function (d) { return d.id; });

    node.append("circle")
      .attr("r", function (d) { return d.r; })
      .style("fill", function (d) {
        //  return    "blue"//d.data.color;  //color(d.data.Active)  
		  
          return color2(d.data.median);
      }) 
        .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
			
			
           if (link_id != "") {

               
             focus_id = d.data.id;
			// console.log(focus_id);
				
			 d3.select("#link_" + link_id).html(focus_id);
             d3.select('#link_' + link_id).dispatch('change');


                //select all linked scatter plots
                var svg1 = d3.selectAll("." + link_id + ".scatter_plot");
                
                // trigger event to change linked line charts (if they exist)
                d3.selectAll('.' + link_id + '.line_chart').dispatch('change_y_var', '{ detail: { focus_id } }');             
               
            }
       // })
	 
	       //  .on("mouseover", function (d) {
				
		//	if (link_id != "") {


        });
	 

  //  .on('click', function(d) {
  //      on_click_link = "tag.html?tag_id="
   //     link = on_click_link + d.data.id;
    //    console.log(link);
   //     window.open(
   //       link,
   //       '_blank' 
    //    );
   // });


    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function (d) { if (d.r > 18) { return d.data.id } else { return "" }; })
      .style("font-size", function (d) {
          if (d.r > 50) { return "36px" } else {
              if (d.r > 30) { return "26px" } else {
                  if (d.r > 20) { return "18px" } else { return "12px" }
              }
          };
      })
/*         .on('click', function (d) {
            on_click_link = "tag.html?tag_id="
            link = on_click_link + d.data.id;
            console.log(link);
            window.open(
              link,
              '_blank'
            );
        }) */
        .on("mouseover", function () {
            d3.select(this).style("cursor", "pointer");
        });


    // Range selection change event
    d3.select("#radius").on("change", function () {
        // console.log("radius_change");
		// console.log(data);
		
		color_att = d3.select("#color").property("value");
		//console.log("extent");
		//console.log(d3.extent(d.data, function (d) { return d[color_att]; }));
		
        size = d3.select("#radius").property("value");
        xx = { "children": data };

        var root1 = d3.hierarchy(xx)
               .sum(function (d) { return d[size]; })
               .sort(function (a, b) { return b[size] - a[size]; });
        bubble(root1);

        node
      .data(root1.children)
        .transition()
         .duration(750)
         .ease(d3.easeLinear)
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.selectAll('circle')
            .data(function (d) { return [d]; });

        node.selectAll('circle')
             .transition()
             .duration(750)
             .ease(d3.easeLinear)
             .attr("r", function (d) { return d.r; })
         .style("fill", function (d) {
             return color2(d.data[color_att]); 
         })
        ;

        node.selectAll('text')
                .data(function (d) { return [d]; });

        node.selectAll("text")
            .transition()
             .duration(750)
             .ease(d3.easeLinear)
      .text(function (d) { if (d.r > 18) { return d.data.id } else { return "" }; })
      .style("font-size", function (d) {
          if (d.r > 50) { return "36px" } else {
              if (d.r > 30) { return "26px" } else {
                  if (d.r > 20) { return "18px" } else { return "12px" }
              }
          };
      });
    });

	d3.select("#color").on("change", function () {
        // console.log("radius_change");
		// console.log(data);
		
		color_att = d3.select("#color").property("value");
		
		color2 = d3.scaleSequential(d3.interpolateGreens)
    	.domain(d3.extent(data, function (d) { return d[color_att]; }));				  
    
		
        size = d3.select("#radius").property("value");
        xx = { "children": data };

        var root1 = d3.hierarchy(xx)
               .sum(function (d) { return d[size]; })
               .sort(function (a, b) { return b[size] - a[size]; });
        bubble(root1);

        node
      .data(root1.children)
        .transition()
         .duration(750)
         .ease(d3.easeLinear)
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.selectAll('circle')
            .data(function (d) { return [d]; });

        node.selectAll('circle')
             .transition()
             .duration(750)
             .ease(d3.easeLinear)
             .attr("r", function (d) { return d.r; })
         .style("fill", function (d) {
             return color2(d.data[color_att]); //color(d.data.Active);
         })
        ;

        node.selectAll('text')
                .data(function (d) { return [d]; });

        node.selectAll("text")
            .transition()
             .duration(750)
             .ease(d3.easeLinear)
      .text(function (d) { if (d.r > 18) { return d.data.id } else { return "" }; })
      .style("font-size", function (d) {
          if (d.r > 50) { return "36px" } else {
              if (d.r > 30) { return "26px" } else {
                  if (d.r > 20) { return "18px" } else { return "12px" }
              }
          };
      });
    });


    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) { recurse(node.name, child); });
            else classes.push({ packageName: name, className: node.name, value: node.size });
        }

        recurse(null, root);
        return { children: classes };
    }


}



function mNav_heatmap(args) {

	  // ====== variables ======
        {
            var chart = args.chart;
            var data = args.data;

            var margin = args.margin || { top: 65, right: 15, bottom: 15, left: 65 };
            var cm = args.cm || false;
            var colorRange = args.colorRange || ['#d73027', '#e0e0e0', '#4575b4'];  //blue, red  white
            var colorDomain = args.colorDomain || [-20, 0, 20];
            var na_color = args.na_color || "#bdbdbd";

            var cell_link_id = args.cell_link_id || "";                            // Activate linked chart
            var p_link_id = args.p_link_id || "";                            // Activate linked chart
            var n_link_id = args.n_link_id || "";                            // Activate linked chart

            var height = args.height || width / 1.618;
            var width = args.width || 500;

            width = width - margin.left - margin.right,
            height = height - margin.top - margin.bottom;

        }

		
		console.log(colorRange);
		console.log(colorDomain);
		
    data.forEach(function (d) {                             //Todo - configurable date field              //date
        Object.keys(data[0]).filter(function (k) { return k != "id" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

   //   console.log("data");
   //  console.log(data);
  
    //x lables
    var variables = Object.keys(data[0]).filter(function (k) { return k != "id" }); //data.keys();   
   
 //  console.log(width );
 //  console.log(height );
   //y lables
    if (cm)
    {
        var ids = variables;                           
    }
    else {
                
        var ids = [];              

            for (var i = 0; i < data.length; i++) {
                ids.push(data[i]["id"]);
            }
    }

	
    var cell_width = parseInt(width / variables.length,10),
        cell_height = parseInt(height / ids.length,10);
 
     //console.log("cell_width - " + cell_width);
     //console.log("cell_height - " + cell_height);

     var x = d3.scaleBand()
        .domain(variables)
        .rangeRound([0, cell_width * variables.length]);
             // .padding(0.1);

    var y = d3.scaleBand()
        .domain(ids)
        .rangeRound([0,cell_height * ids.length]);
             // .padding(0.1);

    // change wide data to long data
    var long_data = [];

    data.forEach(function (row) {
        Object.keys(row).forEach(function (colname) {
            if (colname == "id" || colname == "Value") {
                return
            }
            long_data.push({ "id": row["id"], "variable": colname, "value": row[colname] });
        });    
    });

    data = long_data;

    var color = d3.scaleLinear().range(colorRange);

    if (cm)
    { color.domain([-1, 0, 1]); }
    else 
	{ color.domain(colorDomain);
      console.log("here");
        }

  //  console.log(colorDomain);
   // console.log(data);
   
       var svg = d3.select("#" + chart).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   var column = svg.selectAll(".column")
    .data(variables)
    .enter().append("g")
    .attr("class", "column")
    .attr("transform", function (d, i) { return "translate(" + (i * cell_width + 10) + ")rotate(-90)"; });

	column.append("text")
    .attr("x", function (d, i) { return cell_width/2; })
    .attr("y", 0)
    .attr("dy", ".32em")
    .attr("text-anchor", "middle")
    .text(function (d) { return d; });
   // .on("click", function (d) {
    //    if (p_link_id != "") {
    //        focus_id = d;
      //      d3.selectAll("." + p_link_id + ".scatter_plot").dispatch('change_y_var', { detail: { focus_id } });  
     //   }
    //});
	{	
	var id_Labels = svg.selectAll(".dayLabel")
    .data(ids)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * cell_height; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + cell_height + ")");
// .on("click", function (d) {
  //   if (n_link_id != "") {

    //     focus_id = d;
    //     d3.selectAll("." + n_link_id + ".scatter_plot").dispatch('change_y_var', { detail: { focus_id } });
     //    d3.selectAll("." + n_link_id + ".bar_chart").dispatch('change_y_var', { detail: { focus_id } });
     //    d3.selectAll("." + n_link_id + ".functional_box_plot").dispatch('change_y_var', { detail: { focus_id } });
   //  }
// });

    svg.selectAll(".rect")
        .data(data)
        .enter().append("rect")
        .attr("width", cell_width)
        .attr("height", cell_height)
        .attr("x", function (d) { return x(d.variable); })
        .attr("y", function (d) { return y(d.id); })
        .style("fill", function (d) {
            if (d.value == "") { 
			console.log("d.value is na");
			return na_color }
            else { 
			//console.log("color(d.value)");
			//console.log(color(d.value));
			return color(d.value); }
        });
      //   .on("mouseover", function (d) {
      //       if (cell_link_id != "") {
      //           focus_id = d["variable"];
      //           x_id = d["id"];
      //           d3.selectAll("." + cell_link_id + ".scatter_plot").dispatch('change_xy_var', { detail: { focus_id, x_id } });
      //       }
      //   });

	}
}


function mNav_heatmap_scatter(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;

    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };

    var color = args.color || "#1f78b4";
    var radius = args.radius || 4;
    var opacity = args.opacity || 0.5;

    var link_id = args.link_id || "";                    // Activate linked chart

    width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    
    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

    {
        var x = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
        y.domain(d3.extent(data, function (d) { return d[y_ds]; })).nice();

        var xAxis = d3.axisBottom(x).ticks(12),
            yAxis = d3.axisLeft(y).ticks(12 * height / width);
    }

    var svg = d3.select("#" + chart)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", chart + "_svg");

    if (link_id != "") {
        svg.attr("class", link_id + " scatter_plot");
    }

    // add x and y axis
    {
        svg.append("g")
            .attr("class", "axis ")
            .attr('id', "axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(x_ds);

        svg.append("g")
            .attr("class", "axis")
            .attr('id', "axis--y")
            .call(yAxis)
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(y_ds);

    }

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", radius)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", opacity)
        .style("fill", color)
        .on("mouseover", function (d) {
           // if (linked)
              //  {
             //      
               // }
				
			if (link_id != "") {

			
                //TODO: check if there is an object with id=link_id. If yes, change the html to the focus_id
                //   d3.select("#" + link_id).html(d["id"]);

                focus_id = d["id"];
				
			 d3.select("#link_" + link_id).html(focus_id);
             d3.select('#link_' + link_id).dispatch('change');


                //select all linked scatter plots
                var svg1 = d3.selectAll("." + link_id + ".scatter_plot");
                //svg1.each(function (d) {console.log(d3.select(this).attr('id')); });

                // trigger event to change linked line charts (if they exist)
                d3.selectAll('.' + link_id + '.line_chart').dispatch('change_y_var', '{ detail: { focus_id } }');
             //   d3.selectAll('.' + link_id + '.line_chart').dispatch('change_y_var', { detail: { focus_id } });

               
                svg1.selectAll('circle')
                    .transition()
                    .duration(150)
                    .ease(d3.easeLinear)
                    .style("fill", function (d) {
                        if (d.id == focus_id) { return "red" }
                        else { return color };
                    })
                    //.style("stroke", function (d) {
                    //    if (d.id == focus_id) {return "#2166ac"
                    //    } else {
                    //        if (d.grade_auto == "Good") { return "#1a9850" } else { if (d.grade_auto == "tbd") { return "#fdae61" } else { return "#d73027" } }
                    //    };
                    //})
                    .attr("r", function (d) {
                        if (d.id == focus_id) {
                            this.parentElement.appendChild(this);
                            return "10"
                        }
                        else { return "4" };
                    })
                //.attr("fill-opacity", function (d) {
                //    if (d.id == focus_id) { return "1"}
                //    else {
                //        return "0.3"
                //    };
                //})

            }
        });
}


//==========================================================================
function cl(cl_object, note) {
    console.log(note);
    console.log(cl_object);
}