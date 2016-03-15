define(["exports", "components/fxos-mvc/dist/mvc", "js/views/services"], function (exports, _componentsFxosMvcDistMvc, _jsViewsServices) {
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
  var Services = _jsViewsServices["default"];
  var ServicesController = (function (Controller) {
    var ServicesController = function ServicesController() {
      Controller.apply(this, arguments);
    };

    _extends(ServicesController, Controller);

    ServicesController.prototype.main = function () {
      ReactDOM.render(React.createElement(Services, {
        foxbox: this.foxbox
      }), this.mountNode);
    };

    return ServicesController;
  })(Controller);

  exports["default"] = ServicesController;
});