define(["exports", "components/fxos-mvc/dist/mvc", "js/controllers/users", "js/controllers/services", "js/controllers/service", "js/lib/foxbox", "js/lib/qr"], function (exports, _componentsFxosMvcDistMvc, _jsControllersUsers, _jsControllersServices, _jsControllersService, _jsLibFoxbox, _jsLibQr) {
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

  var RoutingController = _componentsFxosMvcDistMvc.RoutingController;
  var UsersController = _jsControllersUsers["default"];
  var ServicesController = _jsControllersServices["default"];
  var ServiceController = _jsControllersService["default"];
  var Foxbox = _jsLibFoxbox["default"];
  var Qr = _jsLibQr["default"];
  var MainController = (function (RoutingController) {
    var MainController = function MainController() {
      var foxbox = new Foxbox();
      var mountNode = document.getElementById("main");
      var options = { foxbox: foxbox, mountNode: mountNode };

      var usersController = new UsersController(options);
      RoutingController.call(this, {
        "": usersController,
        "users/(.+)": usersController,
        services: new ServicesController(options),
        "services/(.+)": new ServiceController(options)
      });

      this.foxbox = foxbox;

      if (window.cordova) {
        // FIXME: Adding this to the `window` global for debugging, should
        // integrate this into the app's UI, see
        // https://github.com/fxbox/app/issues/6
        window.qr = new Qr();
      }
    };

    _extends(MainController, RoutingController);

    MainController.prototype.main = function () {
      var _this = this;
      this.foxbox.init().then(function () {
        if (_this.foxbox.isLoggedIn) {
          if (location.hash === "") {
            location.hash = "#services";
          }
        } else {
          location.hash = "#users/login";
        }

        _this.route();
      });
    };

    return MainController;
  })(RoutingController);

  exports["default"] = MainController;
});