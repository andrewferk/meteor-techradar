if (Meteor.isClient) {
  var svgns = "http://www.w3.org/2000/svg";
  
  function selectBlip(id) {
    Session.set("selectedBlip", id);
  }

  function deselectBlip() {
    Session.set("selectedBlip", null);
  }

  Template["blip-form"].events({
    "submit form": function(e) {
      e.preventDefault();
      var $target = $(e.currentTarget);
      var name = $target.find("input").val();
      Blips.insert({
        name: name,
        posx: 200,
        posy: 200
      });
    }
  });

  Template["blip-index"].blips = getBlips;
  Template["radar-svg"].blips  = getBlips;
  Template["radar-svg"].rendered = function() {
    var paper = Raphael("radar-canvas", 400, 400);
    var p1  = 400.0 * 0.01;
    var p2  = 400.0 * 0.02;
    var p19 = 400.0 * 0.19;
    var p29 = 400.0 * 0.29;
    var p39 = 400.0 * 0.39;
    var p49 = 400.0 * 0.49;
    var p50 = 400.0 * 0.5;
    var p99 = 400.0 * 0.99;
    paper.circle(p50, p50, p19).attr({
      "fill-opacity": "0.0",
      "stroke": "black"
    });
    paper.circle(p50, p50, p29).attr({
      "fill-opacity": "0.0",
      "stroke": "black"
    });
    paper.circle(p50, p50, p39).attr({
      "fill-opacity": "0.0",
      "stroke": "black"
    });
    paper.circle(p50, p50, p49).attr({
      "fill-opacity": "0.0",
      "stroke": "black"
    });
    paper.path("M"+p1+","+p50+"H"+p99).attr("stroke", "black");
    paper.path("M"+p50+","+p1+"V"+p99).attr("stroke", "black");

    var blipCircles = [];
    Meteor.autorun(function() {
      for (var i in blipCircles) {
        blipCircles[i].remove();
      }
      var blips = getBlips();
      blips.forEach(function(blip) {
        var circle = paper.circle(blip.posx, blip.posy, p2);
        circle.hover(function() {
          selectBlip(blip._id);
        }, function() {
          deselectBlip();
        });
        circle.drag(function(dx, dy) {
          this.attr({
            cx: this.ox + dx,
            cy: this.oy + dy
          });
        }, function() {
          this.ox = this.attr("cx");
          this.oy = this.attr("cy");
        }, function() {
          Blips.update(blip._id, {$set: {
            posx: this.attr("cx"),
            posy: this.attr("cy")
          }});
        });
        Meteor.autorun(function() {
          var color = Session.equals("selectedBlip", blip._id) ?
            "blue": "black";
          circle.attr("fill", color);
        });
        blipCircles.push(circle);
      });
    });
  };

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
}
