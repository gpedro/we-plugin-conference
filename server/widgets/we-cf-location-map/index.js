module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-location-map', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.getWe();
    widget.API_KEY = we.config.apiKeys.googleMaps;
    next();
  }

  return widget;
};