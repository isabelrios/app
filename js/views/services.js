define(["exports", "js/views/user-logout-button", "js/views/footer-menu", "js/views/services-list", "js/views/modal"], function (exports, _jsViewsUserLogoutButton, _jsViewsFooterMenu, _jsViewsServicesList, _jsViewsModal) {
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

  var UserLogoutButton = _jsViewsUserLogoutButton["default"];
  var FooterMenu = _jsViewsFooterMenu["default"];
  var ServicesList = _jsViewsServicesList["default"];
  var Modal = _jsViewsModal["default"];
  var Services = (function (React) {
    var Services = function Services(props) {
      React.Component.call(this, props);
      this.state = {
        services: [],

        isModalVisible: false,
        title: "",
        body: ""
      };

      this.foxbox = props.foxbox;

      this.updateService = this.updateService.bind(this);
      this.updateServiceState = this.updateServiceState.bind(this);
    };

    _extends(Services, React.Component);

    Services.prototype.componentDidMount = function () {
      var _this = this;
      this.foxbox.getServices().then(function (services) {
        console.log(services);
        _this.updateService(services);
      })["catch"](console.error.bind(console));

      this.foxbox.getTags().then(function (tags) {
        console.log(tags);
      })["catch"](console.error.bind(console));

      this.foxbox.addEventListener("service-change", this.updateService);
      this.foxbox.addEventListener("service-state-change", this.updateServiceState);
    };

    Services.prototype.componentWillUnmount = function () {
      this.foxbox.removeEventListener("service-change", this.updateService);
      this.foxbox.removeEventListener("service-state-change", this.updateServiceState);
    };

    Services.prototype.updateService = function (services) {
      this.setState({ services: services });
    };

    Services.prototype.updateServiceState = function (state) {
      // Find the index of the service which state has changed.
      var serviceId = this.state.services.findIndex(function (service) {
        return service.id === state.id;
      });
      var services = this.state.services;

      // Update the new state.
      services[serviceId] = state;
      this.setState({ services: services });
    };

    Services.prototype.dismissModal = function () {
      this.setState({ isModalVisible: false });
    };

    Services.prototype.render = function () {
      return (React.createElement("div", null, React.createElement("header", null, React.createElement("h1", null, "My Home"), React.createElement(UserLogoutButton, {
        foxbox: this.foxbox
      })), React.createElement("h2", null, "General"), React.createElement(ServicesList, {
        services: this.state.services,
        foxbox: this.foxbox
      }), React.createElement(Modal, {
        visible: this.state.isModalVisible,
        title: this.state.title,
        body: this.state.body,
        dismiss: this.dismissModal.bind(this)
      }), React.createElement(FooterMenu, null)));
    };

    return Services;
  })(React);

  exports["default"] = Services;
});