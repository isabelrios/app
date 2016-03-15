define(["exports", "components/fxos-mvc/dist/mvc", "js/views/user-login"], function (exports, _componentsFxosMvcDistMvc, _jsViewsUserLogin) {
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

  var Controller = _componentsFxosMvcDistMvc.Controller;
  var UserLogin = _jsViewsUserLogin["default"];


  var ALLOWED_ACTIONS = ["login", "logout"];
  var DEFAULT_ACTION = ALLOWED_ACTIONS[0];

  var UsersController = (function (Controller) {
    var UsersController = function UsersController() {
      Controller.apply(this, arguments);
    };

    _extends(UsersController, Controller);

    UsersController.prototype.main = function (action) {
      var _this = this;
      if (action === undefined) action = DEFAULT_ACTION;
      return (function () {
        if (!ALLOWED_ACTIONS.includes(action)) {
          console.error("Bad users route: \"" + action + "\". Falling back to " + DEFAULT_ACTION + ".");
          action = DEFAULT_ACTION;
        }

        switch (action) {
          case "login":
            _this.login();
            break;

          case "logout":
            _this.logout();
            break;
        }
      })();
    };

    UsersController.prototype.login = function () {
      ReactDOM.render(React.createElement(UserLogin, { foxbox: this.foxbox }), this.mountNode);
    };

    UsersController.prototype.logout = function () {
      this.foxbox.logout();

      // Once logged out, we redirect to the login page.
      location.hash = "#users/login";
    };

    return UsersController;
  })(Controller);

  exports["default"] = UsersController;
});