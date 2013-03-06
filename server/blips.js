// class Blip
//   ObjectId owner
//   ObjectId radar
//   string   name
//   string   quadrant
//   string   ring
//   int      posx
//   int      posy
var Blips = new Meteor.Collection("blips");

Blips.allow({
  insert: function(userId, doc) {
    return (userId && doc.owner === userId);
  },
  update: function(userId, docs) {
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  },
  remove: function(userId, docs) {
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  },
  fetch: ['owner']
});

Blips.deny({
  insert: function(userId, doc) {
    if (!doc.name || doc.name.length === 0) {
      throw new Meteor.Error(422, "Unprocessable Entity");
    }
  }
});

Meteor.publish("myBlips", function() {
  return Blips.find({owner: this.userId});
});
