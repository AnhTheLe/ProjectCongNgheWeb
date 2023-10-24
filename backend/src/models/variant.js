const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('variant', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    barcode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    import_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    retail_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    sku: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "UK_llpabmolrn143l5uh3dp92bgy"
    },
    value1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    value2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    value3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    wholesale_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    base_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'base_product',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'variant',
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
        name: "UK_llpabmolrn143l5uh3dp92bgy",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sku" },
        ]
      },
      {
        name: "FKdgvfgiduminfsf4njbnip63n8",
        using: "BTREE",
        fields: [
          { name: "base_id" },
        ]
      },
    ]
  });
};
