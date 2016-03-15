define(["exports", "js/views/services-list-item"], function (exports, _jsViewsServicesListItem) {
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

  var ServicesListItem = _jsViewsServicesListItem["default"];
  var ServicesList = (function (React) {
    var ServicesList = function ServicesList() {
      React.Component.apply(this, arguments);
    };

    _extends(ServicesList, React.Component);

    ServicesList.prototype.render = function () {
      var _this = this;
      var serviceNodes = this.props.services.map(function (service, id) {
        return (React.createElement(ServicesListItem, {
          key: service.id,
          id: service.id,
          name: service.name,
          type: service.properties.type,
          manufacturer: service.properties.manufacturer,
          modelid: service.properties.model,
          state: service.state,
          foxbox: _this.props.foxbox
        }));
      });

      return (React.createElement("ul", {
        className: "service-list"
      }, serviceNodes));
    };

    return ServicesList;
  })(React);

  exports["default"] = ServicesList;
});