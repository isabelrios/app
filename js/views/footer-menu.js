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

  var FooterMenu = (function (React) {
    var FooterMenu = function FooterMenu() {
      React.Component.apply(this, arguments);
    };

    _extends(FooterMenu, React.Component);

    FooterMenu.prototype.shouldComponentUpdate = function () {
      // We never need to update this component as it is being recreated each time
      // the route changes.
      return false;
    };

    FooterMenu.prototype.render = function () {
      var route = location.hash.substr(1).split("/").shift();
      var menuNodes = [["services", "Home"], ["themes", "Themes"], ["mr-fox", "Mr. Fox"], ["settings", "Settings"]].map(function (menu) {
        return (React.createElement("li", {
          key: menu[0],
          className: route === menu[0] ? "active" : undefined
        }, React.createElement("a", {
          href: "#" + menu[0]
        }, menu[1])));
      });

      return (React.createElement("footer", null, React.createElement("ul", {
        className: "footer"
      }, menuNodes)));
    };

    return FooterMenu;
  })(React);

  exports["default"] = FooterMenu;
});