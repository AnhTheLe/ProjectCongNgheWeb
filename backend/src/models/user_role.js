const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_role', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_role',
    timestamps: false,
    indexes: [
      {
        name: "FKa68196081fvovjhkek5m97n3y",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
      {
        name: "FK859n2jvi8ivhui0rl0esws6o",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
