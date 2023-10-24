const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_type: {
      type: DataTypes.ENUM('IMPORT','ORDER','RETURN'),
      allowNull: true
    },
    pay_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.ENUM('CASH','CREDIT','TRANSFER'),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('COMPLETE','INIT'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payment',
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
    ]
  });
};
