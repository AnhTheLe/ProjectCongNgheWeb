const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_line', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    return_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: '_order',
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
    tableName: 'order_line',
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
        name: "FK27k1n0p6fl3w72nur1clauqre",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "FKroikilpfif4yfqiigotg1ql4p",
        using: "BTREE",
        fields: [
          { name: "variant_id" },
        ]
      },
    ]
  });
};
