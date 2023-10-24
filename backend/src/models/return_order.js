const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('return_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    return_reason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    base_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: '_order',
        key: 'id'
      }
    },
    swap_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: '_order',
        key: 'id'
      },
      unique: "FKppivrep58o7rj0b0rp9i4yw2"
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
    tableName: 'return_order',
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
        name: "UK_augin0gjmdjyuajo9or8i7dd7",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "swap_order" },
        ]
      },
      {
        name: "FKgo8vk6a384eetolgv545fkwsj",
        using: "BTREE",
        fields: [
          { name: "base_order" },
        ]
      },
      {
        name: "FKeaxhspo6qtesxxq2r4gpm9d7y",
        using: "BTREE",
        fields: [
          { name: "person_in_charge" },
        ]
      },
    ]
  });
};
