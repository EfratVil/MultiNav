

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

		// load data sets
		{
		
        if (xin.q_data == null)
        { var q_data = null; }
        else { 
        var q_data = HTMLWidgets.dataframeToD3(xin.q_data);
        }
		
		if (xin.quantiles == null)
        { var quantiles = null; }
        else { 
        var quantiles = HTMLWidgets.dataframeToD3(xin.quantiles);
        }
		
		if (xin.quantiles_cum == null)
        { var quantiles_cum = null; }
        else { 
        var quantiles_cum = HTMLWidgets.dataframeToD3(xin.quantiles_cum);
        }
		
		
		if (xin.quantiles_diff == null)
        { var quantiles_diff = null; }
        else { 
        var quantiles_diff = HTMLWidgets.dataframeToD3(xin.quantiles_diff);
        }
		
		if (xin.quantiles_diff_diff == null)
        { var quantiles_diff_diff = null; }
        else { 
        var quantiles_diff_diff = HTMLWidgets.dataframeToD3(xin.quantiles_diff_diff);
        }
		
		if (xin.scores == null)
        { var scores = null; }
        else { 
        var scores = HTMLWidgets.dataframeToD3(xin.scores);
        }
		
		// "sliding scores" data sets
		
		
		
	    if (xin.last_scores == null)
        { var last_scores = null; }
        else { 
        var last_scores = HTMLWidgets.dataframeToD3(xin.last_scores);
        }
		
		
		if (xin.quantiles_s1 == null)
        { var quantiles_s1 = null; }
        else { 
        var quantiles_s1 = HTMLWidgets.dataframeToD3(xin.quantiles_s1);
        }
		
				
		if (xin.quantiles_s2 == null)
        { var quantiles_s2 = null; }
        else { 
        var quantiles_s2 = HTMLWidgets.dataframeToD3(xin.quantiles_s2);
        }
		
					
		if (xin.quantiles_s3 == null)
        { var quantiles_s3 = null; }
        else { 
        var quantiles_s3 = HTMLWidgets.dataframeToD3(xin.quantiles_s3);
        }
		
				
		if (xin.quantiles_s4 == null)
        { var quantiles_s4 = null; }
        else { 
        var quantiles_s4 = HTMLWidgets.dataframeToD3(xin.quantiles_s4);
        }
		
	    if (xin.score1_wide == null)
        { var score1_wide = null; }
        else { 
        var score1_wide = HTMLWidgets.dataframeToD3(xin.score1_wide);
        }
			
		if (xin.score2_wide == null)
        { var score2_wide = null; }
        else { 
        var score2_wide = HTMLWidgets.dataframeToD3(xin.score2_wide);
        }
		
        if (xin.score3_wide == null)
        { var score3_wide = null; }
        else { 
        var score3_wide = HTMLWidgets.dataframeToD3(xin.score3_wide);
        }
					
		if (xin.score4_wide == null)
        { var score4_wide = null; }
        else { 
        var score4_wide = HTMLWidgets.dataframeToD3(xin.score4_wide);
        }
			
		}
        //===============================================================================
        // Basic charts
        //===============================================================================
		{
        // 1) Line chart
        if (xin.chart_type == "line") {
             // console.log(ds);
              mNav_Line_chart({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height });
          }


        // 2) Scatter plot
        if (xin.chart_type == "scatter") {
            if (xin.link_id == null) {
                mNav_scatter_plot({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height });
            }
            else {
                mNav_scatter_plot({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height, link_id: xin.link_id, linked: true });

            }

            //  if (width > 120 && height > 80) {
            //  }
            // else { el.innerHTML = "<div id='xxx'>Window too small</div>"; }
        }

        // 2) Flex Scatter uni
        if (xin.chart_type == "flex_scatter_uni") {
            if (xin.link_id == null)
            {
                mNav_flex_scatter_uni({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height});
 }
            else {
                mNav_flex_scatter_uni({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height, link_id: xin.link_id, linked: true });
  
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
              mNav_functional_box_plot({ data: ds, chart: el.id, width: width, height: height, median_color: xin.median_color });
          }
		  
          // 5) Bubbles
          if (xin.chart_type == "bubbles") {
			  
			  var id = xin.link_id   
              el.innerHTML = "<div id='link'>";
			  el.innerHTML = el.innerHTML + "<a href='#' id='btn_update' class='btn btn-LightBlue'>Update</a><br/>";
			  el.innerHTML = el.innerHTML + "Add here linked line charts</div><br/>";
	 
		 
              mNav_bubbles({ data: ds, chart: el.id, width: width, height: 3* height / 4 });

              //console.log(ds);
          }
		
			  
		  if (xin.chart_type == "heatmap") {
            if (xin.link_id == null) {
                mNav_heatmap({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height, colorRange: JSON.parse(xin.colorRange), colorDomain: JSON.parse(xin.colorDomain),cm: xin.cm });
            }
            else {
                mNav_heatmap({ data: ds, chart: el.id, x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: height, cm: xin.cm, colorRange:  JSON.parse(xin.colorRange), colorDomain: JSON.parse(xin.colorDomain), link_id: xin.link_id, linked: true });

            }           
          }

		}
		  	   
        //===============================================================================
        // Linked charts
        //===============================================================================
		{
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
	   
		  if (xin.chart_type == "scatter_and_linked_line1") {

              var id = xin.link_id   
              el.innerHTML = "<div id='link_"+ id + "'>link_"+ id +"</div><div id='" + id + "'></div>";

              mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              
			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.y_var,
                  width: width/2, height: 2 * height / 3, linked: true
              });

			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.x_var,
                  width: width/2, height: 2 * height / 3, linked: true
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
	      
		  if (xin.chart_type == "scatter_and_linked_line2") {

              var id = xin.link_id   
			  var pointer= 0;
			  if (!!xin.window) // if window is provided. Need to show on click - the score history of each sensor.  
				 {pointer= 1}
			  
			 function draw_scores() {
			 
			  
              el.innerHTML = "<div id='link_"+ id + "'>link_"+ id +"</div><div id='" + id + "'></div>";

              mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              
			 // console.log("xin.dim_scores");
			 // console.log(xin.dim_scores);
			  
			  if (xin.dim_scores>=4)
			  {
			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s1,  //y_var
                  pointer: pointer, width: width/2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s2,  //x_var
                  pointer: pointer, width: width/2, height: 2 * height / 6, linked: true
              });

			  
			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s3,
                  pointer: pointer, width: width/2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s4,
                  pointer: pointer, width: width/2, height: 2 * height / 6, linked: true
              });
			  }
			  
			  else if (xin.dim_scores==3)
				  
			  {
				   mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s1,  //y_var
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s2,  //x_var
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  
			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s3,
                  width: width/2, height: 2 * height / 6, linked: true
              });

			 
			  }
			  
			  else if (xin.dim_scores==2)
				  
			  {
				  mNav_scatter_plot({
					  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s1,  //y_var
					  width: width/2, height: 2 * height / 3, linked: true
				  });

				  
				  mNav_scatter_plot({
					  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s2,
					  width: width/2, height: 2 * height / 3, linked: true
				  });

			  }
			  else if (xin.dim_scores==1)
				  
			  			  {
			  mNav_scatter_plot({
                  data: ds, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s1,  //y_var
                  width: width, height: 2 * height / 3, linked: true
              });

			  
			

			  }
			 
			 
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
			 
			 if (!!xin.window) // if window is provided. Need to show on click - the score history of each sensor.  
				 
				 {
					 
					
			  d3.select("#link_" + id).on("click", function () {
              
			  
			  //  console.log("Focus id...");
			  //  console.log(d3.select("#link_" + id).html());	
			   var focus_id = d3.select("#link_" + id).html();
			  // console.log("window");
			  // console.log(xin.window);
			   
			   
			   d3.select("#" + id).html("");
	
			   
			   el.innerHTML = "";
			   el.innerHTML = el.innerHTML +  "<div style='display: inline; width:" + width/3 + "px' id='window'>Showing scores for window 12</div>"; 
	           el.innerHTML = el.innerHTML +  "<button id='btn_back' type='button' style='padding:1px' class='btn btn- info btn- sm'>Back</button>&nbsp;&nbsp;&nbsp;&nbsp;"
	 
	 		   

	 
	           el.innerHTML = el.innerHTML +  "<div class='row'>";
	           el.innerHTML = el.innerHTML +  "<div class='col-sm-6' id='bubble_chart'></div>";

			   el.innerHTML = el.innerHTML +  "<div id='link_"+ id + "'>"+ focus_id +"</div><div id='" + id + "'></div>";
	           el.innerHTML = el.innerHTML +  "</div>";
  	           el.innerHTML = el.innerHTML +  "<div class='row'>";
	           el.innerHTML = el.innerHTML +  "<div class='col-sm-12' id='scores'></div>";
	           el.innerHTML = el.innerHTML +  "</div>";
  

				    mNav_functional_box_plot_with_line({ data: quantiles_s1, ds_raw: score1_wide, ylbl: xin.s1, chart: "scores", width: width/2, height: (height / 4)-22, 
					pointer: 1, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
 					mNav_functional_box_plot_with_line({ data: quantiles_s2, ds_raw: score2_wide, ylbl: xin.s2, chart: "scores", width: width/2, height: (height / 4)-22, 
					pointer: 1, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
					mNav_functional_box_plot_with_line({ data: quantiles_s3, ds_raw: score3_wide, ylbl: xin.s3, chart: "scores", width: width/2, height: (height / 4)-22, 
					pointer: 1, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
					mNav_functional_box_plot_with_line({ data: quantiles_s4, ds_raw: score4_wide, ylbl: xin.s4, chart: "scores", width: width/2, height: (height / 4)-22, 
					pointer: 1, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id

	
              // mNav_functional_box_plot({ data: quantiles_s1, chart: "scores", ylbl: xin.s1, width: width/2, height: (height / 4)-22});
			  
			  // mNav_functional_box_plot({ data: quantiles_s2, chart: "scores", ylbl: xin.s2, width: width/2, height: (height / 4)-22 });
			  
			  // mNav_functional_box_plot({ data: quantiles_s3, chart: "scores", ylbl: xin.s3, width: width/2, height: (height / 4)-22 });
			  
			  // mNav_functional_box_plot({ data: quantiles_s4, chart: "scores", ylbl: xin.s4, width: width/2, height: (height / 4)-22 });
	
		 
              mNav_bubbles({ data: last_scores, chart: "bubble_chart", width: width/2, height: (height / 2)-20, link_id: id });
      
             
			 d3.select("#btn_back").on("click", function () {
   
			   el.innerHTML = "back";
	           draw_scores();
              });
				
              d3.select("#link_" + id).on("change", function () {
                   d3.select("#" + id).html("");
			       d3.select("#scores").html("");

	               //console.log(d3.select("#link_" + id).html());
	
					mNav_functional_box_plot_with_line({ data: quantiles_s1, ds_raw: score1_wide, ylbl: xin.s1, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
 					mNav_functional_box_plot_with_line({ data: quantiles_s2, ds_raw: score2_wide, ylbl: xin.s2, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
					mNav_functional_box_plot_with_line({ data: quantiles_s3, ds_raw: score3_wide, ylbl: xin.s3, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
					mNav_functional_box_plot_with_line({ data: quantiles_s4, ds_raw: score4_wide, ylbl: xin.s4, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
              }); 
				
	  });
				
				}
					
			else
			{//console.log("window is null");
		    }
			 
              } 

              draw_scores();
			 

			 

			 
			 

				
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
		  

	   }  	  
	    //===============================================================================
        // MultiNav Views
        //===============================================================================
		{
		  		  
		  if (xin.chart_type == "process scoring1") {
// Not working!!! tried with scores and quntiles and it didn't work
              var id = xin.link_id   
              el.innerHTML = "<div id='link_"+ id + "'>link_"+ id +"</div><div id='" + id + "'></div>";

              mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              
			  mNav_scatter_plot({
                  data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s1,  //y_var
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s2,  //x_var
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  
			  mNav_scatter_plot({
                  data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s3,
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s4,
                  width: width/2, height: 2 * height / 6, linked: true
              });
			  
              d3.select("#link_" + id).on("change", function () {
                  d3.select("#" + id).html("");

                  if (quantiles == null) {
                      mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })
                  }
                  else
                      {
                      console.log("got here");
					  console.log(quantiles);
					   console.log(ds);
					  mNav_functional_box_plot_with_line({
                          data: quantiles, ds: ds, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      });
                      
                  }
              });

          }
      
          if (xin.chart_type == "process scoring2") {
          // working with transfer....
              var id = xin.link_id   
              el.innerHTML = "<div id='link_"+ id + "'>link_"+ id +"</div><div id='" + id + "'></div>";

              mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              
			  
			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.y_var,
                  width: width/2-2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.x_var,
                  width: width/2-2, height: 2 * height / 6, linked: true
              });

			  
			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.y_var,
                  width: width/2-2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.x_var,
                  width: width/2-2, height: 2 * height / 6, linked: true
              });
			  
              d3.select("#link_" + id).on("change", function () {
                  d3.select("#" + id).html("");

                  if (q_data == null) {
                      mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })
                  }
                  else
                      {
                      mNav_functional_box_plot_with_line({
                          data: q_data, ds: ds_raw, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      });
                      
                  }
              });

          }
		     	  
		  if (xin.chart_type == "process scoring") {
          // working with transfer....
              var id = xin.link_id   
              el.innerHTML = "<div id='link_"+ id + "'>link_"+ id +"</div><div id='" + id + "'></div>";

              mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              
			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.y_var,
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.x_var,
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  
			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.y_var,
                  width: width/2, height: 2 * height / 6, linked: true
              });

			  mNav_scatter_plot({
                  data: ds_raw, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.x_var,
                  width: width/2, height: 2 * height / 6, linked: true
              });
			  
              d3.select("#link_" + id).on("change", function () {
                  d3.select("#" + id).html("");

                  if (q_data == null) {
                      mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })
                  }
                  else
                      {
                      mNav_functional_box_plot_with_line({
                          data: q_data, ds: ds_raw, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      });
                      
                  }
              });

          }			  
	
          // 5) sliding scores screen
          if (xin.chart_type == "sliding scores") {
              var id = xin.link_id   
              el.innerHTML = "";
			  el.innerHTML = el.innerHTML +  "<div style='display: inline; width:" + width/3 + "px' id='window'>Showing scores for window 12</div>";

			 // el.innerHTML = el.innerHTML +  "<div style='display: inline; width:300px;' id='bubble_chart'></div>";
			 // el.innerHTML = el.innerHTML +  "<div style='display: inline; width:100px;' id='sdf'>sdfsdf</div>";
			 // el.innerHTML = el.innerHTML +  "<div style='display: inline; width:300px;' id='scores'></div> <br/>";
	 
	 
	          el.innerHTML = el.innerHTML +  "<div class='row'>";
	          el.innerHTML = el.innerHTML +  "<div class='col-sm-6' id='bubble_chart'></div>";

			  el.innerHTML = el.innerHTML +  "<div id='link_"+ id + "'>link_"+ id +"</div><div id='" + id + "'></div>";
	          el.innerHTML = el.innerHTML +  "</div>";
  	          el.innerHTML = el.innerHTML +  "<div class='row'>";
	          el.innerHTML = el.innerHTML +  "<div class='col-sm-12' id='scores'></div>";
	          el.innerHTML = el.innerHTML +  "</div>";
  

	
	
              mNav_functional_box_plot({ data: quantiles_s1, chart: "scores", ylbl: xin.s1, width: width/2, height: (height / 4)-22});
			  
			  mNav_functional_box_plot({ data: quantiles_s2, chart: "scores", ylbl: xin.s2, width: width/2, height: (height / 4)-22 });
			  
			  mNav_functional_box_plot({ data: quantiles_s3, chart: "scores", ylbl: xin.s3, width: width/2, height: (height / 4)-22 });
			  
			  mNav_functional_box_plot({ data: quantiles_s4, chart: "scores", ylbl: xin.s4, width: width/2, height: (height / 4)-22 });
	
		 
              mNav_bubbles({ data: last_scores, chart: "bubble_chart", width: width/2, height: (height / 2)-20, link_id: id });
             
              
               d3.select("#link_" + id).on("change", function () {
                   d3.select("#" + id).html("");
			       d3.select("#scores").html("");

	               //console.log(d3.select("#link_" + id).html());
	
					mNav_functional_box_plot_with_line({ data: quantiles_s1, ds_raw: score1_wide, ylbl: xin.s1, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
 					mNav_functional_box_plot_with_line({ data: quantiles_s2, ds_raw: score2_wide, ylbl: xin.s2, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
					mNav_functional_box_plot_with_line({ data: quantiles_s3, ds_raw: score3_wide, ylbl: xin.s3, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
					mNav_functional_box_plot_with_line({ data: quantiles_s4, ds_raw: score4_wide, ylbl: xin.s4, chart: "scores", width: width/2, height: (height / 4)-22, window_link: 1, line_id: d3.select("#link_" + id).html()}); //xin.line_id
              }); 

               d3.select("#window").on("change", function () {
                  // d3.select("#" + id).html("");
				  
				  console.log("sdffffffffffffffffffffffff");
			       d3.select("#scores").html("");
				   d3.select("#bubble_chart").html("");
					   
              });			  
          }
	



    }

    resize: function (el, width, height, instance) {
        if (instance.xin) {
            this.drawGraphic(el, instance.xin, width, height);
        }
    }

	
	//eol
	{
		
		          // if (xin.chart_type == "box_plot") {
              // mNav_box_plot({ data: ds, chart: el.id, values: xin.data["x"], width: width, height: height });
          // }

          // if (xin.chart_type == "hist_dist") {
              // mNav_hist_dist({ chart: el.id, values: xin.data["x"], width: width, height: height });
          // }
		
		
				  // if (xin.chart_type == "Transformations View") {
              // console.log(ds);
			 
              // var id = xin.link_id   
              // el.innerHTML = "<div><b>Transformations View</b></div><br/><div id='" + id + "'></div><br/><br/>";      //Length: " + xin.data_dim + "

			  // d3.select("#" + id).append("div").html("<b>Cum Data</b>&nbsp;&nbsp;median mad: " + xin.qc_mad_median) ;
			  // mNav_functional_box_plot({ data: quantiles_cum, chart: id, width: width*0.8, height: height / 5});

			  // d3.select("#" + id).append("div").html("<b>Original Data</b>&nbsp;&nbsp;median mad: " + xin.q_mad_median) ;
			  // mNav_functional_box_plot({ data: quantiles, chart: id, width: width*0.8, height: height / 5});

			  // d3.select("#" + id).append("div").html("<b>Diff</b>&nbsp;&nbsp;median mad: " + xin.qd_mad_median) ;
			  // mNav_functional_box_plot({ data: quantiles_diff, chart: id, width: width*0.8, height: height / 5 });

			  // d3.select("#" + id).append("div").html("<b>Diff of Diff</b>&nbsp;&nbsp;median mad: " + xin.qdd_mad_median) ;
			  // mNav_functional_box_plot({ data: quantiles_diff_diff, chart: id, width: width*0.8, height: height / 5});
  
          // }
		  
		  // if (xin.chart_type == "overview") {
              // console.log(ds);
			 
              // var id = xin.link_id   
              // el.innerHTML = "<div><b>Overview View</b></div> <div>Length: " + xin.data_dim + "</div><div id='link_"+ id + "'>xin.y_var</div><div id='" + id + "'></div>";      //<div>Window: " + xin.window + "</div>

			  // mNav_functional_box_plot({ data: quantiles, chart: id, width: width*0.8, height: height / 4});
		      // d3.select("#" + id).append("div").html("<button id='e1' type='button' style='padding:1px' class='btn btn- info btn- sm'>Explore</button>&nbsp;&nbsp;&nbsp;&nbsp;") ;

			  // mNav_functional_box_plot({ data: quantiles_diff, chart: id, width: width*0.8, height: height / 4 });
	//	//	 d3.select("#" + id).append("p").html("<button id='b2' type='button' style='padding:1px' class='btn btn- info btn- sm'>Sort</button>&nbsp;&nbsp;&nbsp;&nbsp;") ;

	//	//	 mNav_functional_box_plot({ data: quantiles, chart: id, width: width*0.8, height: height / 4});
	  //  //      d3.select("#" + id).append("p").html("<button id='b3' type='button' style='padding:1px' class='btn btn- info btn- sm'>Sort</button>&nbsp;&nbsp;&nbsp;&nbsp;") ;

			  
			  // d3.select("#e1").on("click", function () {
                  // d3.select("#" + id).html("");

                  // mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 4 });
              
				  // mNav_scatter_plot({
					  // data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s1,  //y_var
					  // width: width/2, height: height / 4, linked: true
				  // });

				  // mNav_scatter_plot({
                  // data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s2,  //x_var
                  // width: width/2, height: height / 4, linked: true
				  // });

			  
				  // mNav_scatter_plot({
					  // data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s3,
					  // width: width/2, height: height / 4, linked: true
				  // });

				  // mNav_scatter_plot({
					  // data: scores, chart: el.id, link_id: id, x_ds: 'id', y_ds: xin.s4,
					  // width: width/2, height: height / 4, linked: true
				  // });
				  
				  
				  
				  
              // });
			  
			  
			  
			  // d3.select("#link_" + id).on("change", function () {
                  // d3.select("#" + id).html("");

                  // if (q_data == null) {
                      // mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })
                  // }
                  // else
                      // {
                      // mNav_functional_box_plot_with_line({
                          // data: q_data, ds_raw: ds_raw, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      // });
                      
                  // }
              // });
			  
          // }

		
		
		
				  // if (xin.chart_type == "cor_checks") {

              // var id = xin.link_id   
              // el.innerHTML = "<div id='link'>";
			  // el.innerHTML = el.innerHTML + "<a href='#' id='btn_update' class='btn btn-LightBlue'>Update</a>";
			  // el.innerHTML = el.innerHTML + "dfgdfgdfg</div><br/><div id='dfg'>dfgdf</div>";

             
			  
			  // mNav_heatmap({ data: ds, chart: "dfg", x_ds: xin.x_var, y_ds: xin.y_var, width: width, height: 2 * height / 3, cm: xin.cm, colorRange:  JSON.parse(xin.colorRange), colorDomain: JSON.parse(xin.colorDomain), link_id: xin.link_id, linked: true });

			  			  
              // /* d3.select("#link_" + id).on("change", function () {
                  // d3.select("#" + id).html("");

                  // if (q_data == null) {
                      // mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: d3.select("#link_" + id).html(), width: width, height: height / 3 })
                  // }
                  // else
                      // {
                      // mNav_functional_box_plot_with_line({
                          // data: q_data, ds_raw: ds_raw, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      // });
                      
                  // }
              // }); */

          // }

		
				  // if (xin.chart_type == "uni_signal") {

              // var id = xin.link_id   
              // el.innerHTML = "<div id='link_"+ id + "'>xin.y_var</div><div>Length: " + xin.data_dim + "</div><div>Window: " + xin.window + "</div><div id='" + id + "'></div>";

			  
              // mNav_Line_chart({ data: ds, chart: id, x_ds: "seq_id", y_ds: xin.y_var, width: width, height: height / 4 });
              
			  // var T2 = HTMLWidgets.dataframeToD3(xin.T2);
			  // mNav_scatter_plot({
                  // data: T2, chart: el.id, x_ds: 'id', y_ds: 'T2',
                  // width: width, height: height / 4
              // }); 
			  
			  // var T2_rob = HTMLWidgets.dataframeToD3(xin.T2_rob);
			  // mNav_scatter_plot({
                  // data: T2_rob, chart: el.id, x_ds: 'id', y_ds: 'T2_rob',
                  // width: width, height:  height / 4
              // }); 
		
          // }
		  		  
         //// Scatter with linked line chart1
          // if (xin.chart_type == "scatter_and_linked_ts") {

              // var id = xin.link_id
              // el.innerHTML = "<div id='link_" + id + "'>link_" + id + "</div><div id='" + id + "'></div>";

              // mNav_Line_chart({ data: ds_raw, chart: id, x_ds: "seq_id", y_ds: "20053", width: width, height: height / 3 });
              // mNav_scatter_plot({
                  // data: ds, chart: el.id, link_id: id, x_ds: xin.x_var, y_ds: xin.y_var,
                  // width: width, height: 2 * height / 3, linked: true
              // });

              // d3.select("#link_" + id).on("change", function () {
                  // d3.select("#" + id).html("");

                  // if (q_data == null) {

                      // var ds1 = ds.filter(function (d) { return d.id == d3.select("#link_" + id).html()});  //d3.select("#" + id).html("");
                      // console.log(ds1["0"]["start"]);

                      // var ds_raw1 = ds_raw.filter(function (d) { return d.seq_id > ds1["0"]["start"] && d.seq_id < ds1["0"]["start"] + ds1["0"]["len"]; });

                      // mNav_Line_chart({ data: ds_raw1, chart: id, x_ds: "seq_id", y_ds: "vec", width: width, height: height / 3 })
                  // }
                  // else {
                      // mNav_functional_box_plot_with_line({
                          // data: q_data, ds_raw: ds_raw, chart: id, width: width, height: height / 3, line_id: d3.select("#link_" + id).html()
                      // });

                  // }
              // });

          // }

		
		
	}
	
	});