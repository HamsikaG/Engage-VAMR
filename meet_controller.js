"use strict";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  var icon = 'notmuted.png'  // default icon for notification
  var message = 'Could not locate Mute control in Google Meeting.'  // default notification message
  // find mute or unmute button on this Meeting page. only one of these will exist at a time
  const muteButton = document.querySelector("[aria-label='Turn off microphone']")
  const unmuteButton = document.querySelector("[aria-label='Turn on microphone']")