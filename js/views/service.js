define(["exports", "js/views/user-logout-button", "js/views/footer-menu", "js/views/tag-list"], function (exports, _jsViewsUserLogoutButton, _jsViewsFooterMenu, _jsViewsTagList) {
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
  var TagList = _jsViewsTagList["default"];
  var Service = (function (React) {
    var Service = function Service(props) {
      React.Component.call(this, props);
      this.state = {
        data: {},
        tags: []
      };

      this.foxbox = props.foxbox;

      this.updateServiceState = this.updateServiceState.bind(this);
    };

    _extends(Service, React.Component);

    Service.prototype.componentDidMount = function () {
      var _this = this;
      this.foxbox.getService(this.props.id).then(function (service) {
        _this.updateServiceState(service.data);
      })["catch"](console.error.bind(console));

      this.populateTags();

      this.foxbox.addEventListener("service-state-change", this.updateServiceState);
    };

    Service.prototype.componentWillUnmount = function () {
      this.foxbox.removeEventListener("service-state-change", this.updateServiceState);
    };

    Service.prototype.updateServiceState = function (state) {
      this.setState({ data: state });
    };

    Service.prototype.populateTags = function () {
      var _this2 = this;
      this.foxbox.getTags().then(function (tags) {
        tags.forEach(function (tag) {
          tag.data.checked = !!(_this2.state.data.tags && _this2.state.data.tags.includes(tag.id));
        });

        _this2.setState({ tags: tags });
      });
    };

    Service.prototype.handleAddTag = function () {
      var _this3 = this;
      var tagName = prompt("Enter new tag name");

      if (!tagName || !tagName.trim()) {
        return;
      }

      tagName = tagName.trim();
      this.foxbox.setTag({ name: tagName }).then(function () {
        _this3.populateTags(); // Needed to get the newly added tag ID.
      });
    };

    Service.prototype.render = function () {
      return (React.createElement("div", null, React.createElement("header", null, React.createElement("h1", null, this.state.data.name), React.createElement(UserLogoutButton, {
        foxbox: this.foxbox
      })), React.createElement("h2", null, "Tags"), React.createElement(TagList, {
        tags: this.state.tags,
        serviceId: this.props.id,
        foxbox: this.foxbox
      }), React.createElement("div", {
        className: "add"
      }, React.createElement("span", {
        onClick: this.handleAddTag.bind(this)
      }, "Create a new tag")), React.createElement(FooterMenu, null)));
    };

    return Service;
  })(React);

  exports["default"] = Service;
});