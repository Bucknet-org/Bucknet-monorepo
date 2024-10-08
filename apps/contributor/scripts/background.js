import browser from 'webextension-polyfill'
import Controller from './controller'
import { checkForLastErrorAndLog } from './check-last-error'
import EventEmitter from 'events'
import ExtensionPlatform from './extension'
import { MessageMethod } from './constant'
import { MetaMaskInpageProvider } from '@metamask/providers'
import PortStream from "extension-port-stream"

const platform = new ExtensionPlatform()

const statePersistenceEvents = new EventEmitter()

function setupController(initState) {
  controller = new Controller({ initState })
  statePersistenceEvents.emit('initial-state', initState)
}

async function initialize() {
  try {
    const initState = await browser.storage.local.get()
    setupController(initState)
    await sendReadyMessageToTabs()
    console.log('Wallet initialization complete!')
    // resolveInitialization && resolveInitialization()
  } catch (err) {
    console.log(err)
    // rejectInitialization && rejectInitialization(err)
  }
}

const sendReadyMessageToTabs = async () => {
  const tabs =
    (await browser.tabs
      .query({
        /**
         * Only query tabs that our extension can run in. To do this, we query for all URLs that our
         * extension can inject scripts in, which is by using the "<all_urls>" value and __without__
         * the "tabs" manifest permission. If we included the "tabs" permission, this would also fetch
         * URLs that we'd not be able to inject in, e.g. browser://pages, browser://extension, which
         * is not what we'd want.
         *
         * You might be wondering, how does the "url" param work without the "tabs" permission?
         *
         * @see {@link https://bugs.chromium.org/p/chromium/issues/detail?id=661311#c1}
         *  "If the extension has access to inject scripts into Tab, then we can return the url
         *   of Tab (because the extension could just inject a script to message the location.href)."
         */
        url: '<all_urls>',
        windowType: 'normal',
      })
      .then((result) => {
        checkForLastErrorAndLog()
        return result
      })
      .catch(() => {
        checkForLastErrorAndLog()
      })) || []

  /** @todo we should only sendMessage to dapp tabs, not all tabs. */
  for (const tab of tabs) {
    browser.tabs
      .sendMessage(tab.id, {
        name: 'Extension ready',
      })
      .then(() => {
        checkForLastErrorAndLog()
      })
      .catch(() => {
        // An error may happen if the contentscript is blocked from loading,
        // and thus there is no runtime.onMessage handler to listen to the message.
        checkForLastErrorAndLog()
      })
  }
}

browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install' || reason === 'update') {
    const extensionURL = platform.getExtensionURL('index');
    platform.openTab({ url: extensionURL })
  }
})

const registerInPageContentScript = async () => {
  try {
    await browser.scripting.registerContentScripts([
      {
        id: 'inpage',
        matches: ['file://*/*', 'http://*/*', 'https://*/*'],
        js: ['inpage.js'],
        runAt: 'document_start',
        world: 'MAIN',
      },
    ])
  } catch (err) {
    console.warn(`Dropped attempt to register inpage content script. ${err}`)
  }
}

registerInPageContentScript()

function initBackground() {
  initialize()
}

self.addEventListener('message', async (event) => {
  const clientId = event.source.id
  const data = JSON.parse(event.data)
  if (data.method === MessageMethod.GET_INITIALIZE_DATA) {
    const initState = await browser.storage.local.get()
    console.log('get state', initState)    
    sendMessage(
      {
        method: MessageMethod.INITIALIZE_DATA,
        data: JSON.stringify(initState),
      },
      clientId
    )
  } else if (data.method === MessageMethod.SET_INITIALIZE_DATA) {
    sendMessage(
      { data: 'success' },
      clientId
    )
    console.log('store state', JSON.parse(data.data))
    await browser.storage.local.set(JSON.parse(data.data))
  } else if (data.method === MessageMethod.EXPAND_VIEW) {
    const url = platform.getExtensionURL(JSON.parse(data.data).route);
    platform.openTab({ url });
  }
})
const sendMessage = async (msg, clientId) => {
  let allClients = []
  let client = await clients.get(clientId)
  allClients.push(client)
  allClients.map((client) => {
    return client.postMessage(msg)
  })
}

function getMetaMaskId () {
  switch (browser && browser.name) {
    case 'chrome':
      return 'nkbihfbeogaeaoehlefnkodbefgpgknn'
    default:
      return 'nkbihfbeogaeaoehlefnkodbefgpgknn'
  }
}

initBackground()