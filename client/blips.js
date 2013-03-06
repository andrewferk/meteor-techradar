var Blips = new Meteor.Collection("blips");
var myBlipsSub = Meteor.subscribe("myBlips");

function myBlips(radarId) {
  return Blips.find({radar: radarId});
}

function activeBlips() {
  return myBlips(Session.get("activeRadar"));
}
  
function selectBlip(id) {
  Session.set("selectedBlip", id);
}

function deselectBlip() {
  Session.set("selectedBlip", null);
}

Template["blip-form"].events({
  "submit form": function(e, tpl) {
    e.preventDefault();

    var blip = {
      owner:    Meteor.userId(),
      radar:    Session.get("activeRadar"),
      name:     $(tpl.find("input")).val(),
      quadrant: "",
      ring:     "",
      posx:     200,
      posy:     200
    };

    Blips.insert(blip, function(error, id) {
      if (error) {
        Session.set("errorReason", error.reason);
        $("#error-modal").modal('show');
      }
    });
  }
});

Template["blip-index"].blips = activeBlips;

Template["blip-row"].hover = function() {
  return Session.equals("selectedBlip", this._id) ? "hover" : "";
};

Template["blip-row"].events({
  "click a[data-action='remove']": function(e) {
    e.preventDefault();
    Blips.remove(this._id);
  },
  "mouseenter tr": function(e) {
    selectBlip(this._id);
  },
  "mouseleave tr": function(e) {
    deselectBlip();
  }
});
