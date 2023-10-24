const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('import_item', {
    import_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'import_order',
        key: 'id'
      }
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'variant',
        key: 'id'
      }
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    import_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'import_item',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "import_id" },
          { name: "variant_id" },
        ]
      },
      {
        name: "FK2v3adg34uq4voqbil3fmqa9nc",
        using: "BTREE",
        fields: [
          { name: "variant_id" },
        ]
      },
    ]
  });
};
