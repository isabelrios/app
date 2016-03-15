define(["exports", "js/views/modal"], function (exports, _jsViewsModal) {
  "use strict";

  var _extends = function (child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
  };

  var Modal = _jsViewsModal["default"];
  var UserLogin = (function (React) {
    var UserLogin = function UserLogin(props) {
      this.foxbox = props.foxbox;
    };

    _extends(UserLogin, React.Component);

    UserLogin.prototype.handleOnSubmit = function (evt) {
      evt.preventDefault(); // Avoid redirection to /?.

      this.foxbox.login();
    };

    UserLogin.prototype.render = function () {
      return (React.createElement("div", null, React.createElement("header", {
        className: "white"
      }, React.createElement("h1", null, "Project Link")), React.createElement("form", {
        className: "user-login",
        onSubmit: this.handleOnSubmit.bind(this)
      }, React.createElement("img", {
        src: "img/icon.svg"
      }), React.createElement("button", null, "Log in"))));
    };

    return UserLogin;
  })(React);

  exports["default"] = UserLogin;
});