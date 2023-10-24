var DataTypes = require("sequelize").DataTypes;
var __order = require("./_order");
var _balance_variant = require("./balance_variant");
var _base_product = require("./base_product");
var _customer = require("./customer");
var _customer_group = require("./customer_group");
var _feedback = require("./feedback");
var _import_item = require("./import_item");
var _import_order = require("./import_order");
var _order_line = require("./order_line");
var _payment = require("./payment");
var _return_order = require("./return_order");
var _return_order_line = require("./return_order_line");
var _role = require("./role");
var _sequelizemeta = require("./sequelizemeta");
var _shop = require("./shop");
var _user = require("./user");
var _user_role = require("./user_role");
var _variant = require("./variant");
var _vendor = require("./vendor");
var _warehouse_balance = require("./warehouse_balance");

function initModels(sequelize) {
  var _order = __order(sequelize, DataTypes);
  var balance_variant = _balance_variant(sequelize, DataTypes);
  var base_product = _base_product(sequelize, DataTypes);
  var customer = _customer(sequelize, DataTypes);
  var customer_group = _customer_group(sequelize, DataTypes);
  var feedback = _feedback(sequelize, DataTypes);
  var import_item = _import_item(sequelize, DataTypes);
  var import_order = _import_order(sequelize, DataTypes);
  var order_line = _order_line(sequelize, DataTypes);
  var payment = _payment(sequelize, DataTypes);
  var return_order = _return_order(sequelize, DataTypes);
  var return_order_line = _return_order_line(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes);
  var shop = _shop(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_role = _user_role(sequelize, DataTypes);
  var variant = _variant(sequelize, DataTypes);
  var vendor = _vendor(sequelize, DataTypes);
  var warehouse_balance = _warehouse_balance(sequelize, DataTypes);

  import_order.belongsToMany(variant, { as: 'variant_id_variants', through: import_item, foreignKey: "import_id", otherKey: "variant_id" });
  variant.belongsToMany(import_order, { as: 'import_id_import_orders', through: import_item, foreignKey: "variant_id", otherKey: "import_id" });
  order_line.belongsTo(_order, { as: "order", foreignKey: "order_id"});
  _order.hasMany(order_line, { as: "order_lines", foreignKey: "order_id"});
  return_order.belongsTo(_order, { as: "base_order__order", foreignKey: "base_order"});
  _order.hasMany(return_order, { as: "return_orders", foreignKey: "base_order"});
  return_order.belongsTo(_order, { as: "swap_order__order", foreignKey: "swap_order"});
  _order.hasOne(return_order, { as: "swap_order_return_order", foreignKey: "swap_order"});
  variant.belongsTo(base_product, { as: "base", foreignKey: "base_id"});
  base_product.hasMany(variant, { as: "variants", foreignKey: "base_id"});
  _order.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(_order, { as: "_orders", foreignKey: "customer_id"});
  feedback.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(feedback, { as: "feedbacks", foreignKey: "customer_id"});
  customer.belongsTo(customer_group, { as: "group", foreignKey: "group_id"});
  customer_group.hasMany(customer, { as: "customers", foreignKey: "group_id"});
  import_item.belongsTo(import_order, { as: "import", foreignKey: "import_id"});
  import_order.hasMany(import_item, { as: "import_items", foreignKey: "import_id"});
  return_order_line.belongsTo(return_order, { as: "return", foreignKey: "return_id"});
  return_order.hasMany(return_order_line, { as: "return_order_lines", foreignKey: "return_id"});
  user_role.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(user_role, { as: "user_roles", foreignKey: "role_id"});
  base_product.belongsTo(shop, { as: "shop", foreignKey: "shop_id"});
  shop.hasMany(base_product, { as: "base_products", foreignKey: "shop_id"});
  customer_group.belongsTo(shop, { as: "shop", foreignKey: "shop_id"});
  shop.hasMany(customer_group, { as: "customer_groups", foreignKey: "shop_id"});
  user.belongsTo(shop, { as: "shop", foreignKey: "shop_id"});
  shop.hasMany(user, { as: "users", foreignKey: "shop_id"});
  vendor.belongsTo(shop, { as: "shop", foreignKey: "shop_id"});
  shop.hasMany(vendor, { as: "vendors", foreignKey: "shop_id"});
  _order.belongsTo(user, { as: "person_in_charge_user", foreignKey: "person_in_charge"});
  user.hasMany(_order, { as: "_orders", foreignKey: "person_in_charge"});
  feedback.belongsTo(user, { as: "person_in_charge_user", foreignKey: "person_in_charge"});
  user.hasMany(feedback, { as: "feedbacks", foreignKey: "person_in_charge"});
  import_order.belongsTo(user, { as: "person_in_charge_user", foreignKey: "person_in_charge"});
  user.hasMany(import_order, { as: "import_orders", foreignKey: "person_in_charge"});
  return_order.belongsTo(user, { as: "person_in_charge_user", foreignKey: "person_in_charge"});
  user.hasMany(return_order, { as: "return_orders", foreignKey: "person_in_charge"});
  user_role.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(user_role, { as: "user_roles", foreignKey: "user_id"});
  warehouse_balance.belongsTo(user, { as: "person_in_charge_user", foreignKey: "person_in_charge"});
  user.hasMany(warehouse_balance, { as: "warehouse_balances", foreignKey: "person_in_charge"});
  balance_variant.belongsTo(variant, { as: "variant", foreignKey: "variant_id"});
  variant.hasMany(balance_variant, { as: "balance_variants", foreignKey: "variant_id"});
  import_item.belongsTo(variant, { as: "variant", foreignKey: "variant_id"});
  variant.hasMany(import_item, { as: "import_items", foreignKey: "variant_id"});
  order_line.belongsTo(variant, { as: "variant", foreignKey: "variant_id"});
  variant.hasMany(order_line, { as: "order_lines", foreignKey: "variant_id"});
  return_order_line.belongsTo(variant, { as: "variant", foreignKey: "variant_id"});
  variant.hasMany(return_order_line, { as: "return_order_lines", foreignKey: "variant_id"});
  import_order.belongsTo(vendor, { as: "vendor", foreignKey: "vendor_id"});
  vendor.hasMany(import_order, { as: "import_orders", foreignKey: "vendor_id"});
  balance_variant.belongsTo(warehouse_balance, { as: "balance", foreignKey: "balance_id"});
  warehouse_balance.hasMany(balance_variant, { as: "balance_variants", foreignKey: "balance_id"});

  return {
    _order,
    balance_variant,
    base_product,
    customer,
    customer_group,
    feedback,
    import_item,
    import_order,
    order_line,
    payment,
    return_order,
    return_order_line,
    role,
    sequelizemeta,
    shop,
    user,
    user_role,
    variant,
    vendor,
    warehouse_balance,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
