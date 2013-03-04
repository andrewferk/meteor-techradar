Template["main"].helpers({
  activeRadar: function() {
    return Session.get("activeRadar");
  }
});

Template["error-reason"].helpers({
  reason: function() {
    return Session.get("errorReason");
  }
});
