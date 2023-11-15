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

 Date: 15/11/2023 15:55:00
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
-- Table structure for t_order
-- ----------------------------
DROP TABLE IF EXISTS `t_order`;
CREATE TABLE `t_order`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `foodlist` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '餐品列表',
  `addressid` int NOT NULL COMMENT '所选地址id',
  `shopid` int NOT NULL COMMENT '店铺id',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `totalprice` decimal(10, 2) NOT NULL COMMENT '总价',
  `tablewarenum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '餐具数量',
  `selectArriveTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '选择送达时间',
  `foodnum` int NOT NULL COMMENT '餐品数量',
  `userid` int NOT NULL COMMENT '用户id',
  `deliveryState` int NOT NULL COMMENT '配送状态',
  `orderTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '下单时间',
  `orderNum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_order
-- ----------------------------
INSERT INTO `t_order` VALUES (33, '[{\"id\":1,\"productName\":\"鱼香肉丝\",\"mainPhoto\":\"product/yxrs.jpg\",\"price\":20,\"shopId\":1,\"sales\":51,\"discount\":7,\"count\":1,\"typeid\":1,\"typeName\":\"本店特色\"},{\"id\":2,\"productName\":\"宫保鸡丁\",\"mainPhoto\":\"product/gbjd.jpg\",\"price\":22,\"shopId\":1,\"sales\":37,\"discount\":6.8,\"count\":1,\"typeid\":2,\"typeName\":\"正在热卖\"}]', 3, 1, '对商家：不要香菜', 30.96, '1份', '13:50', 2, 3, 3, '2023-11-14 13:11:01', '2023111413110115523085678');
INSERT INTO `t_order` VALUES (34, '[{\"id\":3,\"productName\":\"剁椒鱼头\",\"mainPhoto\":\"product/djyt.jpg\",\"price\":25,\"shopId\":2,\"sales\":63,\"discount\":10,\"count\":1,\"typeid\":1,\"typeName\":\"本店特色\"},{\"id\":5,\"productName\":\"土豆红烧肉\",\"mainPhoto\":\"product/tdhsr.jpg\",\"price\":16,\"shopId\":2,\"sales\":86,\"discount\":8,\"count\":1,\"typeid\":4,\"typeName\":\"满满的肉\"},{\"id\":6,\"productName\":\"经典猪脚饭\",\"mainPhoto\":\"product/zjf.jpg\",\"price\":15,\"shopId\":2,\"sales\":103,\"discount\":9,\"count\":1,\"typeid\":5,\"typeName\":\"回味经典\"}]', 17, 2, '对骑手：放门口', 54.30, '2份', '16:46', 3, 3, 3, '2023-11-14 15:02:10', '2023111415021015529865496');
INSERT INTO `t_order` VALUES (35, '[{\"id\":1,\"productName\":\"鱼香肉丝\",\"mainPhoto\":\"product/yxrs.jpg\",\"price\":20,\"shopId\":1,\"sales\":51,\"discount\":7,\"count\":2,\"typeid\":1,\"typeName\":\"本店特色\"},{\"id\":2,\"productName\":\"宫保鸡丁\",\"mainPhoto\":\"product/gbjd.jpg\",\"price\":22,\"shopId\":1,\"sales\":37,\"discount\":6.8,\"count\":1,\"typeid\":2,\"typeName\":\"正在热卖\"},{\"id\":4,\"productName\":\"腊肉抄豆腐\",\"mainPhoto\":\"product/nrcdf.jpg\",\"price\":18,\"shopId\":1,\"sales\":26,\"discount\":10,\"count\":1,\"typeid\":3,\"typeName\":\"店长推荐\"}]', 3, 1, '不要香菜对骑手：对商家：', 64.96, '1份', '18:48', 4, 3, 2, '2023-11-14 17:38:42', '2023111417384215523085678');
INSERT INTO `t_order` VALUES (36, '[{\"id\":3,\"productName\":\"剁椒鱼头\",\"mainPhoto\":\"product/djyt.jpg\",\"price\":25,\"shopId\":2,\"sales\":63,\"discount\":10,\"count\":1,\"typeid\":1,\"typeName\":\"本店特色\"}]', 17, 2, '快点儿快点儿快饿死了求求了求求了', 26.00, '无需餐具', '18:27', 1, 3, 1, '2023-11-14 17:42:52', '2023111417425215529865496');
INSERT INTO `t_order` VALUES (37, '[{\"id\":1,\"productName\":\"鱼香肉丝\",\"mainPhoto\":\"product/yxrs.jpg\",\"price\":20,\"shopId\":1,\"sales\":51,\"discount\":7,\"count\":2,\"typeid\":1,\"typeName\":\"本店特色\"},{\"id\":2,\"productName\":\"宫保鸡丁\",\"mainPhoto\":\"product/gbjd.jpg\",\"price\":22,\"shopId\":1,\"sales\":37,\"discount\":6.8,\"count\":1,\"typeid\":2,\"typeName\":\"正在热卖\"},{\"id\":4,\"productName\":\"腊肉抄豆腐\",\"mainPhoto\":\"product/nrcdf.jpg\",\"price\":18,\"shopId\":1,\"sales\":26,\"discount\":10,\"count\":1,\"typeid\":3,\"typeName\":\"店长推荐\"}]', 17, 1, '大哥多加点儿肉', 64.96, '3份', '15:24', 4, 3, 0, '2023-11-15 14:44:51', '2023111514445115529865496');

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

-- ----------------------------
-- Table structure for u_address
-- ----------------------------
DROP TABLE IF EXISTS `u_address`;
CREATE TABLE `u_address`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userid` int NOT NULL COMMENT 'userid',
  `proAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户大致地址',
  `consignee` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户称呼',
  `detilAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户详细地址',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户手机号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of u_address
-- ----------------------------
INSERT INTO `u_address` VALUES (3, 3, '重庆理工大学花溪校区', '龙东强', '竹轩B316', '15523085678');
INSERT INTO `u_address` VALUES (17, 3, '重庆理工大学花溪校区', '菜就多练', '3教210', '15529865496');

-- ----------------------------
-- Table structure for wxuser
-- ----------------------------
DROP TABLE IF EXISTS `wxuser`;
CREATE TABLE `wxuser`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '头像',
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'openid',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wxuser
-- ----------------------------
INSERT INTO `wxuser` VALUES (3, '我姓王', 'avatar/EbADoZJ36CJp06ed4269da79f41956946bcdf4b1fa02.jpg', 'oynkS5nR3I1dZDfC9-RIb0z98ucQ');

SET FOREIGN_KEY_CHECKS = 1;
