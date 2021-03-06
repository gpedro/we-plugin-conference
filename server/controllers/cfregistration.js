var _ = require('lodash');

module.exports = {
  register: function register(req, res) {
    var we = req.getWe();

    if (!res.locals.record) res.locals.record = {};

    we.db.models.cfregistrationtype.findAll({
      where: { conferenceId: res.locals.conference.id }
    }).then(function (r) {
      res.locals.cfregistrationtypes = r;

      if (!r || !r.length) {
        res.locals.registrationClosedInfo = req.__('conference.registration.closed');
        res.locals.template = 'cfregistration/registration-closed';
        return res.ok();
      } else {
        if (res.locals.userCfregistration) {
          for (var i = 0; i < r.length; i++) {
            if (r[i].id === res.locals.userCfregistration.id) {
              r[i].checked = true;
              break;
            }
          }
        }
      }

      if (!req.isAuthenticated()) {
        res.locals.template = 'cfregistration/registration-unAuthenticated';
        return res.ok();
      } else if (res.locals.userCfregistration) {
        res.locals.template =
          'cfregistration/' + res.locals.userCfregistration.status;
        return res.ok();
      }

      if (r.length === 1) r[0].checked = true;

      if (req.method === 'POST') {
        req.body.userId = req.user.id;
        req.body.conferenceId = res.locals.conference.id;

        var choiseRegistrationType;
        for (var j = 0; j < r.length; j++) {
        console.log('>>', r[j].id, req.body.cfregistrationtypeId)
          if (r[j].id == req.body.cfregistrationtypeId) {
            choiseRegistrationType = r[j];
            break;
          }
        }

        // merge req.body with locals record to handle validation errors
        _.merge(res.locals.record, req.body);

        if (choiseRegistrationType.requireValidation) {
          req.body.status = 'requested';
        } else {
          req.body.status = 'registered';
        }

        return we.db.models.cfregistration.create(req.body)
        .then(function (record) {
          res.locals.record = record;
          res.locals.userCfregistration = record;
          res.locals.template =
            'cfregistration/' + res.locals.userCfregistration.status;
          res.created();
          // TODO send confirm registration email
        }).catch(res.queryError);

      } else {
        // send the form
        if (!req.body) req.body = {};

        if (!req.body.certificationName)
          res.locals.record.certificationName = (req.user.fullName || req.user.displayName);
        if (!req.body.userEmail)
          res.locals.record.userEmail = req.user.email;

        res.ok();
      }
    }).catch(res.queryError);
  },

  unRegister: function unRegister(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    var we = req.getWe();

    res.locals.deleteMsg = req.__('cfregistration.unRegister.confirm.msg');

    res.locals.deleteRedirectUrl = we.router.urlTo(
      'conference.findOne', [res.locals.conference.id], we
    );

    if (req.method === 'POST') {
      if (res.locals.userCfregistration) {
        res.locals.userCfregistration.destroy().then(function(){
          res.redirect(we.router.urlTo(
            'conference.findOne', [res.locals.conference], we
          ));
        }).catch(res.queryError);
      } else {
        res.redirect(we.router.urlTo(
          'conference.findOne', [res.locals.conference.id], we
        ));
      }
    } else {
      res.ok();
    }
  },

  adminRegisterUser: function adminRegisterUser(req, res) {
    var we = req.getWe();

    res.ok();
  },

  editPage: function editPage(req, res) {
    if (!res.locals.record) return res.notFound();
    var we = req.getWe();

    we.db.models.cfregistrationtype.findAll({
      where: { conferenceId: res.locals.conference.id }
    }).then(function (r) {
      res.locals.cfregistrationtypes = r;

      for (var i = 0; i < r.length; i++) {
        if (r[i].id === res.locals.record.id) {
          r[i].checked = true;
          break;
        }
      }

      if (req.method === 'POST') {
        // dont change conference id for registration type
        req.body.conferenceId = res.locals.conference.id;

        res.locals.record.updateAttributes(req.body)
        .then(function() {
          res.updated();
        }).catch(res.queryError);

      } else {
        res.ok();
      }
    }).catch(res.queryError);
  },

  accept: function accept(req, res) {
    res.locals.Model.findOne({
      where: {
        id: req.params.cfregistrationId,
        conferenceId: res.locals.conference.id
      }
    }).then(function (record) {
      if (!record) return res.notFound();

      record.status = 'registered';
      record.save().then(function(){
        res.locals.record = record;
        console.log('send confirmation email', record.status)
        res.ok();
      }).catch(res.queryError);
    }).catch(res.queryError);
  }
}