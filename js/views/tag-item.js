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

  var TagItem = (function (React) {
    var TagItem = function TagItem(props) {
      React.Component.call(this, props);
      this.props = props;
      this.state = { checked: props.checked };

      this.foxbox = props.foxbox;
    };

    _extends(TagItem, React.Component);

    TagItem.prototype.handleSetTag = function (evt) {
      var _this = this;
      var value = evt.target.checked;
      this.setState({ checked: value });

      this.foxbox.getService(this.props.serviceId).then(function (service) {
        if (!service.data.tags) {
          service.data.tags = [];
        }

        service.data.tags = service.data.tags.filter(function (tag) {
          return tag !== _this.props.id;
        });
        if (value) {
          service.data.tags.push(_this.props.id);
        }

        _this.foxbox.setService(service.data);
      })["catch"](function (error) {
        _this.setState({ checked: !value }); // Revert back to original state.
        console.error(error);
      });
    };

    TagItem.prototype.render = function () {
      return (React.createElement("li", null, React.createElement("label", null, React.createElement("input", {
        type: "checkbox",
        checked: this.state.checked,
        onChange: this.handleSetTag.bind(this)
      }), this.props.name)));
    };

    return TagItem;
  })(React);

  exports["default"] = TagItem;
});