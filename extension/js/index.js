var self = this;
function registerCallback(registrationId) {
  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.
    return;
  }

  sendRegistrationId(registrationId, function(succeed) {
  // Once the registration token is received by your server,
  // set the flag such that register will not be invoked
  // next time when the app starts up.
  if (succeed){
    console.log("success")
    chrome.storage.local.set({registered: true});
    chrome.storage.local.set({connectID: self.connectID});
  }

});
}

function sendRegistrationId(registrationId, callback) {

  console.log("Send Resource");

  var parameters = {
    'connectID': self.connectID,
    'registrationID': registrationId
  }

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    url: 'https://jlhgqgcvhd.execute-api.us-east-1.amazonaws.com/engageAPI/resource',
    data: JSON.stringify(parameters),
    success: function(d) {
      console.log(d);
      callback(true);
    },
    error: function() {
      console.log("error");
      callback(false);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  console.log("Page Loaded")
  $('#submit').on('click', function() {
    self.connectID = $('#connectID').val()

    chrome.storage.local.get("registered", function(result) {
      // If already registered, bail out.
      // if (result["registered"])
      //   return;

      // Up to 100 senders are allowed.
      var senderIds = ["834636331297"];
      chrome.gcm.register(senderIds, registerCallback);
    });
  });
});
