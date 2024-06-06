import passport = require("passport");

export default interface AuthStrategy {
  getStrategy(): passport.Strategy;
}