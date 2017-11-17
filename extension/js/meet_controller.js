"use strict";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  var icon = 'notmuted.png'  // default icon for notification
  var message = 'Could not locate Mute control in Google Meeting.'  // default notification message
  // find mute or unmute button on this Meeting page. only one of these will exist at a time
  const muteButton = document.querySelector("[aria-label='Turn off microphone']")
  const unmuteButton = document.querySelector("[aria-label='Turn on microphone']")
  const hangupButton = document.querySelector("[aria-label='Leave call']")


  function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  
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
    message = 'Leaving call'
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
    const muteButton = document.querySelector("[jsname='BOHaEe']") 
      if (muteButton !== null) {  // if the mute button exists, then the Mic is currently unmuted.
        muteButton.click();
      }
  }
  else if (request.data.command === 'unmute') {
    const muteButton = document.querySelector("[jsname='BOHaEe']") 
    if (muteButton !== null) {  // if the mute button exists, then the Mic is currently unmuted.
      muteButton.click();
    }
  } 
  else if (request.data.command === 'end') {
    const endButton = document.querySelector("[jsname='CQylAd']") 
    if (endButton !== null) {  // if the mute button exists, then the Mic is currently unmuted.
      endButton.click();
    }
  } 
  else if (request.data.command === 'start') {
    const meeting_list = document.querySelector("[jsname='S0Vhi']")
    var meeting = null;
    if(meeting_list !== null && meeting_list.hasChildNodes()){
    
      
      if(request.data.time!=null) { 
        var searchText = tConvert (request.data.time);
        var elms = document.querySelector("[jsname='S0Vhi']").getElementsByTagName("div");
        for (var i = 0; i < elms.length; i++) {
            if (elms[i].innerText === searchText) {
              console.log(searchText+ " found");    
               meeting = elms[i];
            }
        }
      }
      else {
        meeting = meeting_list.firstElementChild;
      }
          if (meeting !== null){
           meeting.click()
            message = 'Starting Meeting'
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
            message = 'No Meeting'
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
  else if (request.data.command === 'join') {
    const joinbutton = document.querySelector("[jsname='Qx7uuf']")
    if (joinbutton !== null){
      joinbutton.click()
      message = 'Joining Meeting'
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
      message = 'No Meeting'
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
  else if (request.data.command === 'hangup') {
    if (hangupButton !== null) {  // if the mute button exists, then the Mic is currently unmuted.
      endcall()
    }
  }
})
