define(["exports", "components/fxos-mvc/dist/mvc"], function (exports, _componentsFxosMvcDistMvc) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

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

  "use strict";

  var Model = _componentsFxosMvcDistMvc.Model;


  // Prefix all entries to avoid collisions.
  var PREFIX = "foxbox-";

  var DEFAULT_SCHEME = "http";
  var DEFAULT_HOSTNAME = "localhost";
  var DEFAULT_PORT = 3000;
  var DEFAULT_POLLING_ENABLED = true;
  var POLLING_INTERVAL = 2000;
  var REGISTRATION_SERVICE = "http://knilxof.org:4242/ping";

  // Not all browsers have localStorage supported or activated.
  var storage = localStorage ? localStorage : {
    getItem: function () {
      return undefined;
    },
    setItem: function () {},
    removeItem: function () {}
  };

  var FoxboxSettings = (function (Model) {
    var FoxboxSettings = function FoxboxSettings() {
      Model.call(this, {
        _scheme: storage.getItem("" + PREFIX + "scheme") || DEFAULT_SCHEME,
        _hostname: storage.getItem("" + PREFIX + "hostname") || DEFAULT_HOSTNAME,
        _port: storage.getItem("" + PREFIX + "port") || DEFAULT_PORT,
        _session: storage.getItem("" + PREFIX + "session"),
        _skipDiscovery: storage.getItem("" + PREFIX + "skipDiscovery") === "true",
        _pollingEnabled: storage.getItem("" + PREFIX + "pollingEnabled") !== null ? storage.getItem("" + PREFIX + "pollingEnabled") === "true" : DEFAULT_POLLING_ENABLED
      });
    };

    _extends(FoxboxSettings, Model);

    FoxboxSettings.prototype.on = function (property, handler) {
      var prototype = Object.getPrototypeOf(this);
      var parent = Object.getPrototypeOf(prototype);

      parent.on.call(this, "_" + property, handler);
    };

    _classProps(FoxboxSettings, null, {
      scheme: {
        get: function () {
          return this._scheme;
        },
        set: function (scheme) {
          scheme = String(scheme) || DEFAULT_SCHEME;
          this._scheme = scheme;
          storage.setItem("" + PREFIX + "scheme", this._scheme);
        }
      },
      hostname: {
        get: function () {
          return this._hostname;
        },
        set: function (hostname) {
          hostname = String(hostname) || DEFAULT_HOSTNAME;
          this._hostname = hostname.replace(/\/$/, ""); // Trailing slash.
          storage.setItem("" + PREFIX + "hostname", this._hostname);
        }
      },
      port: {
        get: function () {
          return this._port;
        },
        set: function (port) {
          port = parseInt(port, 10) || DEFAULT_PORT;
          this._port = port;
          storage.setItem("" + PREFIX + "port", this._port);
        }
      },
      session: {
        get: function () {
          return this._session;
        },
        set: function (session) {
          if (session === undefined) {
            this._session = undefined;
            storage.removeItem("" + PREFIX + "session");
          } else {
            this._session = session;
            storage.setItem("" + PREFIX + "session", this._session);
          }
        }
      },
      registrationService: {
        get: function () {
          return REGISTRATION_SERVICE;
        }
      },
      skipDiscovery: {
        get: function () {
          return this._skipDiscovery;
        },
        set: function (value) {
          value = !!value;
          this._skipDiscovery = value;
          storage.setItem("" + PREFIX + "skipDiscovery", value);
        }
      },
      pollingEnabled: {
        get: function () {
          return this._pollingEnabled;
        },
        set: function (value) {
          value = !!value;
          this._pollingEnabled = value;
          storage.setItem("" + PREFIX + "pollingEnabled", value);
        }
      },
      pollingInterval: {
        get: function () {
          return POLLING_INTERVAL;
        }
      }
    });

    return FoxboxSettings;
  })(Model);

  exports["default"] = FoxboxSettings;
});