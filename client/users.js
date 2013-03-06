Template["user-loggedout"].events({
  "click #login": function(e) {
    Meteor.loginWithGoogle({
      requestPermissions: ['profile', 'email']
    });
  }
});

Template["user-loggedin"].events({
  "click #logout": function(e) {
    Meteor.logout();
  }
});
