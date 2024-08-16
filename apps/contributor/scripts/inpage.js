import { WindowPostMessageStream } from '@bucknet/stream'

const providerStream = new WindowPostMessageStream({
  name: 'inpage',
  target: 'content-script',
})

navigator.serviceWorker.ready.then((registration) => {
  registration.active.postMessage('inpage')
})
providerStream.on('message', (event) => {
  navigator.serviceWorker.ready.then((registration) => {
    registration.active.postMessage('inpage')
  })
})
