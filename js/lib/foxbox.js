define(["exports", "components/fxos-mvc/dist/mvc", "./foxbox-settings", "./foxbox-db"], function (exports, _componentsFxosMvcDistMvc, _foxboxSettings, _foxboxDb) {
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

  /* global URLSearchParams */

  "use strict";

  var Service = _componentsFxosMvcDistMvc.Service;
  var FoxboxSettings = _foxboxSettings["default"];
  var FoxboxDb = _foxboxDb["default"];


  var settings = new FoxboxSettings();
  var db = new FoxboxDb();

  /**
   * Request a JSON from a specified URL.
   *
   * @param {string} url The URL to send the request to.
   * @param {string} method The HTTP method (defaults to "GET").
   * @param {!Object} body An object of key/value.
   * @return {Promise}
   */
  var fetchJSON = function (url, method, body) {
    if (method === undefined) method = "GET";
    if (body === undefined) body = undefined;
    return (function () {
      method = method.toUpperCase();

      var req = {
        method: method,
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      };

      if (method === "POST" || method === "PUT") {
        req.headers["Content-Type"] = "application/json;charset=UTF-8";
      }
      if (settings.session) {
        // The user is logged in, we authenticate the request.
        req.headers.Authorization = "Bearer " + settings.session;
      }

      if (method === "GET" || method === "HEAD") {
        body = undefined;
      }
      if (body !== undefined) {
        req.body = JSON.stringify(body);
      }

      return fetch(url, req).then(function (res) {
        if (res.ok) {
          return res.json();
        }

        throw new TypeError("The response returned a " + res.status + " HTTP status code.");
      });
    })();
  };

  /**
   * Compare 2 objects. Returns true if all properties of object A have the same
   * value in object B. Extraneous properties in object B are ignored.
   * Properties order is not important.
   *
   * @param {Object} objectA
   * @param {Object} objectB
   * @return {boolean}
   */
  var isSimilar = function (objectA, objectB) {
    for (var prop in objectA) {
      if (!(prop in objectB) || objectA[prop] !== objectB[prop]) {
        return false;
      }
    }

    return true;
  };

  var Foxbox = (function (Service) {
    var Foxbox = function Foxbox() {
      Service.apply(this, arguments);
    };

    _extends(Foxbox, Service);

    Foxbox.prototype.init = function () {
      var _this = this;
      return this._discover().then(function () {
        return _this._processUserSession();
      }).then(function () {
        // The DB is only initialised if there's no redirection to the box.
        return db.init();
      }).then(function () {
        // Start polling.
        settings.on("pollingEnabled", function () {
          _this.togglePolling(settings.pollingEnabled);
        });
        _this.togglePolling(settings.pollingEnabled);
      });
    };

    Foxbox.prototype._discover = function () {
      // For development purposes if you want to skip the
      // discovery phase set the 'foxbox-skipDiscovery' variable to
      // 'true'.
      if (settings.skipDiscovery) {
        return Promise.resolve();
      }

      return new Promise(function (resolve, reject) {
        fetchJSON(settings.registrationService).then(function (boxes) {
          if (!Array.isArray(boxes) || boxes.length === 0) {
            return resolve();
          }

          // Multi box setup out of the scope so far.
          var box = boxes[0];

          // Check if we have a recent registry.
          var now = Math.floor(Date.now() / 1000);
          if ((now - box.timestamp) < 60) {
            settings.hostname = box.hostname || box.local_ip;
          }

          resolve();
        })["catch"](function () {
          // When something goes wrong, we still want to resolve the promise so
          // that a hostname set previously is reused.
          resolve();
        });
      });
    };

    Foxbox.prototype._processUserSession = function () {
      if (this.isLoggedIn) {
        return;
      }

      var queryString = location.search.substring(1);
      var searchParams = new URLSearchParams(queryString);

      if (searchParams.has("session_token")) {
        // There is a session token in the URL, let's remember it.
        // @todo Find a better way to handle URL escape.
        settings.session = searchParams.get("session_token").replace(/ /g, "+");

        // Remove the session param from the current location.
        searchParams["delete"]("session_token");
        location.search = searchParams.toString();

        // Throwing here to abort the promise chain.
        throw (new Error("Redirecting to a URL without session"));
      }
    };

    Foxbox.prototype.login = function () {
      if (this.isLoggedIn) {
        return;
      }

      var redirectUrl = encodeURIComponent(location);
      location.replace("" + this.origin + "/?redirect_url=" + redirectUrl);
    };

    Foxbox.prototype.logout = function () {
      settings.session = undefined;
    };

    Foxbox.prototype.togglePolling = function (pollingEnabled) {
      var _this2 = this;
      if (pollingEnabled === undefined) pollingEnabled = settings.pollingEnabled;
      return (function () {
        if (pollingEnabled) {
          _this2.pollingInterval = setInterval(_this2.refreshServicesByPolling.bind(_this2), settings.pollingInterval);

          // We immediately sync the data with the box.
          _this2.refreshServicesByPolling();
        } else {
          clearInterval(_this2.pollingInterval);
        }
      })();
    };

    Foxbox.prototype.refreshServicesByPolling = function () {
      var _this3 = this;
      if (!this.isLoggedIn) {
        return Promise.resolve();
      }

      return new Promise(function (resolve, reject) {
        var hasChanged = false;

        Promise.all([_this3.getServices(), fetchJSON("" + _this3.origin + "/services/list")]).then(function (res) {
          // Detect newly connected/disconnected services.
          var storedServices = res[0];
          var fetchedServices = res[1];

          // Any newly connected devices?
          fetchedServices.some(function (serviceA) {
            var service = storedServices.find(function (serviceB) {
              return serviceA.id === serviceB.id;
            });
            if (!service) {
              hasChanged = true;
              return true;
            }
          });

          // Any newly disconnected devices?
          storedServices.some(function (serviceA) {
            var service = fetchedServices.find(function (serviceB) {
              return serviceA.id === serviceB.id;
            });
            if (!service) {
              hasChanged = true;
              return true;
            }
          });

          return [storedServices, fetchedServices];
        }).then(function (res) {
          // Detect change in service states.
          var storedServices = res[0];
          var fetchedServices = res[1];

          Promise.all(fetchedServices.map(function (service) {
            return _this3.getServiceState(service.id);
          })).then(function (states) {
            fetchedServices.forEach(function (fetchedService, id) {
              // Populate the service objects with states.
              fetchedService.state = states[id];

              var storedService = storedServices.find(function (s) {
                return s.id === fetchedService.id;
              });

              if (!storedService) {
                _this3._dispatchEvent("service-state-change", fetchedService);

                // Populate the db with the latest service.
                db.setService(fetchedService);

                return;
              }

              if (!isSimilar(fetchedService.state, storedService.state)) {
                fetchedService = Object.assign(storedService, fetchedService);

                _this3._dispatchEvent("service-state-change", fetchedService);

                // Populate the db with the latest service.
                db.setService(fetchedService);
              }
            });

            if (hasChanged) {
              // The state of the services changes.
              _this3._dispatchEvent("service-change", fetchedServices);
            }

            return resolve(fetchedServices);
          });
        });
      });
    };

    Foxbox.prototype.getServices = function () {
      return db.getServices().then(function (services) {
        return services.map(function (service) {
          return service.data;
        });
      });
    };

    Foxbox.prototype.getServiceState = function (id) {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        fetchJSON("" + _this4.origin + "/services/" + id + "/state").then(function (res) {
          if (!res) {
            return reject(new Error("The action couldn't be performed."));
          }

          return resolve(res);
        });
      });
    };

    Foxbox.prototype.setServiceState = function (id, state) {
      var _this5 = this;
      return new Promise(function (resolve, reject) {
        fetchJSON("" + _this5.origin + "/services/" + id + "/state", "PUT", state).then(function (res) {
          if (!res || !res.result || res.result !== "success") {
            return reject(new Error("The action couldn't be performed."));
          }

          return resolve();
        });
      });
    };

    Foxbox.prototype.getTags = function () {
      return db.getTags.apply(db, arguments);
    };

    Foxbox.prototype.getService = function () {
      // Get data from the DB so we get the attributes, the state and the tags.
      return db.getService.apply(db, arguments);
    };

    Foxbox.prototype.setService = function () {
      return db.setService.apply(db, arguments);
    };

    Foxbox.prototype.setTag = function () {
      return db.setTag.apply(db, arguments);
    };

    _classProps(Foxbox, null, {
      origin: {
        get: function () {
          return "" + settings.scheme + "://" + settings.hostname + ":" + settings.port;
        }
      },
      isLoggedIn: {
        get: function () {
          return !!settings.session;
        }
      }
    });

    return Foxbox;
  })(Service);

  exports["default"] = Foxbox;
});