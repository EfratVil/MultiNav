#' LambsWeight
#'
#' LambsWeight example data for MultiNav.
#'
#' @source xxxxx,
#' @format A data frame with columns
#' \describe{
#' \item{origin}{Weather station. Named origin to faciliate merging with
#'   \code{\link{flights}} data}
#' \item{year,month,day,hour}{Time of recording}
#' \item{temp,dewp}{Temperature and dewpoint in F}
#' \item{humid}{Relative humidity}
#' \item{wind_dir,wind_speed,wind_gust}{Wind direction (in degrees), speed
#'   and gust speed (in mph)}
#' \item{precip}{Preciptation, in inches}
#' \item{pressure}{Sea level pressure in millibars}
#' \item{visib}{Visibility in miles}
#' \item{time_hour}{Date and hour of the recording as a \code{POSIXct} date}
#' }
"LambsWeight"