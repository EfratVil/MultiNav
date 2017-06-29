#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
MultiNav <- function(data, type, x= NULL, y= NULL, raw_data= NULL, q_data= NULL, width = NULL, height = NULL, elementId = NULL, line_id = NULL, link_id = NULL) {
  
  # forward options using x
  x = list(
    data = data,
    chart_type = type,
    x_var=x,
    y_var=y,
    raw_data= raw_data,
    q_data = q_data,
    line_id = line_id,
    link_id = link_id
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
