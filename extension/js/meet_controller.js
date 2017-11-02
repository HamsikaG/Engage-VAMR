"use strict";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  var icon = 'notmuted.png'  // default icon for notification
  var message = 'Could not locate Mute control in Google Meeting.'  // default notification message
  // find mute or unmute button on this Meeting page. only one of these will exist at a time
  const muteButton = document.querySelector("[aria-label='Turn off microphone']")
  const unmuteButton = document.querySelector("[aria-label='Turn on microphone']")
  const hangupButton = document.querySelector("[jsname='Nl0j0e']")

  // function for muting
const mute = () => {
  const btn = muteButton
  if (btn !== null) {
    btn.click()
    message = 'Microphone is OFF'
    icon = 'muted.png'
    sendResponse({
      notification:
      {
        type: 'basic',
        iconUrl: icon,
        title: message,
        message: ''
      }
    })
  }
}

// function for unmuting
const unmute = () => {
  const btn = unmuteButton
  if (btn !== null) {
    btn.click()
    message = 'Microphone is ON'
    icon = 'notmuted.png'
    sendResponse({
      notification:
      {
        type: 'basic',
        iconUrl: icon,
        title: message,
        message: ''
      }
    })
  }
}

// function for unmuting
const endcall = () => {
  const btn = hangupButton
  if (btn !== null) {
    btn.click()
    message = 'Microphone is ON'
    icon = 'notmuted.png'
    sendResponse({
      notification:
      {
        type: 'basic',
        iconUrl: icon,
        title: message,
        message: ''
      }
    })
  }
}

  if (request.data.command === 'mute') {
      if (muteButton !== null) {  // if the mute button exists, then the Mic is currently unmuted.
        mute()
      }
  }
  else if (request.data.command === 'unmute') {
    if (muteButton === null) {  // if the mute button exists, then the Mic is currently unmuted.
      unmute()
    }
  }
  else if (request.data.command === 'join') {
    const meeting_list = document.querySelector("[jsname='S0Vhi']")
    if(meeting_list !== null && meeting_list.hasChildNodes()){
          const meeting = meeting_list.firstElementChild
          if (meeting !== null){
            meeting.click()
            message = 'Joining Meating'
            icon = 'notmuted.png'
            sendResponse({
              notification:
              {
                type: 'basic',
                iconUrl: icon,
                title: message,
                message: ''
              }
            })
          }
          else {
            message = 'No Meating'
            icon = 'notmuted.png'
            sendResponse({
              notification:
              {
                type: 'basic',
                iconUrl: icon,
                title: message,
                message: ''
              }
            })
          }

        }
  }
  else if (request.data.command === 'hangup') {
    if (hangupButton !== null) {  // if the mute button exists, then the Mic is currently unmuted.
      endcall()
    }
  }
})
