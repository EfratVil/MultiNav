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

    //    var x = d3.time.scale()
    //     .range([0, width]);

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
       // .style("fill", function (d) { if (d.grade_auto == "Outlier") { return "Red" } else { if (d.grade_auto == "tbd") { return "Orange" } else { return "Green" } } }) //color
    }  
}

function mNav_scatter_plot(args) {

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
                }
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
   // var x_ds = args.x_ds;
   // var y_ds = args.y_ds;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var height = args.height || width / 1.618;
  //  var color = args.color || "#1f78b4";
   // var linked = args.linked || false;                    // Activate linked chart

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    ////tooltip
    //var tooltip = d3.select("body").append("div")
    //               .attr("class", "tooltip")
    //               .style("opacity", 0);

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

    var keys = [Object.keys(quantiles[1])[1], Object.keys(quantiles[1])[2], Object.keys(quantiles[1])[3], Object.keys(quantiles[1])[4], Object.keys(quantiles[1])[5]];

    x.domain(d3.extent(quantiles, function (d) { return d.seq_id; }));
    y.domain([d3.min(quantiles, function (d) { return d.quantile_02; }), d3.max(quantiles, function (d) { return d.quantile_98; })]);
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

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));

}

//!!!!!!!!!!!!!!! missing in orig
function mNav_functional_box_plot_with_line(args) {

    var chart = args.chart;
    var quantiles = args.data;
    var raw_data = args.ds_raw;
    var line_id = args.line_id || 21989;
    // var x_ds = args.x_ds;
    // var y_ds = args.y_ds;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var height = args.height || width / 1.618;
    //  var color = args.color || "#1f78b4";
    // var linked = args.linked || false;                    // Activate linked chart

    width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    ////tooltip
    //var tooltip = d3.select("body").append("div")
    //               .attr("class", "tooltip")
    //               .style("opacity", 0);

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

    var keys = [Object.keys(quantiles[1])[1], Object.keys(quantiles[1])[2], Object.keys(quantiles[1])[3], Object.keys(quantiles[1])[4], Object.keys(quantiles[1])[5]];

    x.domain(d3.extent(quantiles, function (d) { return d.seq_id; }));
    y.domain([d3.min(quantiles, function (d) { return d.quantile_02; }), d3.max(quantiles, function (d) { return d.quantile_98; })]);
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

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));


    var line = d3.line()
        .x(function (d) { return x(d["seq_id"]); })
        .y(function (d) { return y(d[line_id]); });       //$(#sensor_id).html()

    svg.append("path")
        .datum(raw_data)
        .attr("class", "line")
        .attr("d", line)
        .attr("id", "line")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



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


//==========================================================================
function cl(cl_object, note) {
    console.log(note);
    console.log(cl_object);
}