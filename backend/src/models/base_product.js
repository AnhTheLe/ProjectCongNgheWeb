const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('base_product', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    attribute1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    attribute2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    attribute3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'base_product',
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
        name: "FK1emt9gsggr71h2cly2kh2ue70",
        using: "BTREE",
        fields: [
          { name: "shop_id" },
        ]
      },
    ]
  });
};
