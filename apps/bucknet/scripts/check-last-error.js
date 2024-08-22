import browser from 'webextension-polyfill'
import log from 'loglevel'

export function checkForLastError() {
  const { lastError } = browser.runtime
  if (!lastError) {
    return undefined
  }
  if (lastError.message) {
    return lastError
  }
  return new Error(lastError.message)
}

export function checkForLastErrorAndLog() {
  const error = checkForLastError()

  if (error) {
    log.error(error)
  }

  return error
}

export function checkForLastErrorAndWarn() {
  const error = checkForLastError()

  if (error) {
    console.warn(error)
  }

  return error
}
