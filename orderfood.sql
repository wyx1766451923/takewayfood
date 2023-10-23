/*
 Navicat Premium Data Transfer

 Source Server         : Takeaway
 Source Server Type    : MySQL
 Source Server Version : 80032
 Source Host           : localhost:3306
 Source Schema         : orderfood

 Target Server Type    : MySQL
 Target Server Version : 80032
 File Encoding         : 65001

 Date: 23/10/2023 19:08:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `username` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('admin', 'admin', 1);

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `noticeId` int NOT NULL AUTO_INCREMENT COMMENT '公告id',
  `title` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '标题',
  `content` varchar(800) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '公告内容',
  `publishDate` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`noticeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_notice
-- ----------------------------
INSERT INTO `t_notice` VALUES (1, '小程序外卖送餐平台成立', '各位同学，欢迎来这里选择订餐', '2020-05-10 18:05:00');
INSERT INTO `t_notice` VALUES (2, '订餐多多，实惠多多', '大家多多来订餐，我们入住的都是最实惠的餐饮店', '2020-05-14 00:12:34');

-- ----------------------------
-- Table structure for t_orderinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_orderinfo`;
CREATE TABLE `t_orderinfo`  (
  `orderId` int NOT NULL AUTO_INCREMENT COMMENT '订单编号',
  `productId` int NOT NULL COMMENT '商品id',
  `orderNum` int NOT NULL COMMENT '订单数量',
  `totalMoney` float NOT NULL COMMENT '订单总金额',
  `payWay` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '支付方式',
  `orderStateObj` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '订单状态',
  `receiveName` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货人',
  `telephone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货人电话',
  `address` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货人地址',
  `orderMemo` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '订单备注',
  `userObj` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '下单用户',
  `orderTime` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '下单时间',
  PRIMARY KEY (`orderId`) USING BTREE,
  INDEX `productObj`(`productId` ASC) USING BTREE,
  INDEX `userObj`(`userObj` ASC) USING BTREE,
  CONSTRAINT `t_orderinfo_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `t_product` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_2` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_orderinfo
-- ----------------------------
INSERT INTO `t_orderinfo` VALUES (1, 1, 2, 40, '微信', '已下单', '李晓彤', '13985012083', '芙蓉8宿舍224寝室', '快递送货，饿死了', '13910831234', '2020-05-10 11:20:11');
INSERT INTO `t_orderinfo` VALUES (2, 2, 2, 44, '支付宝', '已下单', '黄小琥', '13980224234', '香樟小区4栋1203', '快哦', '13688886666', '2020-05-12 23:08:56');
INSERT INTO `t_orderinfo` VALUES (3, 3, 3, 75, '支付宝', '送货中', '李明堂', '13598010834', '南校区12宿舍', '来吧', '13688886666', '2020-05-13 00:34:00');

-- ----------------------------
-- Table structure for t_product
-- ----------------------------
DROP TABLE IF EXISTS `t_product`;
CREATE TABLE `t_product`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '商品id',
  `productName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '服务名称',
  `mainPhoto` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '服务图片',
  `price` float NOT NULL COMMENT '套餐价格',
  `shopId` int NOT NULL COMMENT '商家id',
  `sales` int NOT NULL COMMENT '销量',
  `discount` float NOT NULL COMMENT '折扣，0为不打折',
  `count` int NULL DEFAULT NULL COMMENT '初始数量',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `shopId`(`shopId` ASC) USING BTREE,
  CONSTRAINT `t_product_ibfk_1` FOREIGN KEY (`shopId`) REFERENCES `t_shop` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_product
-- ----------------------------
INSERT INTO `t_product` VALUES (1, '鱼香肉丝', 'product/yxrs.jpg', 20, 1, 51, 7, NULL);
INSERT INTO `t_product` VALUES (2, '宫保鸡丁', 'product/gbjd.jpg', 22, 1, 37, 6.8, NULL);
INSERT INTO `t_product` VALUES (3, '剁椒鱼头', 'product/djyt.jpg', 25, 2, 63, 10, NULL);
INSERT INTO `t_product` VALUES (4, '腊肉抄豆腐', 'product/nrcdf.jpg', 18, 1, 26, 10, NULL);
INSERT INTO `t_product` VALUES (5, '土豆红烧肉', 'product/tdhsr.jpg', 16, 2, 86, 8, NULL);
INSERT INTO `t_product` VALUES (6, '经典猪脚饭', 'product/zjf.jpg', 15, 2, 103, 9, NULL);

-- ----------------------------
-- Table structure for t_shop
-- ----------------------------
DROP TABLE IF EXISTS `t_shop`;
CREATE TABLE `t_shop`  (
  `id` int NOT NULL COMMENT '商家id',
  `password` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '登录密码',
  `shopName` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '打印店名称',
  `shopPhoto` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '打印店照片',
  `bornDate` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '成立日期',
  `connectPerson` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '联系人',
  `telephone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '联系电话',
  `address` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '打印店地址',
  `startPrice` int NOT NULL COMMENT '起送价格',
  `deliveryFees` int NOT NULL COMMENT '配送费',
  `deliveryTime` int NOT NULL COMMENT '配送时间',
  `isOpen` int NOT NULL COMMENT '是否开业，1开业，0未开业',
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '描述',
  `announcement` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '公告',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_shop
-- ----------------------------
INSERT INTO `t_shop` VALUES (1, '123', '躺平菜馆', 'shop/tp.png', '2020-05-05', '王先生', '13420182861', '理工大学竹轩', 10, 1, 30, 1, '你可以选择躺平，但是你不能不吃饭', '本店为新店，欢迎各位品尝啊');
INSERT INTO `t_shop` VALUES (2, '123', '摆烂传统餐馆', 'shop/bl.png', '2020-05-13', '李先生', '13784504082', '理工大学操场', 15, 1, 35, 1, '摆摆烂吧，顺便吃吃好吃有营养的饭，等你的订单到天荒地老', NULL);

-- ----------------------------
-- Table structure for t_type
-- ----------------------------
DROP TABLE IF EXISTS `t_type`;
CREATE TABLE `t_type`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `typeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名字',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_type
-- ----------------------------
INSERT INTO `t_type` VALUES (1, '本店特色');
INSERT INTO `t_type` VALUES (2, '正在热卖');
INSERT INTO `t_type` VALUES (3, '店长推荐');
INSERT INTO `t_type` VALUES (4, '满满的肉');
INSERT INTO `t_type` VALUES (5, '回味经典');

-- ----------------------------
-- Table structure for t_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_userinfo`;
CREATE TABLE `t_userinfo`  (
  `user_name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'user_name',
  `password` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '登录密码',
  `name` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '姓名',
  `gender` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '性别',
  `birthDate` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '出生日期',
  `userPhoto` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户照片',
  `telephone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '邮箱',
  `address` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '家庭地址',
  `regTime` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '注册时间',
  `openid` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_userinfo
-- ----------------------------
INSERT INTO `t_userinfo` VALUES ('13688886666', '--', '鼠鼠', '男', '2020-01-01', 'upload/4b68b224b63d4c92a9e63916ebf1ca1f', '13688886666', '--', '--', '2020-05-10 23:14:39', 'oM7Mu5XyeVJSc8roaUCRlcz_IP9k');
INSERT INTO `t_userinfo` VALUES ('13910831234', '123', '张若曦', '女', '2020-05-06', 'upload/9e6cca88-d7c6-46df-8eb4-5a9dd12840a5.jpg', '13910831234', 'wagnxiagging@126.com', '四川成都红星路', '2020-05-10 18:00:45', NULL);

-- ----------------------------
-- Table structure for typeproduct
-- ----------------------------
DROP TABLE IF EXISTS `typeproduct`;
CREATE TABLE `typeproduct`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `typeid` int NOT NULL COMMENT '分类id',
  `productid` int NOT NULL COMMENT '餐品id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of typeproduct
-- ----------------------------
INSERT INTO `typeproduct` VALUES (1, 1, 1);
INSERT INTO `typeproduct` VALUES (2, 1, 3);
INSERT INTO `typeproduct` VALUES (3, 2, 2);
INSERT INTO `typeproduct` VALUES (4, 3, 4);
INSERT INTO `typeproduct` VALUES (5, 4, 5);
INSERT INTO `typeproduct` VALUES (6, 5, 6);

-- ----------------------------
-- Table structure for typeshop
-- ----------------------------
DROP TABLE IF EXISTS `typeshop`;
CREATE TABLE `typeshop`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `typeid` int NOT NULL COMMENT '分类id',
  `shopid` int NOT NULL COMMENT '餐厅id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of typeshop
-- ----------------------------
INSERT INTO `typeshop` VALUES (1, 1, 1);
INSERT INTO `typeshop` VALUES (2, 1, 2);
INSERT INTO `typeshop` VALUES (3, 2, 1);
INSERT INTO `typeshop` VALUES (4, 3, 1);
INSERT INTO `typeshop` VALUES (5, 4, 2);
INSERT INTO `typeshop` VALUES (6, 5, 2);

SET FOREIGN_KEY_CHECKS = 1;
