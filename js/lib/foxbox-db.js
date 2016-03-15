define(["exports"], function (exports) {
  "use strict";

  // The name of the db.
  var DB_NAME = "foxbox-db";

  // The version of the indexed database.
  var DB_VERSION = 1;

  var DB_SERVICE_STORE = "services";
  var DB_TAG_STORE = "tags";

  var FoxboxDb = (function () {
    var FoxboxDb = function FoxboxDb() {
      this.db = null;
    };

    FoxboxDb.prototype.init = function () {
      var _this = this;
      return new Promise(function (resolve, reject) {
        var req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = _this.upgradeSchema;
        req.onsuccess = function (evt) {
          _this.db = evt.target.result;

          // Prepopulate the tags with common values.
          _this.getTags().then(function (tags) {
            if (!tags || !tags.length) {
              _this.setTag({ name: "Kitchen" });
              _this.setTag({ name: "Bedroom" });
              _this.setTag({ name: "Living room" });
            }

            return resolve();
          });
        };
        req.onerror = function (e) {
          console.error("Error opening database:", e);
          return reject(e);
        };
      });
    };

    FoxboxDb.prototype.upgradeSchema = function (evt) {
      var db = evt.target.result;
      var fromVersion = evt.oldVersion;
      if (fromVersion < 1) {
        var store = db.createObjectStore(DB_SERVICE_STORE, { keyPath: "id" });
        store.createIndex("id", "id", { unique: true });
        store.createIndex("type", "type", { unique: false });

        store = db.createObjectStore(DB_TAG_STORE, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("name", "name", { unique: true });
      }
    };

    FoxboxDb.prototype.getServices = function () {
      return getAll(DB_SERVICE_STORE).call(this);
    };

    FoxboxDb.prototype.getTags = function () {
      return getAll(DB_TAG_STORE).call(this);
    };

    FoxboxDb.prototype.getService = function (id) {
      return getById(DB_SERVICE_STORE).call(this, id);
    };

    FoxboxDb.prototype.getTag = function (id) {
      return getById(DB_TAG_STORE).call(this, id);
    };

    FoxboxDb.prototype.setService = function (data) {
      return set(DB_SERVICE_STORE).call(this, data);
    };

    FoxboxDb.prototype.setTag = function (data) {
      return set(DB_TAG_STORE).call(this, data);
    };

    FoxboxDb.prototype.deleteService = function (data) {
      // Is useful?!
      return remove(DB_SERVICE_STORE).call(this, data);
    };

    FoxboxDb.prototype.deleteTag = function (data) {
      return remove(DB_TAG_STORE).call(this, data);
    };

    FoxboxDb.prototype.clearServices = function () {
      return clear(DB_SERVICE_STORE).call(this);
    };

    FoxboxDb.prototype.clearTags = function () {
      return clear(DB_TAG_STORE).call(this);
    };

    return FoxboxDb;
  })();

  exports["default"] = FoxboxDb;


  function getAll(store) {
    return function getAll() {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this2.db.transaction([store], "readonly");
        var results = [];
        txn.onerror = reject;
        txn.oncomplete = function () {
          resolve(results);
        };
        txn.objectStore(store).openCursor().onsuccess = function (evt) {
          var cursor = evt.target.result;
          if (cursor) {
            results.push(cursor.value);
            cursor["continue"]();
          }
        };
      });
    };
  }

  function getById(store) {
    return function getById(id) {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this3.db.transaction([store], "readonly");
        txn.onerror = reject;
        txn.objectStore(store).get(id).onsuccess = function (evt) {
          resolve(evt.target.result);
        };
      });
    };
  }

  function set(store) {
    return function set(data) {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this4.db.transaction([store], "readwrite");
        txn.oncomplete = resolve;
        txn.onerror = reject;
        try {
          if (data.id) {
            txn.objectStore(store).put({ id: data.id, data: data });
          } else {
            txn.objectStore(store).put({ data: data });
          }
        } catch (e) {
          console.error("Error putting data in " + DB_NAME + ":", e);
          resolve();
        }
      });
    };
  }

  function remove(store) {
    return function remove(id) {
      var _this5 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this5.db.transaction([store], "readwrite");
        txn.oncomplete = resolve;
        txn.onerror = reject;
        try {
          txn.objectStore(store)["delete"](id);
        } catch (e) {
          console.error("Error deleting data from " + DB_NAME + ":", e);
          resolve();
        }
      });
    };
  }

  function clear(store) {
    return function clear() {
      var _this6 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this6.db.transaction([store], "readwrite");
        txn.oncomplete = resolve;
        txn.onerror = reject;
        txn.objectStore(store).clear();
      });
    };
  }
});