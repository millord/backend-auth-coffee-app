const router = require("express").Router();
const { signup, signin } = require("../controllers/user");
const { userSignupValidator } = require("../validation");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);

module.exports = router;
