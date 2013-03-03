var Radars = new Meteor.Collection("radars");

Radars.allow({
  insert: function(userId, doc) {
    return (userId && doc.owner === userId);
  },
  remove: function(userId, docs) {
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  },
  fetch: ['owner']
});

Radars.deny({
  insert: function(userId, doc) {
    if (!doc.name || doc.name.length === 0) {
      throw new Meteor.Error(422, "Unprocessable Entity");
    }
  }
});

Meteor.publish("myRadars", function() {
  return Radars.find({owner: this.userId});
});
