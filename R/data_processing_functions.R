#===========================================================================================
# Data pre processing and anomaly detection functions for MultiNav package.
# Author   Efrat Vilenski
#===========================================================================================
#                Vector & Matrix manipulations
#=================================================================
#---------------------------------------------------------------
# vec_to_Matrix
#---------------------------------------------------------------
# Internal function (fromaly known as Uni_to_Multi())
# About: Trasform univariate signal to multivariate rolling window of length x
vec_to_Matrix <- function(vec, window, step){
  # ------- Inputs
  # 1) Univariate vector
  # 2) Window size
  # 3) Overlap size

  counter<-0
  mat <-NULL

  start<-1
  end <-window

  while(end <= length(vec)) {
    vec_helper <- vec[start:end]
    mat <- rbind(mat,vec_helper)
    counter= counter + 1

    aid <- c(counter, start, (start+end)/2, end)

    if (counter==1)
    {mat_att<-aid}
    else
    {mat_att<-rbind(mat_att, aid)}

    start<-start + step
    end <- end + step

    next
  }

  colnames(mat_att) <- c("id", "start", "mid", "end" )
  rownames(mat_att) <- c(1:dim(mat_att)[1])

  rownames(mat) <- c(1:counter)

  ans <- list("mat" = mat, "mat_att" = mat_att)

  return(ans)
}

#---------------------------------------------------------------
# Create cor matrix
#---------------------------------------------------------------

`lower.tri<-` <- function(x,value){
  x[lower.tri(x)] <- value
  x
}

`upper.tri<-` <- function(x,value){
  y <- t(x)
  lower.tri(y) <- value
  t(y)
}

# Internal functions
# Trasform vector to correlation matrix. The vector contains upper triangle cor values
# Usefull for creating cor matrix for simulations of data
vec_to_cormat  <- function(vec){
  # ------- Inputs
  # 1) Univariate vector of size n*(n-1)/2, where n is the dimentions of an nxn matrix

  n <- (1+sqrt(1+8*length(vec)))/2
  mat <- diag(1,n)
  lower.tri(mat) <- upper.tri(mat) <- vec

  return(mat)
}

cormat_to_vec  <- function(mat){
  # ------- Inputs
  # 1) pxp valid correlation matrix
  # ------- Output
  # Univariate vector of size p*(p-1)/2, where n is the dimentions of a
  # pxp correlation matrix. The vector contains data from upper / lower triangle.
  corvec <-NULL
  p<-dim(mat)[1]


  for(i in 1:(p-1))
  {
    corvec <- append(corvec,mat[(i+1):p,i])
  }

  return(corvec)
}


#===========================================================================================
# Utility functions
#===========================================================================================
# -------- extract_sd0 -------
#' extract_sd0
#'
#' Data pre-processing utility function. Removes from a given dataset all rows and columns that have 0 standard deviation.
#'
#' Function that can be used as pre-processing step.
#'
#' @param data Matrix, data.table or data.frame. Containing continuous variables.
#'
#' @return Returns a data.table, data.frame or matrix (in the same format as the input data).
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{Calc_uni_matrix}}, \code{\link[MultiNav]{Calc_quantiles_matrix}},  \code{\link[MultiNav]{sliding_window_scores}}
#'
#' @examples
#' data <- DendrometerSensors
#'
#' # dimentions before pre-processing
#' dim(data)
#' new_data<-extract_sd0(data)
#' # dimentions after pre-processing
#' dim(new_data)
#'
#' @export
extract_sd0 <- function(data){

  # 1. Removing rows
  sd0_vec <- numeric(0)

  for (i in 1:dim(data)[1])
  {
    if (sd(data[i,])==0)
    {
      sd0_vec<-c(sd0_vec,i)
    }
  }

  if  (length(sd0_vec)!=0)
  {
    new.data<-data[-sd0_vec,]
    message(paste (length(sd0_vec), " rows with 0 standard deviation were omitted.", sep=""))
  }
  else
  { new.data<-data  }

  # 2. Removing cols
  sd0_vec <- numeric(0)

  for (i in 1:dim(new.data)[2])
  {
    if (sd(new.data[,i])==0)
    {
      sd0_vec<-c(sd0_vec,i)
    }
  }

  if  (length(sd0_vec)!=0)
  {
    new.data<-new.data[,-sd0_vec]
    message(paste (length(sd0_vec), " cols with 0 standard deviation were omitted.", sep=""))
  }

  return(new.data)
}


# -------- Calculate scores per variable --------
# Internal function
variable_scores <- function(data, FUN.list){
  scores<-NULL
  for(j in 1:length(FUN.list))
  {
    scores<-cbind(scores,apply(data, 2, FUN.list[[j]]))
  }
  colnames(scores)<-FUN.list
  return(scores)
}


# -------- Sliding window scores ----------
#' sliding_window_scores
#'
#' Data pre-processing utility function. Calculates sliding window scores for default scores sets.
#'
#' Function that can be used as pre-processing step, to calculate sliding window scores per sensor (variable).
#'
#' @param data Matrix, data.table or data.frame. Containing continuous variables.
#' @param window Integer, indicating the size of the temporal window for which scores will be calculated (in a sliding window manner).
#' @param scores Character, specifies which scores set to calculate. If not specified, default univariate scores (quantiles 0.25, 0.5, 0.75 and MAD) will be calculated. Additionally two default multivariate score sets are supported, named: "mv" and "T2_Variations".
#'
#' @return Returns a data.table, data.frame or matrix (in the same format as the input data).
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{Calc_uni_matrix}}, \code{\link[MultiNav]{Calc_quantiles_matrix}}, \code{\link[MultiNav]{extract_sd0}}
#'
#' @examples
#' data <- LambsWeight
#'
#' # Calculate sliding window univariate scores.
#' scores<-sliding_window_scores(data,14)
#' head(scores)
#'
#' # Calculate sliding window scores with "T2_Variations" multivariate scores set.
#' scores<-sliding_window_scores(data,14,scores="T2_Variations")
#' head(scores)
#'
#' # Calculate sliding window scores with "mv" multivariate scores set.
#' scores<-sliding_window_scores(data,14,scores="mv")
#' head(scores)
#'
#' @export
sliding_window_scores <- function(data, window, scores=NULL){
  # ------- Inputs
  # 1) Multivariate data
  # 2) Window size
  # 3) Overlap size -- TODO

  step<-1
  length<-dim(data)[1]

  counter<-1
  mat <-NULL

  start<-1
  end <-window

  sliding_scores<-NULL

  if( (!is.null(scores)) & (class(scores)=="character")) {
      if (scores == "mv") {

        while(end <= length) {

          data1 <- t(data)
          mat <- as.matrix(data1[,(start:end)])

          set.seed(123)
          T2_mcd75 <- T2_mcd75(mat)

          EigenCent<-EigenCentrality(t(mat))

          sliding_scores <- rbind(sliding_scores,
                                  as.data.frame(cbind(id=as.numeric(rownames(data1)),
                                  window=counter, T2_mcd75, EigenCent)))

          start<-start + step
          end <- end + step
          counter= counter + 1

          next
        }

      }
    else if (scores == "T2_Variations") {

        while(end <= length) {

          data1 <- t(data)
          mat <- as.matrix(data1[,(start:end)])

          T2_mcd50<-T2_mcd50(mat)
          T2_mcd75 <- T2_mcd75(mat)
          T2_croux_ollerer<-T2_croux_ollerer(mat)
          T2_srivastava_du<-T2_srivastava_du(mat)


          sliding_scores <- rbind(sliding_scores,
                                  as.data.frame(cbind(id=as.numeric(rownames(data1)),
                                                      window=counter, T2_mcd50, T2_mcd75,T2_croux_ollerer,T2_srivastava_du)))

          start<-start + step
          end <- end + step
          counter= counter + 1

          next
        }
      }
  }
  else {
    # First order scores are calculated as defualt

      while(end <= length) {

        mat <- data[(start:end),]
        uni_matrix<-Calc_uni_matrix(as.data.frame(mat))

        sliding_scores <- rbind(sliding_scores, as.data.frame(cbind(id=as.numeric(colnames(data)),window=counter,
                                                            median=uni_matrix$median,
                                                            mad=uni_matrix$mad,
                                                            quantile_25=uni_matrix$quantile_25,
                                                            quantile_75=uni_matrix$quantile_75
        )))

        start<-start + step
        end <- end + step
        counter= counter + 1

        next
      }
  }

  return(sliding_scores)
}



# -------- Create random string ----------
# used to create random link_id (if link_id was not provided)
# Internal function
rand_string <- function(n = 5000) {
  a <- do.call(paste0, replicate(5, sample(LETTERS, n, TRUE), FALSE))
  paste0(a, sprintf("%04d", sample(9999, n, TRUE)), sample(LETTERS, n, TRUE))
}


#=================================================================
#                     Statistical Functions
#=================================================================
#---------------------------------------------------------------
# Boxcox transform to make a variable more "normal distributed"
#---------------------------------------------------------------
# Note: bc - box cox
# Internal function
bc_transform <- function(vec){
                if (min(vec)>0)  {bc<-boxcox((vec)~1,plotit=F)
                   (lambda<-bc$x[which.max(bc$y)])
                    if (lambda !=0) {return( ((vec)^lambda -1)/lambda)
                    } else {return (log(vec))}
                #else min value is smaller then 0 or 0
                # adding 0.01 for cases that min value=0
                } else  {bc<-boxcox((vec-min(vec)*1.1+0.01)~1,plotit=F)
                         (lambda<-bc$x[which.max(bc$y)])
                         if (lambda !=0) {return(  return( ((vec-min(vec)*1.1+0.01)^lambda -1)/lambda))
                         } else {return (log(vec-min(vec)*1.1+0.01))}
                        }
}

#---------------------------------------------------------------
# Univariate Outliers Points
#---------------------------------------------------------------
# Identifies outlier points based on box-cox values and univariate SPC rule (Median + Mad)
# Internal function
outlier_points <- function(vec){

  LCL <- mean(vec, trim=0.1)-3.2*mad(vec)
  UCL <- mean(vec, trim=0.1)+3.2*mad(vec)

  op<- ifelse(vec>UCL,1,ifelse(vec<LCL,1,0 ))
  return (op)

}


#---------------------------------------------------------------
# T2 Hotelling
#---------------------------------------------------------------


# ------- T2 -------
#' T2
#'
#' Hotelling T2 scoring method for calculating multivariate anomaly scores.
#'
#' @param mat Matrix, data.table or data.frame. Containing continuous variables.
#' @param cov Character, specifies the method of cov estimate "pearson", "spearman", "mcd75", "mcd50", "mve","Srivastava-Du","croux_ollerer"
#'
#' @return A vector of numeric scores per observation (row).
#'
#' @examples
#' data <- LambsWeight[58:62,]
#'
#' #Create score per sensor
#' T2.score<-T2(t(data))
#'
#' #View scores with MultiNav function
#' anomaly.scores<- cbind(id=as.numeric(colnames(data)), T2.score)
#' MultiNav(data,type = "scores", scores = anomaly.scores)
#'
#' @references ROUSSEEUW, P. J., et al. Robustbase: basic robust statistics. R package version 0.4-5, R-project. org/package= robustbase, 2009.
#' @references HOTELLING, HAROLD. Multivariate quality control. Techniques of statistical analysis. McGraw-Hill, New York, 1947.
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{T2_mcd50}}, \code{\link[MultiNav]{T2_mcd75}}, \code{\link[MultiNav]{T2_mve}}, \code{\link[MultiNav]{T2_croux_ollerer}}, \code{\link[MultiNav]{T2_srivastava_du}}
#'
#' @export
T2 <- function(mat, cov="pearson"){
#  if (cov=="mcd") {
#    rob<- cov.rob(mat, cor = TRUE, method = "mcd")
#    mu_hat<- rob$center
#    cov_est <- rob$cov
#     } else
   if (cov=="mcd75") {

    rob<-covMcd(mat, alpha=0.75)
    mu_hat<- rob$center
    cov_est <- rob$cov
   }
   else if (cov=="mcd50") {

    rob<-covMcd(mat, alpha=0.50)
    mu_hat<- rob$center
    cov_est <- rob$cov
  }

#  else if (cov=="covMcd") {

# rob<-covMcd(mat)

  #  mu_hat<- rob$center
  #  cov_est <- rob$cov

  #}

  else if (cov=="mve") {
      rob<- cov.rob(mat, cor = TRUE, method = "mve")
      mu_hat<- rob$center
      cov_est <- rob$cov
    }
  else if (cov=="pearson") {
        mu_hat<- apply(mat,2,median,na.rm = TRUE)
        cov_est <- cor(mat, method = c("pearson"))
      }
  else if (cov=="spearman") {
          mu_hat<- apply(mat,2,median,na.rm = TRUE)
          cov_est <- cov(mat, method = c("spearman"))
        }
  else if (cov=="srivastava_du") {   #(diagonal)
    mu_hat<- apply(mat,2,median,na.rm = TRUE)
    cov_est <- cov(mat)
    cov_est[lower.tri(cov_est)] <- 0
    cov_est[upper.tri(cov_est)] <- 0
  }

  else if (cov=="croux_ollerer") {  #(Adaptive)
    mu_hat<- apply(mat,2,median,na.rm = TRUE)
    cov_est <- spearman.transformed(mat,method="npd")
  }

   else {
          print("Error in cov method")
        }

  n<-dim(mat)[1]

  T2 <- vector(mode = "numeric", length=n)

  for (i in 1:n)
  {
    T2[i] <- t(mat[i:i,]-mu_hat)%*%solve(cov_est, tol = 1e-20)%*%(mat[i:i,]-mu_hat);
  }

  return(T2)
}


# ------- mcd -------
T2_mcd <-function(mat)
  {
    scores<- T2(mat, cov="mcd")
    return(scores)
  }

# ------- T2_mcd75 -------
#' T2_mcd75
#'
#' Method for calculating multivariate anomaly scores.
#' A variation of popular Hotelling T2,
#' calculated based on covariance estimate with mcd method where
#' the determinant is minimized based on 75 percent subset of the data.
#'
#' @param mat Matrix, data.table or data.frame. Containing continuous variables.
#'
#' @return A vector of numeric scores per observation (row).
#'
#' @references ROUSSEEUW, P. J., et al. Robustbase: basic robust statistics. R package version 0.4-5, URL http://CRAN. R-project. org/package= robustbase, 2009.
#' @references HOTELLING, HAROLD. Multivariate quality control. Techniques of statistical analysis. McGraw-Hill, New York, 1947.
#' @references Wilcox, Rand R. Introduction to robust estimation and hypothesis testing. Academic Press, 2012.
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{T2}}, \code{\link[MultiNav]{T2_mcd50}}, \code{\link[MultiNav]{T2_mve}}, \code{\link[MultiNav]{T2_srivastava_du}}, \code{\link[MultiNav]{T2_croux_ollerer}}
#'
#' @examples
#' data <- LambsWeight[58:62,]
#'
#' #Create score per sensor
#' T2_mcd75.score<-T2_mcd75(t(data))
#'
#' #View scores with MultiNav function
#' anomaly.scores<- cbind(id=as.numeric(colnames(data)), T2_mcd75.score)
#' MultiNav(data,type = "scores", scores = anomaly.scores)
#'
#' @export
T2_mcd75 <-function(mat)
{
  scores<- T2(mat, cov="mcd75")
  return(scores)
}

# ------- T2_mcd50 -------
#' T2_mcd50
#'
#' Method for calculating multivariate anomaly scores.
#' A variation of popular Hotelling T2,
#' calculated based on covariance estimate with mcd method where
#' the determinant is minimized based on 50 percent subset of the data.
#'
#' @param mat Matrix, data.table or data.frame. Containing continuous variables.
#'
#' @return A vector of numeric scores per observation (row).
#'
#' @references ROUSSEEUW, P. J., et al. Robustbase: basic robust statistics. R package version 0.4-5, URL http://CRAN. R-project. org/package= robustbase, 2009.
#' @references HOTELLING, HAROLD. Multivariate quality control. Techniques of statistical analysis. McGraw-Hill, New York, 1947.
#' @references Wilcox, Rand R. Introduction to robust estimation and hypothesis testing. Academic Press, 2012.
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{T2}}, \code{\link[MultiNav]{T2_mcd75}}, \code{\link[MultiNav]{T2_mve}}, \code{\link[MultiNav]{T2_srivastava_du}}, \code{\link[MultiNav]{T2_croux_ollerer}}
#'
#'
#' @examples
#' data <- LambsWeight[58:62,]
#' # Create score per sensor
#' T2_mcd50.score<-T2_mcd50(t(data))
#'
#' # View scores with MultiNav function
#' anomaly.scores<- cbind(id=as.numeric(colnames(data)), T2_mcd50.score)
#' MultiNav(data,type = "scores", scores = anomaly.scores)
#'
#' @export
T2_mcd50 <-function(mat)
{
  scores<- T2(mat, cov="mcd50")
  return(scores)
}

# ------- T2_mve -------
#' T2_mve
#'
#' Method for calculating multivariate anomaly scores.
#' A variation of popular Hotelling T2,
#' calculated based on covariance estimate with mve method.
#'
#' @param mat Matrix, data.table or data.frame. Containing continuous variables.
#'
#' @return A vector of numeric scores per observation (row).
#'
#' @references HOTELLING, HAROLD. Multivariate quality control. Techniques of statistical analysis. McGraw-Hill, New York, 1947.
#' @references Wilcox, Rand R. Introduction to robust estimation and hypothesis testing. Academic Press, 2012.
#'
#' @seealso  \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{T2}}, \code{\link[MultiNav]{T2_mcd50}}, \code{\link[MultiNav]{T2_mcd75}}, \code{\link[MultiNav]{T2_srivastava_du}}, \code{\link[MultiNav]{T2_croux_ollerer}}
#'
#' @examples
#' data <- LambsWeight[58:62,]
#'
#' #Create score per sensor
#' T2_mve.score<-T2_mve(t(data))
#'
#' #View scores with MultiNav function
#' anomaly.scores<- cbind(id=as.numeric(colnames(data)), T2_mve.score)
#' MultiNav(data,type = "scores", scores = anomaly.scores)
#'
#' @export
T2_mve <-function(mat)
{
  scores<- T2(mat, cov="mve")
  return(scores)
}

# ------- T2_srivastava_du -------
#' T2_srivastava_du
#'
#' Method for calculating multivariate anomaly scores.
#' A variation of popular Hotelling T2,
#' calculated based on covariance estimate with Srivastava-Du method.
#'
#' @param mat Matrix, data.table or data.frame. Containing continuous variables.
#'
#' @return A vector of numeric scores per observation (row).
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{T2}}, \code{\link[MultiNav]{T2_mcd50}}, \code{\link[MultiNav]{T2_mcd75}}, \code{\link[MultiNav]{T2_mve}}, \code{\link[MultiNav]{T2_croux_ollerer}}
#'
#' @examples
#' data <- LambsWeight[58:62,]
#'
#' #Create score per sensor
#' T2_srivastava_du.score<-T2_srivastava_du(t(data))
#'
#' #View scores with MultiNav function
#' anomaly.scores<- cbind(id=as.numeric(colnames(data)), T2_srivastava_du.score)
#' MultiNav(data,type = "scores", scores = anomaly.scores)
#'
#' @references HOTELLING, HAROLD. Multivariate quality control. Techniques of statistical analysis. McGraw-Hill, New York, 1947.
#' @references Srivastava, Muni S., and Meng Du. "A test for the mean vector with fewer observations than the dimension." Journal of Multivariate Analysis 99.3 (2008): 386-402
#'
#' @export
T2_srivastava_du <-function(mat)
{
  scores<- T2(mat, cov="srivastava_du")
  return(scores)
}

# ------- T2_croux_ollerer -------
#' croux_ollerer
#'
#' Method for calculating multivariate anomaly scores.
#' A variation of popular Hotelling T2,
#' calculated based on covariance estimate with Croux-Ollerer method.
#'
#' @param mat Matrix, data.table or data.frame. Containing continuous variables.
#'
#' @return A vector of numeric scores per observation (row).
#'
#' @seealso \code{\link[MultiNav]{MultiNav}},\code{\link[MultiNav]{T2}}, \code{\link[MultiNav]{T2_mcd50}}, \code{\link[MultiNav]{T2_mcd75}}, \code{\link[MultiNav]{T2_mve}},  \code{\link[MultiNav]{T2_srivastava_du}}
#'
#' @examples
#' data <- LambsWeight[58:62,]
#'
#' #Create score per sensor
#' T2_croux_ollerer.score<-T2_croux_ollerer(t(data))
#'
#' #View scores with MultiNav function
#' anomaly.scores<- cbind(id=as.numeric(colnames(data)), T2_croux_ollerer.score)
#' MultiNav(data,type = "scores", scores = anomaly.scores)
#'
#' @references HOTELLING, HAROLD. Multivariate quality control. Techniques of statistical analysis. McGraw-Hill, New York, 1947.
#' @references CROUX, Christophe; ÖLLERER, Viktoria. Robust and sparse estimation of the inverse covariance matrix using rank correlation measures. In: Recent Advances in Robust Statistics: Theory and Applications. Springer, New Delhi, 2016. p. 35-55.
#'
#'
#' @export
T2_croux_ollerer <-function(mat)
{
  scores<- T2(mat, cov="croux_ollerer")
  return(scores)
}


#---------------------------------------------------------------
# DE 2.4.1 EigenvectorCentrality
#---------------------------------------------------------------
#' EigenCentrality
#'
#' Method for calculating multivariate anomaly scores,
#' based on Eigenvector centrality, which is a popular network centrality measure.
#' The anomaly scores are calculated based on distance matrix estimate.
#'
#' @param mat Matrix, data.table or data.frame. Containing continuous variables.
#'
#' @return A vector of numeric scores per each variable.
#'
#' @examples
#' data <- DendrometerSensors
#'
#' #Create score per sensor
#' EigenCentrality.score<-EigenCentrality(data)
#'
#' #View scores with MultiNav function
#' anomaly.scores<- cbind(id=as.numeric(colnames(data)), EigenCentrality.score)
#' MultiNav(data,type = "scores", scores = anomaly.scores)
#'
#' @export
EigenCentrality <- function(mat){
  res_cor <- cor(mat,use="pairwise.complete.obs")
  res_cor<- 1-res_cor

  res_cor_graph <- graph.adjacency(res_cor, mode="upper", weighted=TRUE, diag=FALSE)
  EigenvectorCentrality<-evcent (res_cor_graph, scale = TRUE, weights = NULL, options = igraph.arpack.default)$vector

  return(EigenvectorCentrality)
}


#---------------------------------------------------------------
# Croux-Ollerer (Adaptive) cov
#---------------------------------------------------------------
# easy.psd
# Function code from - CROUX, Christophe; ÖLLERER, Viktoria. Robust and sparse estimation of the inverse covariance matrix using rank correlation measures. In: Recent Advances in Robust Statistics: Theory and Applications. Springer, New Delhi, 2016. p. 35-55.
# Internal function
easy.psd<-function(sigma,method="perturb")
{
  if (method=="perturb")
  {
    p<-ncol(sigma)
    eig<-eigen(sigma, symmetric=T, only.values = T)
    const<-abs(min(eig$values,0))
    sigma.psd<-sigma+diag(p)*const
  }
  if (method=="npd")
  {
    eig<-eigen(sigma, symmetric=T)
    d<-pmax(eig$values,0)
    sigma.psd<-eig$vectors%*%diag(d)%*%t(eig$vectors)
  }
  return(sigma.psd)
}

#spearman.transformed
# Function code from - CROUX, Christophe; ÖLLERER, Viktoria. Robust and sparse estimation of the inverse covariance matrix using rank correlation measures. In: Recent Advances in Robust Statistics: Theory and Applications. Springer, New Delhi, 2016. p. 35-55.
# Internal function
spearman.transformed<-function(x,method="perturb")
{
  x.r=apply(x,2,rank)
  x.q=apply(x,2,Qn)
  cor.sp=2*sin(pi*cor(x.r)/6)
  sigma.sp=diag(x.q)%*%cor.sp%*%diag(x.q)
  return(easy.psd(sigma.sp,method))
}


#=================================================================
#                   Descriptive Statistics
#=================================================================
#---------------------------------------------------------------
# E 3.1 uni_matrix
#---------------------------------------------------------------
#' Calc_uni_matrix
#'
#' Creates collection of univariate descriptive statistics performed on the values
#' of each variable (sensor): minimum, quantile 25, median, quantile 75, maximum, mean, standard deviation,
#' mad, skewness and kurtosis.
#'
#' @param data Matrix, data.table or data.frame. Containing continuous variables. A unique numeric row name should be assigned to each observation and will be used as unique identifier (id). A unique numeric column name should be assigned to each variable.
#' @param op Logical, if TRUE, boxcox transformation is calculated for each descriptive statistic. In addition outlier flag is added per each descriptive statistic, with value 1 to indicate outlier, 0 to indicate inliner. The outlier flag is set according to 3 sigma control limits.
#'
#' @return Returns a data.frame
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{Calc_quantiles_matrix}}, \code{\link[MultiNav]{extract_sd0}}, \code{\link[MultiNav]{sliding_window_scores}}
#'
#' @examples
#' library(MultiNav)
#' data <- DendrometerSensors
#' uni_matrix<-Calc_uni_matrix(data)
#' head(uni_matrix)
#'
#' uni_matrix<-Calc_uni_matrix(data, op=TRUE)
#' head(uni_matrix)
#'
#' @export
Calc_uni_matrix <- function(data, op=FALSE){
# Note: op - Outier point

# Ensuring only records with no missing data are included in the analysis.
data <- na.omit(data)

# Removing id col, if exsits

if (length(which(colnames(data)=="seq_id")) > 0 )
{ id.var <- match(c(  "seq_id"), names(data))
  data<-data[,-id.var]
}

if (length(which(colnames(data)=="n_id")) > 0 )
{ id.var <- match(c(  "n_id"), names(data))
data<-data[,-id.var]
}

ids<- as.numeric(colnames(data))

# Calculations

#1
min <- apply(data,2,min,na.rm = TRUE)
#2
quantile_25 <- apply(data,2,quantile,probs=0.25,na.rm = TRUE)
#3
median <- apply(data,2,median,na.rm = TRUE)
#4
quantile_75 <- apply(data,2,quantile,probs=0.75,na.rm = TRUE)
#5
max <- apply(data,2,max,na.rm = TRUE)
#6
mean <- apply(data,2,mean,na.rm = TRUE)
#7
sd<- apply(data,2,sd,na.rm = TRUE)
#8
mad <-apply(data,2,mad,na.rm = TRUE)
#9
skewness <- apply(data,2,skewness,na.rm = TRUE);
#10
kurtosis <- apply(data,2,kurtosis,na.rm = TRUE);

# box-cox transformations
if (op==TRUE)
{
    min_bc <-bc_transform(min)
    quantile_25_bc <-bc_transform(quantile_25)
    median_bc <-bc_transform(median)
    quantile_75_bc <-bc_transform(quantile_75)
    max_bc <-bc_transform(max)
    mean_bc <-bc_transform(mean)
    sd_bc <-bc_transform(sd)
    mad_bc <-bc_transform(mad+0.001)           # added 0.001, becuse mad can be 0
    skewness_bc <-bc_transform(skewness)
    kurtosis_bc <-bc_transform(kurtosis)

    # Outlier points
    min_op<-outlier_points(min_bc)
    quantile_25_op<-outlier_points(quantile_25_bc)
    median_op<-outlier_points(median_bc)
    quantile_75_op<-outlier_points(quantile_75_bc)
    max_op<-outlier_points(max_bc)
    mean_op<-outlier_points(mean_bc)
    sd_op<-outlier_points(sd_bc)
    mad_op<-outlier_points(mad_bc)
    skewness_op<-outlier_points(skewness_bc)
    kurtosis_op<-outlier_points(kurtosis_bc)

}

if (op==TRUE)
{
  uni_matrix <- as.data.frame(cbind(min, quantile_25, median, quantile_75, max, mean, sd, mad, skewness, kurtosis,
                    min_bc, quantile_25_bc, median_bc, quantile_75_bc, max_bc, mean_bc, sd_bc, mad_bc, skewness_bc, kurtosis_bc,
                    min_op, quantile_25_op, median_op, quantile_75_op, max_op, mean_op, sd_op, mad_op, skewness_op, kurtosis_op))
}
else
{
  uni_matrix <- as.data.frame(cbind(min, quantile_25, median, quantile_75, max, mean, sd, mad, skewness, kurtosis))
}

uni_matrix <- cbind(id=ids, uni_matrix)  #row.names(uni_matrix)

return(data.frame(uni_matrix))

}


#---------------------------------------------------------------
# Quantiles_matrix
#---------------------------------------------------------------
#' Calc_quantiles_matrix
#'
#' Creates collection of five selected quantiles performed on each row (observation) of the data.
#' The default quantiles are: 5, 25, 50, 75 and 95.
#' Minimum and maximum of each row are also included in the output dataset.
#' The ‘quantiles matrix’ is created in the format needed as input for MultiNav's functional boxplot chart.
#'
#' @param data Matrix, data.table or data.frame. Containing continuous variables. A unique numeric row name should be assigned to each observation and will be used as unique identifier (id). If row names were not assigned, row number will be used as id. A unique numeric column name should be assigned to each variable.
#' @param quantiles Optional argument. Gives option to specify custom quantiles instead of the default: quantiles = c(0.05, 0.25, 0.75, 0.95).
#'
#' @return Returns a data.frame
#'
#' @seealso \code{\link[MultiNav]{MultiNav}}, \code{\link[MultiNav]{Calc_uni_matrix}}, \code{\link[MultiNav]{extract_sd0}}, \code{\link[MultiNav]{sliding_window_scores}}
#'
#' @examples
#' library(MultiNav)
#' data <- DendrometerSensors
#' quantiles_matrix<-Calc_quantiles_matrix(data)
#' head(quantiles_matrix)
#'
#' #Custom quantiles example:
#' quantiles_matrix<-Calc_quantiles_matrix(data, quantiles = c(0.02,0.2,0.8,0.98))
#' head(quantiles_matrix)
#'
#' @export
Calc_quantiles_matrix <- function(data, quantiles=c(0.05,0.25,0.75,0.95)){

  data<-t(data)

  # Ensuring only records with no missing data are included in the analysis.
  data <- na.omit(data)


  # Removing id col, if exsits
  ids<- vector(mode="numeric", length=0)

  if (length(which(colnames(data)=="seq_id")) > 0 )
  { id.var <- match(c(  "n_id"), names(data))
  ids<-data[,id.var]
  data<-data[,-id.var]
  }

  if (length(which(colnames(data)=="n_id")) > 0 )
  { id.var <- match(c(  "n_id"), names(data))
  ids<-data[,id.var]
  data<-data[,-id.var]
  }

  if (length(ids) == 0)
  {
    ids <-as.numeric(colnames(data))
  }

  data<-data[-c(1), ]
  min <- round(apply(data,2,min,na.rm = TRUE),3)
  quantile_a <- round(apply(data,2,quantile,probs=quantiles[1],na.rm = TRUE),3)
  quantile_b <- round(apply(data,2,quantile,probs=quantiles[2],na.rm = TRUE),3)
  median <- round(apply(data,2,median,na.rm = TRUE),3)
  quantile_c <- round(apply(data,2,quantile,probs=quantiles[3],na.rm = TRUE),3)
  quantile_d <- round(apply(data,2,quantile,probs=quantiles[4],na.rm = TRUE),3)
  max <- round(apply(data,2,max,na.rm = TRUE),3)
  quantiles_matrix <- as.data.frame(cbind(min, quantile_a, quantile_b, median, quantile_c, quantile_d, max))

  quantiles_matrix <- cbind(seq_id=row.names(quantiles_matrix), quantiles_matrix)

  return(data.frame(quantiles_matrix))
}

