import browser from 'webextension-polyfill'
import { checkForLastError } from './check-last-error'

export default class ExtensionPlatform {
  //
  // Public
  //
  reload() {
    browser.runtime.reload()
  }

  openTab(options) {
    return new Promise((resolve, reject) => {
      browser.tabs.create(options).then((newTab) => {
        const error = checkForLastError()
        if (error) {
          return reject(error)
        }
        return resolve(newTab)
      })
    })
  }

  openWindow(options) {
    return new Promise((resolve, reject) => {
      browser.windows.create(options).then((newWindow) => {
        const error = checkForLastError()
        if (error) {
          return reject(error)
        }
        return resolve(newWindow)
      })
    })
  }

  focusWindow(windowId) {
    return new Promise((resolve, reject) => {
      browser.windows.update(windowId, { focused: true }).then((res) => {
        const error = checkForLastError()
        if (error) {
          return reject(error)
        }
        return resolve(res)
      })
    })
  }

  updateWindowPosition(windowId, left, top) {
    return new Promise((resolve, reject) => {
      browser.windows.update(windowId, { left, top }).then((res) => {
        const error = checkForLastError()
        if (error) {
          return reject(error)
        }
        return resolve(res)
      })
    })
  }

  getLastFocusedWindow() {
    return new Promise((resolve, reject) => {
      browser.windows.getLastFocused().then((windowObject) => {
        const error = checkForLastError()
        if (error) {
          return reject(error)
        }
        return resolve(windowObject)
      })
    })
  }

  closeCurrentWindow() {
    return browser.windows.getCurrent().then((windowDetails) => {
      return browser.windows.remove(windowDetails.id)
    })
  }

  getVersion() {
    const { version, version_name: versionName } = browser.runtime.getManifest()

    const versionParts = version.split('.')
    if (versionName) {
      if (versionParts.length < 4) {
        throw new Error(`Version missing build number: '${version}'`)
      }
      // On Chrome, a more descriptive representation of the version is stored in the
      // `version_name` field for display purposes. We use this field instead of the `version`
      // field on Chrome for non-main builds (i.e. Flask, Beta) because we want to show the
      // version in the SemVer-compliant format "v[major].[minor].[patch]-[build-type].[build-number]",
      // yet Chrome does not allow letters in the `version` field.
      return versionName
      // A fourth version part is sometimes present for "rollback" Chrome builds
    } else if (![3, 4].includes(versionParts.length)) {
      throw new Error(`Invalid version: ${version}`)
    } else if (versionParts[2].match(/[^\d]/u)) {
      // On Firefox, the build type and build version are in the third part of the version.
      const [major, minor, patchAndPrerelease] = versionParts
      const matches = patchAndPrerelease.match(/^(\d+)([A-Za-z]+)(\d)+$/u)
      if (matches === null) {
        throw new Error(`Version contains invalid prerelease: ${version}`)
      }
      const [, patch, buildType, buildVersion] = matches
      return `${major}.${minor}.${patch}-${buildType}.${buildVersion}`
    }

    // If there is no `version_name` and there are only 3 or 4 version parts, then this is not a
    // prerelease and the version requires no modification.
    return version
  }

  getExtensionURL(route = null) {
    let extensionURL;
    if (route) {
      extensionURL = browser.runtime.getURL(`${route}.html`);
    } else {
      extensionURL = browser.runtime.getURL('index.html');
    }
    return extensionURL
  }

  openExtensionInBrowser(route = null, queryString = null) {
    const extensionURL = this.getExtensionURL(route, queryString)
    this.openTab({ url: extensionURL })
  }

  getPlatformInfo(cb) {
    try {
      const platformInfo = browser.runtime.getPlatformInfo()
      cb(platformInfo)
      return
    } catch (e) {
      cb(e)
      // eslint-disable-next-line no-useless-return
      return
    }
  }

  addOnRemovedListener(listener) {
    browser.windows.onRemoved.addListener(listener)
  }

  getAllWindows() {
    return new Promise((resolve, reject) => {
      browser.windows.getAll().then((windows) => {
        const error = checkForLastError()
        if (error) {
          return reject(error)
        }
        return resolve(windows)
      })
    })
  }

  getActiveTabs() {
    return new Promise((resolve, reject) => {
      browser.tabs.query({ active: true }).then((tabs) => {
        const error = checkForLastError()
        if (error) {
          return reject(error)
        }
        return resolve(tabs)
      })
    })
  }

  currentTab() {
    return new Promise((resolve, reject) => {
      browser.tabs.getCurrent().then((tab) => {
        const err = checkForLastError()
        if (err) {
          reject(err)
        } else {
          resolve(tab)
        }
      })
    })
  }

  switchToTab(tabId) {
    return new Promise((resolve, reject) => {
      browser.tabs.update(tabId, { highlighted: true }).then((tab) => {
        const err = checkForLastError()
        if (err) {
          reject(err)
        } else {
          resolve(tab)
        }
      })
    })
  }

  closeTab(tabId) {
    return new Promise((resolve, reject) => {
      browser.tabs.remove(tabId).then((res) => {
        const err = checkForLastError()
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
