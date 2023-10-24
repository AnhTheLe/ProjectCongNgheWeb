const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    person_in_charge: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: '_order',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "FK89rlip6yd7m162yywywl56e7q",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "FKbv28aihj1d90tivqmtwxj2apn",
        using: "BTREE",
        fields: [
          { name: "person_in_charge" },
        ]
      },
    ]
  });
};
