"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyAdminAndUser = exports.onlyUser = exports.onlyAdmin = exports.OrderStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "Pending";
    OrderStatus["PROCESSING"] = "Processing";
    OrderStatus["SHIPPED"] = "Shipped";
    OrderStatus["CANCELED"] = "Canceled";
    OrderStatus["COMPLETED"] = "Completed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
exports.onlyAdmin = [Role.ADMIN];
exports.onlyUser = [Role.USER];
exports.onlyAdminAndUser = [Role.ADMIN, Role.USER];
