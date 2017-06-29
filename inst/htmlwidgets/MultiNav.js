

HTMLWidgets.widget({
    name: 'MultiNav',
    type: 'output',
    initialize: function (el, width, height) {
        return {};
    },

    renderValue: function (el, xin, instance) {

        instance.xin = xin;

        // draw the graphic
        this.drawGraphic(el, xin, el.offsetWidth, el.offsetHeight);
    },
    drawGraphic: function (el, xin, width, height) {
        // remove existing children
        while (el.firstChild) el.removeChild(el.firstChild);

        var size = d3.min([width, height]);
        var w = size,
        h = size,
        rx = w / 2,
        ry = h / 2,
        m0,
        rotate = 0;


        var ds = HTMLWidgets.dataframeToD3(xin.data);
        var ds_raw = HTMLWidgets.dataframeToD3(xin.raw_data);

        if (xin.q_data == null)
        { var q_data = null; }
        else { 
        var q_data = HTMLWidgets.dataframeToD3(xin.q_data);
        }
        //===============================================================================
        // Basic charts
        //===============================================================================

        // 1) Line chart
        if (xin.chart_type == "line") {
             // console.log(ds);
              mNav_Line_chart({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height });
          }

        // 2) Scatter plot
        if (xin.chart_type == "scatter") {
            if (xin.link_id == null)
            {
                mNav_scatter_plot({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height});
 }
            else {
                mNav_scatter_plot({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height, link_id: xin.link_id, linked: true });
  
            }

            //  if (width > 120 && height > 80) {
            //  }
             // else { el.innerHTML = "<div id='xxx'>Window too small</div>"; }
          }

        // 3) network force plot
          if (xin.chart_type == "network") {
              mNav_force({
              data: ds, chart: el.id, width: width, height: height,
              radius: 3, charge: -10
          });

          }


        // 4) spc chart plot
          if (xin.chart_type == "spc") {
              mNav_spc_chart({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height });
              //console.log(ds);
          }

        // 5) functional box plot
          if (xin.chart_type == "functional_box_with_line") {
              mNav_functional_box_plot_with_line({ data: ds, ds_raw: ds_raw, chart: el.id, width: width, height: height, line_id: xin.line_id });
               
              //console.log(ds);
          }

          // 5) functional box plot
          if (xin.chart_type == "functional_box") {
              mNav_functional_box_plot({ data: ds, chart: el.id, width: width, height: height });

              //console.log(ds);
          }

        //===============================================================================
        // Linked charts
        //===============================================================================

        // Scatter with linked line chart
          if (xin.chart_type == "scatter_and_linked_line") {

              var id = xin.link_id   
              el.innerHTML = "<div id='link_"+ id + "'>link_"+ id +"</div><div id='" + id + "'></div>";

              mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: xin.x_var, y_ds: xin.y_var,
                  width: width, height: 2 * height / 3, linked: true
              });

              d3.select("#link_" + id).on("change", function () {
                  d3.select("#" + id).html("");

                  if (q_data == null) {
                      mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })
                  }
                  else
                      {
                      mNav_functional_box_plot_with_line({
                          data: q_data, ds_raw: ds_raw, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      });
                      
                  }
              });

          }
       


        // Network with linked line chart
          if (xin.chart_type == "network_and_linked_line") {

              var id = xin.link_id 
              el.innerHTML = "<div id='link_" + id + "'>link_" + id + "</div><div id='" + id + "'></div>";

            //  el.innerHTML = "<div id='p_id'>p_id</div><div id='g1'></div>";

              mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              mNav_force({
                  data: ds, chart: el.id, link_id: id, width: width, height: 2* height/3, linked: true,
                  radius: 3, charge: -10
              });


              d3.select("#link_" + id).on("change", function () {
                  d3.select("#" + id).html("");

                  if (q_data == null) {
//                      mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })
                        mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })

                  }
                  else {
                      mNav_functional_box_plot_with_line({
                          data: q_data, ds_raw: ds_raw, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      });

                  }
              });



              //d3.select("#p_id").on("change", function () {
              //    d3.select("#g1").html("");
              //    mNav_Line_chart({ data: ds_raw, chart: "g1", x_ds: "seq_id", y_ds: d3.select("#p_id").html(), width: width, height: height / 3 })
              //});

          }


        //===============================================================================
        // Review next
        //===============================================================================
          if (xin.chart_type == "box_plot") {
              mNav_box_plot({ data: ds, chart: el.id, values: xin.data["x"], width: width, height: height });
          }

          if (xin.chart_type == "hist_dist") {
              mNav_hist_dist({ chart: el.id, values: xin.data["x"], width: width, height: height });
          }

    },

    resize: function (el, width, height, instance) {
        if (instance.xin) {
            this.drawGraphic(el, instance.xin, width, height);
        }
    }
});