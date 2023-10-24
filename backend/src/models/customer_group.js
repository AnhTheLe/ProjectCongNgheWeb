const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_group', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    discount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "UK_dl4it04rsafxcy89j1wir4fnl"
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'shop',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'customer_group',
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
        name: "UK_dl4it04rsafxcy89j1wir4fnl",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "FKfenqg14mdke8rn41ugnxfcgk5",
        using: "BTREE",
        fields: [
          { name: "shop_id" },
        ]
      },
    ]
  });
};
