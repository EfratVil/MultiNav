#===========================================================================================
# Univariate statistics 
# Author   Efrat Vilenski
# Ver      1.1  Dec 2016   
#===========================================================================================
#
# bc - box cox
# op - Outier point
#
#===========================================================================================

#Boxcox transform to make a variable more "normal distributed"
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

# Calculate univariate outlier points, based on trimmed mean 
outlier_points <- function(vec){
  
  LCL <- mean(vec, trim=0.1)-3.2*mad(vec)
  UCL <- mean(vec, trim=0.1)+3.2*mad(vec)
  
  op<- ifelse(vec>UCL,1,ifelse(vec<LCL,1,0 ))
  return (op)
   
}


#-----------------------------------------------------------------
#                   Indicators
#-----------------------------------------------------------------
Calc_uni_matrix <- function(data, op=FALSE){
  
library(moments)
library("MASS")

#----
# Ensuring only records with no missing data are included in the analysis. 
data <- na.omit(data)  

#-----
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


#-----------------------
# Calculating statistics
#-----------------------

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


#-----------------------
# box-cox transformations
#-----------------------

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

#-----------------------
# Outlier points
#-----------------------
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
length(ids)
dim(uni_matrix)
}


#-----------------------------------------------------------------
#                   Indicators
#-----------------------------------------------------------------
Calc_quantiles_matrix <- function(data){
  
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
  
    
  quantile_02 <- apply(data,2,quantile,probs=0.02,na.rm = TRUE)
  quantile_25 <- apply(data,2,quantile,probs=0.25,na.rm = TRUE)
  median <- apply(data,2,median,na.rm = TRUE)
  quantile_75 <- apply(data,2,quantile,probs=0.75,na.rm = TRUE)
  quantile_98 <- apply(data,2,quantile,probs=0.98,na.rm = TRUE)
  quantiles_matrix <- as.data.frame(cbind(quantile_02, quantile_25, median, quantile_75, quantile_98))

  quantiles_matrix <- cbind(seq_id=row.names(quantiles_matrix), quantiles_matrix)
  
    return(data.frame(quantiles_matrix))
}



     