/**
 * Conference room
 *
 * @module      :: Model
 * @description :: System conference room model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      creatorId: {type: we.db.Sequelize.BIGINT, formFieldType: null},

      conferenceId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,

        formFieldType: null
      },

      name: { type: we.db.Sequelize.TEXT },
      
      about: { type: we.db.Sequelize.TEXT }
    },

    options: {
      classMethods: {
        /**
         * Context loader, preload current request record and related data
         *
         * @param  {Object}   req  express.js request
         * @param  {Object}   res  express.js response
         * @param  {Function} done callback
         */
        /*contextLoader: function contextLoader(req, res, done) {
          if (!req.params.conferenceId) return done();
          req.body.conferenceId = req.params.conferenceId;
          if (!res.locals.id) return done();
          return this.findById(res.locals.id)
          .then(function (record) {
            res.locals.record = record;
            return done();
          });
        },*/
      },
      instanceMethods: {},
      hooks: {}
    }
  };

  return model;
}