var Radars = new Meteor.Collection("radars");
var myRadarsSub = Meteor.subscribe("myRadars");

function myRadars() {
  return Radars.find({owner: Meteor.userId()});
}

Template["error-reason"].helpers({
  reason: function() {
    return Session.get("errorReason");
  }
});

Template["radar-index"].helpers({
  radars: function() {
    return myRadars();
  }
});

Template["new-radar-modal"].events({
  "submit form": function(e, tpl) {
    e.preventDefault();

    var radar = {
      owner: Meteor.userId(),
      name: $(tpl.find("#new-radar-name")).val()
    };

    Radars.insert(radar, function(error, id) {
      $("#new-radar-modal").modal('hide');
      if (error) {
        Session.set("errorReason", error.reason);
        $("#error-modal").modal('show');
      }
    });
  }
});
