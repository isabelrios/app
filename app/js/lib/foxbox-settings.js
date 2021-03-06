'use strict';

import { Model } from 'components/fxos-mvc/dist/mvc';

// Prefix all entries to avoid collisions.
const PREFIX = 'foxbox-';

const DEFAULT_SCHEME = 'http';
const DEFAULT_HOSTNAME = 'localhost';
const DEFAULT_PORT = 3000;
const DEFAULT_POLLING_ENABLED = true;
const POLLING_INTERVAL = 2000;
const REGISTRATION_SERVICE = 'http://knilxof.org:4242/ping';

// Not all browsers have localStorage supported or activated.
const storage = localStorage ? localStorage : {
  getItem: () => undefined,
  setItem: () => {},
  removeItem: () => {}
};

export default class FoxboxSettings extends Model {
  constructor() {
    super({
      _scheme: storage.getItem(`${PREFIX}scheme`) || DEFAULT_SCHEME,
      _hostname: storage.getItem(`${PREFIX}hostname`) || DEFAULT_HOSTNAME,
      _port: storage.getItem(`${PREFIX}port`) || DEFAULT_PORT,
      _session: storage.getItem(`${PREFIX}session`),
      _skipDiscovery: storage.getItem(`${PREFIX}skipDiscovery`) === 'true',
      _pollingEnabled: storage.getItem(`${PREFIX}pollingEnabled`) !== null ?
      storage.getItem(`${PREFIX}pollingEnabled`) === 'true' : DEFAULT_POLLING_ENABLED
    });
  }

  on(property, handler) {
    const prototype = Object.getPrototypeOf(this);
    const parent = Object.getPrototypeOf(prototype);

    parent.on.call(this, `_${property}`, handler);
  }

  get scheme() {
    return this._scheme;
  }

  set scheme(scheme) {
    scheme = String(scheme) || DEFAULT_SCHEME;
    this._scheme = scheme;
    storage.setItem(`${PREFIX}scheme`, this._scheme);
  }

  get hostname() {
    return this._hostname;
  }

  set hostname(hostname) {
    hostname = String(hostname) || DEFAULT_HOSTNAME;
    this._hostname = hostname.replace(/\/$/, ''); // Trailing slash.
    storage.setItem(`${PREFIX}hostname`, this._hostname);
  }

  get port() {
    return this._port;
  }

  set port(port) {
    port = parseInt(port, 10) || DEFAULT_PORT;
    this._port = port;
    storage.setItem(`${PREFIX}port`, this._port);
  }

  get session() {
    return this._session;
  }

  set session(session) {
    if (session === undefined) {
      this._session = undefined;
      storage.removeItem(`${PREFIX}session`);
    } else {
      this._session = session;
      storage.setItem(`${PREFIX}session`, this._session);
    }
  }

  get registrationService() {
    return REGISTRATION_SERVICE;
  }

  get skipDiscovery() {
    return this._skipDiscovery;
  }

  set skipDiscovery(value) {
    value = !!value;
    this._skipDiscovery = value;
    storage.setItem(`${PREFIX}skipDiscovery`, value);
  }

  get pollingEnabled() {
    return this._pollingEnabled;
  }

  set pollingEnabled(value) {
    value = !!value;
    this._pollingEnabled = value;
    storage.setItem(`${PREFIX}pollingEnabled`, value);
  }

  get pollingInterval() {
    return POLLING_INTERVAL;
  }
}
