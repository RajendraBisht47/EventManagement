const { Router } = require("express");
const User = require("../models/user");
const Vendor = require("../models/vendor");

//jwt
const JWT = require("jsonwebtoken");
const Product = require("../models/product");
const secret = "123";
//

const router = Router();

router.get("/login", (req, res) => {
  return res.render("adminlogin");
});

router.post("/login", async (req, res) => {
  try {
    const { id, pasword } = req.body;

    if (id != "1234567890" && pasword != "1") {
      return res.render("adminlogin", {
        message: "Invalid ID or password",
      });
    }

    const payload = {
      id: id,
      password: pasword,
    };

    const token = JWT.sign(payload, secret);

    return res.cookie("token", token).render("admin");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).render("signup", {
      message: "Server error",
    });
  }
});

router.get("/user", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.render("adminlogin", {
      message: "You can not access this profile",
    });
  }

  const decoded = JWT.verify(token, secret);

  const users = await User.find({});

  res.render("maintainuser", { users });
});

router.post("/delete/user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  const users = await User.find({});

  res.render("maintainuser", { users });
});

router.get("/vendor", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.render("adminlogin", {
      message: "You can not access this profile",
    });
  }

  const decoded = JWT.verify(token, secret);

  const users = await Vendor.find({});

  res.render("maintainvendor", { users });
});

router.post("/delete/vendor/:id", async (req, res) => {
  await Vendor.findByIdAndDelete(req.params.id);

  const users = await Vendor.find({});

  res.render("maintainvendor", { users });
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
