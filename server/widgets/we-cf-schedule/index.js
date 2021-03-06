module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-schedule', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.getWe();

    if (!res.locals.conference) return next();

    we.db.models.cfsession.findAndCountAll({
      where: { conferenceId: res.locals.conference.id},
      order:[['startDate', 'ASC'], ['createdAt', 'ASC']]
    }).then(function (result) {
      var activeSet = false;

      widget.count = result.count;
      widget.record = result.rows;

      widget.days = {};
      var nodayString = req.__('cfsession.no.date');

      widget.record.forEach(function (r) {
        if (!r.startDate) return;
        var sdate = we.utils.moment(r.startDate)
        var day;

        if (we.utils.moment(r.startDate).isValid()) {
          day = sdate.locale(we.config.i18n.defaultLocale).format('L');
        } else {
          day = nodayString
        }

        if (!widget.days[day]) {
          widget.days[day] = {
            text: day,
            cfsession: []
          };

          if (!activeSet && day != nodayString) {
            widget.days[day].active = true;
            activeSet = true;
          }
        }

        widget.days[day].cfsession.push(r);
      });

      // reorder nodaystring
      if (widget.days[nodayString]) {
        var reord = widget.days[nodayString];
        delete widget.days[nodayString];
        widget.days[nodayString] = reord;

        if (!activeSet) widget.days[nodayString].active = true;
      }

      next();
    }).catch(next);
  }

  return widget;
};