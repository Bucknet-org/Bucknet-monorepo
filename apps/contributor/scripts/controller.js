import EventEmitter from 'events'

export default class Controller extends EventEmitter {
  defaultMaxListeners
  opts
  localStoreWrapper
  platform
  activeControllerConnections

  constructor(opts) {
    super()
    this.defaultMaxListeners = 20
    this.opts = opts
    this.platform = opts.platform
    this.activeControllerConnections = 0
    this.localStoreWrapper = opts.localStore || {}
  }
}
