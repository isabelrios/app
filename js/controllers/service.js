define(["exports", "components/fxos-mvc/dist/mvc", "js/views/service"], function (exports, _componentsFxosMvcDistMvc, _jsViewsService) {
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
  var Service = _jsViewsService["default"];
  var ServiceController = (function (Controller) {
    var ServiceController = function ServiceController() {
      Controller.apply(this, arguments);
    };

    _extends(ServiceController, Controller);

    ServiceController.prototype.main = function (id) {
      ReactDOM.render(React.createElement(Service, {
        id: id,
        foxbox: this.foxbox
      }), this.mountNode);
    };

    return ServiceController;
  })(Controller);

  exports["default"] = ServiceController;
});