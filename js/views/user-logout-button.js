define(["exports"], function (exports) {
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

  var UserLogoutButton = (function (React) {
    var UserLogoutButton = function UserLogoutButton(props) {
      this.foxbox = props.foxbox;
    };

    _extends(UserLogoutButton, React.Component);

    UserLogoutButton.prototype.handleOnClick = function () {
      this.foxbox.logout();

      // Once logged out, we redirect to the login page.
      location.hash = "#users/login";
    };

    UserLogoutButton.prototype.render = function () {
      if (!this.foxbox.isLoggedIn) {
        return (React.createElement("div", {
          hidden: true
        }));
      }

      return (React.createElement("button", {
        className: "user-logout-button",
        onClick: this.handleOnClick.bind(this)
      }, "Log out"));
    };

    return UserLogoutButton;
  })(React);

  exports["default"] = UserLogoutButton;
});