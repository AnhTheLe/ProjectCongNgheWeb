const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('return_order_line', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    original_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    return_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    return_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    return_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'return_order',
        key: 'id'
      }
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'variant',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'return_order_line',
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
        name: "FK40ia2uul22s6trglrbdumw6sg",
        using: "BTREE",
        fields: [
          { name: "return_id" },
        ]
      },
      {
        name: "FKlw5ppn8bo87qqhx16o8376l4o",
        using: "BTREE",
        fields: [
          { name: "variant_id" },
        ]
      },
    ]
  });
};
