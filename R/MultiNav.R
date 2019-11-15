#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
MultiNav <- function(data, type, x= NULL, y= NULL, raw_data= NULL, q_data= NULL, 
                     width = NULL, height = NULL, elementId = NULL, 
                     colorRange= NULL, colorDomain = NULL,
                     line_id = NULL, link_id = NULL, cm = NULL,
                     radius = NULL, attributes= NULL, window=NULL, T2=NULL, T2_rob=NULL,
                     median_color= NULL,
                     #screens variables
                     s1= NULL,s2= NULL,s3= NULL,s4= NULL,
                     scores= NULL, scores_funcs = NULL,
                     data_difff= NULL, quantiles_data_diff= NULL,
                     show_diff=FALSE,
                     sliding_scores=NULL,sliding_quantiles=NULL,sliding_data=NULL,
                     dim_scores= NULL,
                     quantiles= NULL, quantiles_cum= NULL, quantiles_diff= NULL,quantiles_diff_diff= NULL,
                     q_mad_median= NULL,qc_mad_median= NULL,qd_mad_median= NULL,qdd_mad_median= NULL,
                     last_scores= NULL,score1_wide= NULL,score2_wide= NULL,score3_wide= NULL,score4_wide= NULL,
                     quantiles_s1= NULL, quantiles_s2= NULL, quantiles_s3= NULL, quantiles_s4= NULL
                     ) {
  
  
  # Check inputs
  # ============
  if( !(class(data)[1] == "matrix" || class(data)!="data.frame" || class(data)[1]!="data.table" )) stop('not data.frame or data.table')
  
  #TODO - add cond, method = "mv"
  #if( !(dim(data)[1] < dim(data)[2])) stop('n < p, can not calculate MCD cov estimator.')
  
  #TODO - add check that 'type' was provided
  #TODO - check that either scores or sliding_scores were provided
  #TODO - sliding_scores provided with window -warining that window will be ignored
  
  
  # todo check for NAs introduced by coercion
  if (class(data)[1] == "matrix") {
    data<-as.data.frame(data)
  }
  
  if (class(scores)[1] == "matrix") {
    scores<-as.data.frame(scores)
   
  }
  
  if (class(quantiles)[1] == "matrix") {
    quantiles<-as.data.frame(quantiles)
  }

  # set linked charts id
  if (is.null(link_id))
  {link_id<-rand_string(1)
  }
  
  
  #================ Displays =====================
  
  #================== snapshot scores ================== 
  
  if (type=="snapshot scores")
  {
    
    #===================================
    #     1) Check input parameters 
    #===================================
    
    # check data
    # print(paste("n: ", dim(data)[1]))
    # print(paste("p: ", dim(data)[2]))

    
    if(is.null(window) & is.null(sliding_scores)) 
    {

      if( is.null(scores)) 
      #case=1
        {
        case<-1
        # print("case 1 - no window, no scores, need defult scores")
        # no scores were provided - Default scores are calculated
        
        dim_scores<-4
        scores<-Calc_uni_matrix(as.data.frame(data))
        scores<-scores[,c("id", "quantile_25","quantile_75","median","mad")]
        
        s1<- "quantile_25"
        s2<- "quantile_75"
        s3<- "median"
        s4<- "mad"
        
        scores.ds <-scores
        
      }
      
      else if(!is.null(scores) & class(scores)=="character") 
      # case<-2
      {
        case<-2
        # print("case 2 - no window, scores requested")
        
        if( dim(data)[1]>dim(data)[2]) stop('Calculating multivariate score per sensor (variable) requiers more sensors then time periods.')
        
        if(class(scores) == "character" & scores == "mv") {
        
          scores<-as.data.frame(cbind(id=as.numeric(colnames(data)), T2_mcd75=T2_mcd75(t(data)), EigenCent=EigenCentrality(data)))
          
        }
        
        else if((class(scores) == "character" & scores == "T2_Variations")) {

          scores<-as.data.frame(cbind(id=as.numeric(colnames(data)), 
                                      T2_mcd50=T2_mcd50(t(data)),
                                      T2_mcd75=T2_mcd75(t(data)),
                                      T2_CrouxOllerer=T2_CrouxOllerer(t(data)),
                                      T2_SrivastavaDu=T2_SrivastavaDu(t(data))
          ))
          
        }
 
      } 
      
      # Check if default scores were requested
      else if( (!is.null(scores)) & 
               (class(scores)[1] == "matrix" || class(data)=="data.frame" || class(data)[1]=="data.table" ) ) 
      #case 3
        {
        case<-3
        #print("case 3 - no window, scores provided as tabular input")
        
        # TODO - check if scores were provided as a valid data.frame, data.table or matrix
        # TODO - check if scores contain id field and then upto 4 numeric scores fields
      }
      
        
    }
    else  # window was set
    { #Todo: check if window is integer
      #===================================
      #     sliding scores
      #===================================
      
      if( is.null(scores) & is.null(sliding_scores)) 
      # case 4
        { 
        case<-4
        #print("case 4 - window, no scores, need defult scores")
        
        # defualt scores are calculated  
        sliding_scores<-sliding_window_scores(data,window)
        sliding_quantiles<-Calc_quantiles_matrix(data)
        sliding_data <- data<-cbind(seq_id=as.numeric(row.names(data)), data)
        
        
        last_scores <- sliding_scores[sliding_scores$window==max(sliding_scores$window),]
        scores<-last_scores
        scores$window<-NULL
        
        s1<-"median"
        s2<- "mad"
        s3<- "quantile_25"
        s4<- "quantile_75"
        
        # median
        score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id,value.var="median")
        score1_wide[,1]<-NULL
        score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
        quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))
        
        # mad
        score2_wide<- reshape2::dcast(sliding_scores[,c(1,2,4)], window~id,value.var="mad")
        score2_wide[,1]<-NULL
        score2_wide<-cbind(seq_id=as.numeric(row.names(score2_wide)), score2_wide)
        quantiles_s2<-Calc_quantiles_matrix(as.data.frame(score2_wide))
        
        
        # quantile_25
        score3_wide<- reshape2::dcast(sliding_scores[,c(1,2,5)], window~id,value.var="quantile_25")
        score3_wide[,1]<-NULL
        score3_wide<-cbind(seq_id=as.numeric(row.names(score3_wide)), score3_wide)
        quantiles_s3<-Calc_quantiles_matrix(as.data.frame(score3_wide))
        
        # quantile_75
        score4_wide<- reshape2::dcast(sliding_scores[,c(1,2,6)], window~id,value.var="quantile_75")
        score4_wide[,1]<-NULL
        score4_wide<-cbind(seq_id=as.numeric(row.names(score4_wide)), score4_wide)
        quantiles_s4<-Calc_quantiles_matrix(as.data.frame(score4_wide))
        
        data<-data[(dim(data)[1]-window+1):dim(data)[1],]
        
      }
      
      else if(!is.null(scores) & class(scores)=="character") 
      # case 5  
      {
        case<-5
        #print("case 5 - window, scores requested")

       
         if( class(scores)=="character" & scores=="mv") {

          sliding_scores<-sliding_window_scores(data, window, scores="mv")
          
#          data_diff<- apply(data, 2, diff)

#          sliding_quantiles<-Calc_quantiles_matrix(data_diff)
#          sliding_data <- data<-cbind(seq_id=as.numeric(row.names(data_diff)), data_diff)
          
          sliding_quantiles<-Calc_quantiles_matrix(data)
          sliding_data <- data<-cbind(seq_id=as.numeric(row.names(data)), data)
          
          last_scores <- sliding_scores[sliding_scores$window==max(sliding_scores$window),]
          s1<-"T2_mcd75"
          s2<-"EigenCent"
          
          # T2_mcd75
          score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id, value.var ="T2_mcd75")
          score1_wide[,1]<-NULL
          score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
          quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))
          
          # EigenCent
          score2_wide<- reshape2::dcast(sliding_scores[,c(1,2,4)], window~id, value.var = "EigenCent")
          score2_wide[,1]<-NULL
          score2_wide<-cbind(seq_id=as.numeric(row.names(score2_wide)), score2_wide)
          quantiles_s2<-Calc_quantiles_matrix(as.data.frame(score2_wide))

 
          
          data<-data[(dim(data)[1]-window+1):dim(data)[1],]
          scores<-last_scores
          scores$window <- NULL

        }
        
        else if( class(scores)=="character" & scores=="T2_Variations") {

          sliding_scores<-sliding_window_scores(data, window, scores="T2_Variations")
          sliding_quantiles<-Calc_quantiles_matrix(data)
          sliding_data <- data<-cbind(seq_id=as.numeric(row.names(data)), data)
          
          last_scores <- sliding_scores[sliding_scores$window==max(sliding_scores$window),]
          s1<-"T2_mcd50"    
          s2<-"T2_mcd75"
          s3<-"T2_CrouxOllerer"
          s4<-"T2_SrivastavaDu"
          
          # T2_mcd50
          score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id, value.var ="T2_mcd50")
          score1_wide[,1]<-NULL
          score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
          quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))
          
          # T2_mcd75
          score2_wide<- reshape2::dcast(sliding_scores[,c(1,2,4)], window~id, value.var ="T2_mcd75")
          score2_wide[,1]<-NULL
          score2_wide<-cbind(seq_id=as.numeric(row.names(score2_wide)), score2_wide)
          quantiles_s2<-Calc_quantiles_matrix(as.data.frame(score2_wide))

          # T2_CrouxOllerer
          score3_wide<- reshape2::dcast(sliding_scores[,c(1,2,5)], window~id, value.var ="T2_CrouxOllerer")
          score3_wide[,1]<-NULL
          score3_wide<-cbind(seq_id=as.numeric(row.names(score3_wide)), score3_wide)
          quantiles_s3<-Calc_quantiles_matrix(as.data.frame(score3_wide))
          
          # T2_SrivastavaDu
          score4_wide<- reshape2::dcast(sliding_scores[,c(1,2,6)], window~id, value.var ="T2_SrivastavaDu")
          score4_wide[,1]<-NULL
          score4_wide<-cbind(seq_id=as.numeric(row.names(score4_wide)), score4_wide)
          quantiles_s4<-Calc_quantiles_matrix(as.data.frame(score4_wide))
                    
          data<-data[(dim(data)[1]-window+1):dim(data)[1],]
          scores<-last_scores
          scores$window <- NULL
        }
        
      } 
      
      # Check if default scores were requested
      else if( (!is.null(sliding_scores)) & 
               (class(sliding_scores)[1] == "matrix" || class(sliding_scores)=="data.frame" || class(sliding_scores)[1]=="data.table" ) ) 
      # case 6  
      { case<-6
        # print("case 6 - sliding scores provided as tabular input")
        
        # TODO - check if scores were provided as a valid data.frame, data.table or matrix
        # TODO - check if scores contain id field and then upto 4 numeric scores fields
        
        
        
        dim_scores<-dim(sliding_scores)[2]-2
        sliding_quantiles<-Calc_quantiles_matrix(data)
        sliding_data <- data<-cbind(seq_id=as.numeric(row.names(data)), data)
        
        last_scores <- sliding_scores[sliding_scores$window==max(sliding_scores$window),]
        scores<-last_scores
        scores$window<-NULL
        window<-dim(scores)[1]
        
        
        if (dim_scores ==1)
        {
          s1<-names(sliding_scores)[3]
          score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id,value.var=names(sliding_scores)[3])
          score1_wide[,1]<-NULL
          score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
          quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))
        }
        
        
        if (dim_scores ==2)
        {
          s1<-names(sliding_scores)[3]
          score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id,value.var=names(sliding_scores)[3])
          score1_wide[,1]<-NULL
          score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
          quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))
          
          s2<- names(sliding_scores)[4]
          score2_wide<- reshape2::dcast(sliding_scores[,c(1,2,4)], window~id,value.var=names(sliding_scores)[4])
          score2_wide[,1]<-NULL
          score2_wide<-cbind(seq_id=as.numeric(row.names(score2_wide)), score2_wide)
          quantiles_s2<-Calc_quantiles_matrix(as.data.frame(score2_wide))
          
        }
        
        
        if (dim_scores ==3)
        {
          s1<-names(sliding_scores)[3]
          score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id,value.var=names(sliding_scores)[3])
          score1_wide[,1]<-NULL
          score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
          quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))
          
          s2<- names(sliding_scores)[4]
          score2_wide<- reshape2::dcast(sliding_scores[,c(1,2,4)], window~id,value.var=names(sliding_scores)[4])
          score2_wide[,1]<-NULL
          score2_wide<-cbind(seq_id=as.numeric(row.names(score2_wide)), score2_wide)
          quantiles_s2<-Calc_quantiles_matrix(as.data.frame(score2_wide))
          
          s3<- names(sliding_scores)[5]
          score3_wide<- reshape2::dcast(sliding_scores[,c(1,2,5)], window~id,value.var=names(sliding_scores)[5])
          score3_wide[,1]<-NULL
          score3_wide<-cbind(seq_id=as.numeric(row.names(score3_wide)), score3_wide)
          quantiles_s3<-Calc_quantiles_matrix(as.data.frame(score3_wide))
          
        }
        
        if (dim_scores ==4)
        {
          s1<-names(sliding_scores)[3]
          score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id,value.var=names(sliding_scores)[3])
          score1_wide[,1]<-NULL
          score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
          quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))
          
          s2<- names(sliding_scores)[4]
          score2_wide<- reshape2::dcast(sliding_scores[,c(1,2,4)], window~id,value.var=names(sliding_scores)[4])
          score2_wide[,1]<-NULL
          score2_wide<-cbind(seq_id=as.numeric(row.names(score2_wide)), score2_wide)
          quantiles_s2<-Calc_quantiles_matrix(as.data.frame(score2_wide))
          
          s3<- names(sliding_scores)[5]
          score3_wide<- reshape2::dcast(sliding_scores[,c(1,2,5)], window~id,value.var=names(sliding_scores)[5])
          score3_wide[,1]<-NULL
          score3_wide<-cbind(seq_id=as.numeric(row.names(score3_wide)), score3_wide)
          quantiles_s3<-Calc_quantiles_matrix(as.data.frame(score3_wide))
          
          s4<- names(sliding_scores)[6]
          score4_wide<- reshape2::dcast(sliding_scores[,c(1,2,6)], window~id,value.var=names(sliding_scores)[6])
          score4_wide[,1]<-NULL
          score4_wide<-cbind(seq_id=as.numeric(row.names(score4_wide)), score4_wide)
          quantiles_s4<-Calc_quantiles_matrix(as.data.frame(score4_wide))
          
        }
        
        
      }
      
      
      
    }
    
  
   
    #===================================
    #     1) Set scores cont.
    #===================================
    
    # Setting the scores dataset
    # if (is.null(scores) & is.null(scores_funcs)){
    #  }
    #  else { #TODO --> check if first col is id. if not, start from 1

    #  uni_matrix<-scores
      
      
      dim_scores<-dim(scores)[2]
      if (dim_scores==2 )
      { 
        dim_scores<- 1
        s1<-names(scores)[2] }
      else if (dim_scores==3 ){
        
        dim_scores<-2
        s1<-names(scores)[2]
        s2<- names(scores)[3]}
      else if (dim_scores==4 ){
        dim_scores<-3
        s1<-names(scores)[2]
        s2<- names(scores)[3]
        s3<- names(scores)[4]}
      else {
        dim_scores<-4
        s1<-names(scores)[2]
        s2<- names(scores)[3]
        s3<- names(scores)[4]
        s4<- names(scores)[5]
        
      }
      
      scores.ds <-scores
      
      
   
      # }   
    
    #-------------------------------------
    #             quantiles
    #-------------------------------------
    
    #no quantiles were provided
    if (is.null(quantiles)){
      
      quantiles_matrix<-Calc_quantiles_matrix(as.data.frame(data))
      
      
    }
    else {
      quantiles_matrix = quantiles
    }
    
    #-------------------------------------
    #             finalizing
    #-------------------------------------
    #TODO - check if seq_id exists
    data<-cbind(seq_id=as.numeric(row.names(data)), data)
    
      # Data inspection was requested. adding data diff calc
      if (!is.null(show_diff))
      {
        data_difff<- as.data.frame(apply(data, 2, diff))
        quantiles_data_diff<-Calc_quantiles_matrix(as.data.frame(data_difff))
        
        data_difff<-cbind(seq_id=as.numeric(row.names(data_difff)), data_difff)
        
      }
      
    raw_data<-data
    data<-scores.ds #uni_matrix
    q_data<-quantiles_matrix
    
    
    type <- "scatter_and_linked_line2"
    
  }
  
   
  #================== sliding scores ================== 
  if (type=="sliding scores")
  {
    sliding_scores<-data
    # First check if sliding scores data were passed or need to calculate
    #if (is.null(scores)){
    #}
    # else { #TODO --> check if first col is id. if not, start from 1
    # }   
    
    last_scores <- sliding_scores[sliding_scores$window==max(sliding_scores$window),]
    
    s1<-"median"
    s2<- "mad"
    s3<- "quantile_25"
    s4<- "quantile_75"
    
    # median
    score1_wide<- reshape2::dcast(sliding_scores[,c(1,2,3)], window~id,value.var="median")
    score1_wide[,1]<-NULL
    score1_wide<-cbind(seq_id=as.numeric(row.names(score1_wide)), score1_wide)
    quantiles_s1<-Calc_quantiles_matrix(as.data.frame(score1_wide))

    # mad
    score2_wide<- reshape2::dcast(sliding_scores[,c(1,2,4)], window~id,value.var="mad")
    score2_wide[,1]<-NULL
    score2_wide<-cbind(seq_id=as.numeric(row.names(score2_wide)), score2_wide)
    quantiles_s2<-Calc_quantiles_matrix(as.data.frame(score2_wide))

   
    # quantile_25
    score3_wide<- reshape2::dcast(sliding_scores[,c(1,2,5)], window~id,value.var="quantile_25")
    score3_wide[,1]<-NULL
    score3_wide<-cbind(seq_id=as.numeric(row.names(score3_wide)), score3_wide)
    quantiles_s3<-Calc_quantiles_matrix(as.data.frame(score3_wide))

    # quantile_75
    score4_wide<- reshape2::dcast(sliding_scores[,c(1,2,6)], window~id,value.var="quantile_75")
    score4_wide[,1]<-NULL
    score4_wide<-cbind(seq_id=as.numeric(row.names(score4_wide)), score4_wide)
    quantiles_s4<-Calc_quantiles_matrix(as.data.frame(score4_wide))

  }
  
  
  
 # if (type=="functional_box_with_line")
 # {
 # data<-cbind(seq_id=as.numeric(row.names(data)), data)
 #}
  
  
  # forward options using x
  x = list(
    data = data,
    data_dim = dim(data)[1],
    chart_type = type,
    x_var=x,
    y_var=y,
    raw_data= raw_data,
    q_data = q_data,
    line_id = line_id,
    link_id = link_id,
    colorRange = colorRange,
    colorDomain = colorDomain,
    cm = cm,
    radius= radius,
    attributes= attributes,
    median_color=median_color,      # Functional box plot
    window=window,                  # Screen 3) uni_Signal
    T2=T2,                          # Screen 3) uni_Signal
    T2_rob=T2_rob,                  # Screen 3) uni_Signal
    s1=s1,                          # Reading scores vector
    s2=s2,                          # Reading scores vector
    s3=s3,                          # Reading scores vector
    s4=s4,                          # Reading scores vector
    q_mad_median= q_mad_median,
    qc_mad_median = qc_mad_median,
    qd_mad_median = qd_mad_median,
    qdd_mad_median = qdd_mad_median,
    quantiles_data_diff = quantiles_data_diff,
    data_difff = data_difff,
    show_diff= show_diff,
    scores = scores, 
    sliding_scores =sliding_scores,
    sliding_quantiles = sliding_quantiles,
    sliding_data = sliding_data,
    dim_scores = dim_scores,
    #scores_funcs = scores_funcs,
    quantiles = quantiles,
    quantiles_cum = quantiles_cum,
    quantiles_diff= quantiles_diff,
    quantiles_diff_diff= quantiles_diff_diff,
    last_scores=last_scores,            # sliding scores
    score1_wide=score1_wide,            # sliding scores
    score2_wide=score2_wide,            # sliding scores
    score3_wide=score3_wide,            # sliding scores
    score4_wide=score4_wide,            # sliding scores
    quantiles_s1=quantiles_s1,          # sliding scores
    quantiles_s2=quantiles_s2,          # sliding scores
    quantiles_s3=quantiles_s3,          # sliding scores
    quantiles_s4=quantiles_s4           # sliding scores
  )
  
  

  # create widget
  htmlwidgets::createWidget(
    name = 'MultiNav',
    x,
    width = width,
    height = height,
    package = 'MultiNav',
    elementId = elementId
  )
}

#' Shiny bindings for MultiNav
#'
#' Output and render functions for using MultiNav within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a MultiNav
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name MultiNav-shiny
#'
#' @export
MultiNavOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'MultiNav', width, height, package = 'MultiNav')
}

#' @rdname MultiNav-shiny
#' @export
renderMultiNav <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, MultiNavOutput, env, quoted = TRUE)
}

# 
# if (type=="process scoring")
# {
#   
#   uni_matrix<-Calc_uni_matrix(as.data.frame(data))
#   quantiles_matrix<-Calc_quantiles_matrix(as.data.frame(data))
#   data<-cbind(seq_id=as.numeric(row.names(data)), data)
#   
#   raw_data<-data
#   data<-uni_matrix
#   q_data<-quantiles_matrix
#   
#   
#   s1<-"median"
#   s2<- "mad"
#   s3<- "quantile_25"
#   s4<- "quantile_75"
#   type <- "scatter_and_linked_line2"
# }


# if (type=="uni_signal")
# {
#   vec<-data[,c("29397")]
#   mat<-Uni_to_Multi(vec,24,1)$mat
#   T2<- T2(mat)
#   T2<-as.data.frame(cbind(id=seq(1:length(T2)),T2=T2))
#   T2_rob<- T2(mat, cov="mcd")
#   T2_rob<-as.data.frame(cbind(id=seq(1:length(T2_rob)),T2=T2_rob))
# }
# 

# if (type=="overview")
# {
#   quantiles<-Calc_quantiles_matrix(as.data.frame(data))
#   diff_data<-apply(data, 2, diff)
#   quantiles_diff<-Calc_quantiles_matrix(as.data.frame(diff_data))
#   
#   #Preprocessing for explore1
#   scores<-Calc_uni_matrix(as.data.frame(data))
#   s1<-"median"
#   s2<- "mad"
#   s3<- "quantile_25"
#   s4<- "quantile_75"
#   
#   data<-cbind(seq_id=as.numeric(row.names(data)), data)
#   
# }

# #------------- 1111111111111111111111111111111 ------------- 
#   if (type=="Transformations View")
# {
#   quantiles<-Calc_quantiles_matrix(as.data.frame(data))
#   q_mad_median <- round(mad(quantiles$median),2)
#   
#   diff_data<-apply(data, 2, diff)
#   quantiles_diff<-Calc_quantiles_matrix(as.data.frame(diff_data))
#   qd_mad_median <- round(mad(quantiles_diff$median),2)
#   
#   diff_diff_data<-apply(diff_data, 2, diff)
#   quantiles_diff_diff<-Calc_quantiles_matrix(as.data.frame(diff_diff_data))
#   qdd_mad_median <- round(mad(quantiles_diff_diff$median),2)
#   
#   cum_data<-apply(data, 2, cumsum)
#   quantiles_cum<-Calc_quantiles_matrix(as.data.frame(cum_data))
#   qc_mad_median <- round(mad(quantiles_cum$median),2)
#   
#   data<-cbind(seq_id=as.numeric(row.names(data)), data)
# 
# }