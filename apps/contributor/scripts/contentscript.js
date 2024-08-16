import { WindowPostMessageStream, ObjectMultiplex } from '@bucknet/stream'
import browser from 'webextension-polyfill'
import PortStream from 'extension-port-stream'
import pump from 'pump'
import log from 'loglevel'

let extensionPort
let extensionStream
let extensionMux
let extensionChannel

let pageMux
let pageChannel

let keepAliveTimer
let keepAliveInterval

let EXTENSION_CONNECT_SENT = false

const IGNORE_INIT_METHODS_FOR_KEEP_ALIVE = ['getProviderState', 'sendDomainMetadata']

function extensionStreamMessageListener(msg) {
  if (EXTENSION_CONNECT_SENT && msg.data.method === 'contributor') {
    EXTENSION_CONNECT_SENT = false
    window.postMessage(
      {
        target: 'inpage', // the post-message-stream "target"
        data: {
          // this object gets passed to obj-multiplex
          name: 'contributor', // the obj-multiplex channel name
          data: {
            jsonrpc: '2.0',
            method: 'EXTENSION_CONNECT_CAN_RETRY',
          },
        },
      },
      window.location.origin,
    )
  }
}

const sendMessageWorkerKeepAlive = () => {
  browser.runtime.sendMessage({ name: 'WORKER_KEEP_ALIVE_MESSAGE' }).catch((e) => {
    e.message === 'Extension context invalidated.'
      ? log.error(`Please refresh the page. Error: ${e}`)
      : log.error(`${e}`)
  })
}

const runWorkerKeepAliveInterval = () => {
  clearTimeout(keepAliveTimer)

  keepAliveTimer = setTimeout(() => {
    clearInterval(keepAliveInterval)
  }, 60 * 60 * 1000)

  clearInterval(keepAliveInterval)

  sendMessageWorkerKeepAlive()

  keepAliveInterval = setInterval(() => {
    if (browser.runtime.id) {
      sendMessageWorkerKeepAlive()
    }
  }, 1000)
}

const destroyExtensionStreams = () => {
  pageChannel.removeAllListeners()

  extensionMux.removeAllListeners()
  extensionMux.destroy()

  extensionChannel.removeAllListeners()
  extensionChannel.destroy()

  extensionStream = null
}

// const onDisconnectDestroyStreams = (err) => {
//   const lastErr = err || checkForLastError()

//   extensionPort.onDisconnect.removeListener(onDisconnectDestroyStreams)

//   destroyExtensionStreams()

//   if (lastErr) {
//     console.warn(`${lastErr} Resetting the streams.`)
//     setTimeout(initExtensionStream, 1000)
//   }
// }

const initPageStream = () => {
  const pageStream = new WindowPostMessageStream({
    name: 'content-script',
    target: 'inpage',
  })

  pageStream.on('data', ({ data: { method } }) => {
    if (!IGNORE_INIT_METHODS_FOR_KEEP_ALIVE.includes(method)) {
      runWorkerKeepAliveInterval()
    }
  })

  pageMux = new ObjectMultiplex()
  pump(pageMux, pageStream, pageMux, (err) => {
    console.debug('Content script lost connection to Inpage Multiplex', err)
  })
  pageChannel = pageMux.createStream('contributor')
}

const initExtensionStream = () => {
  extensionPort = browser.runtime.connect({ name: 'content-script' })
  extensionStream = new PortStream(extensionPort)
  extensionStream.on('data', extensionStreamMessageListener)
  extensionMux = new ObjectMultiplex()

  pump(extensionMux, extensionStream, extensionMux, (err) => {
    console.debug('Background Multiplex', err)
  })

  extensionChannel = extensionMux.createStream('contributor')
  pump(pageChannel, extensionChannel, pageChannel, (err) => {
    console.debug('Muxed traffic for spacecy provider failed', err)
  })

  // extensionPort.onDisconnect.addListener(onDisconnectDestroyStreams)
}

const start = () => {
  initPageStream()
  initExtensionStream()
}

start()
