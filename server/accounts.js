Accounts.loginServiceConfiguration.remove({
  service: "google"
});

Accounts.loginServiceConfiguration.insert({
  service: "google",
  clientId: Meteor.settings.google.token,
  secret: Meteor.settings.google.secret
});

Accounts.onCreateUser(function(options, user) {
  var profile = _.pick(user.services.google,
    "email",
    "name",
    "picture");

  user.profile = profile;

  return user;
});
