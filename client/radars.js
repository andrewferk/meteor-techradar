var Radars = new Meteor.Collection("radars");
var myRadarsSub = Meteor.subscribe("myRadars");

function myRadars() {
  return Radars.find({owner: Meteor.userId()});
}
