/**
 * CF Page Model
 *
 * @module      :: Model
 * @description :: cfpage model
 *
 */

module.exports = function Model(we) {

	var model = {
		definition: {
			creatorId: {type: we.db.Sequelize.BIGINT, formFieldType: null},

			name: { type: we.db.Sequelize.TEXT },

			title: { type: we.db.Sequelize.TEXT },

			text: { type: we.db.Sequelize.TEXT },

			image: { type: we.db.Sequelize.TEXT },

			file: { type: we.db.Sequelize.TEXT }
		},

	    options: {
	      termFields: {
	        tags: {
	          vocabularyId: null,
	          canCreate: true
	        },
	        categories: {
	          vocabularyId: 1,
	          canCreate: false
	        }
	      },
	      
	      classMethods: {},
	      instanceMethods: {},
	      hooks: {}
	    }
	};

	return model;
}