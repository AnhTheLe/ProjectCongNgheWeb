const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('balance_variant', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    real_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    saved_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'variant',
        key: 'id'
      }
    },
    balance_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'warehouse_balance',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'balance_variant',
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
        name: "FKggrctc42mw5do93o7t7wh4ahn",
        using: "BTREE",
        fields: [
          { name: "variant_id" },
        ]
      },
      {
        name: "FK2h24nth1v3f6q3aolm5ytqhd2",
        using: "BTREE",
        fields: [
          { name: "balance_id" },
        ]
      },
    ]
  });
};
