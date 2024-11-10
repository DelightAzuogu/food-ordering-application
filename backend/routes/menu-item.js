const express = require("express");
const { body } = require("express-validator");
const Multer = require("multer");
const fs = require("fs");
const path = require("path");

const restAuth = require("../util/rest-Auth");
const menuController = require("../controllers/menu-item");

const router = express.Router();

const { memoryStorage } = require("multer");

//multer option
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerStorage = Multer.diskStorage({
  destination: function (req, file, cb) {
    const restaurantDirectory = "menu/";
    if (!fs.existsSync(restaurantDirectory)) {
      fs.mkdirSync(restaurantDirectory);
    }
    cb(null, restaurantDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

const upload = new Multer({ storage: multerStorage, fileFilter });

//add-item
router.post(
  "/add-item",
  upload.single("image"),
  [
    body("name").notEmpty().trim(),
    body("description").notEmpty().trim(),
    body("price").isNumeric().trim(),
  ],
  restAuth,
  menuController.putAddItem
);

//edi-item
router.post(
  "/edit-item/:id",
  upload.single("image"),
  [
    body("name").notEmpty().trim(),
    body("description").notEmpty().trim(),
    body("price").isNumeric().trim(),
  ],
  restAuth,
  menuController.postEditMenuItem
);

router.post("/delete/:id", restAuth, menuController.deleteItem);

router.get("/:restaurantId", menuController.getRestaurantMenuItems);

router.get("/image/:menuId", menuController.getMenuItemImage);

module.exports = router;
