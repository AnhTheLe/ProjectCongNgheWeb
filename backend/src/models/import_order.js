const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('import_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shipment_status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    person_in_charge: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vendor',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'import_order',
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
        name: "FKh2aoealeqisxupg31wyjyqlpw",
        using: "BTREE",
        fields: [
          { name: "person_in_charge" },
        ]
      },
      {
        name: "FKfy3sqeq1tf5hkmyd2mr611l04",
        using: "BTREE",
        fields: [
          { name: "vendor_id" },
        ]
      },
    ]
  });
};
