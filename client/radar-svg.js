function p(percent) {
  return 400 * (percent / 100);
}

function createRadarCanvas() {
  var paper = Raphael("radar-canvas", 400, 400);
  paper.circle(p(50), p(50), p(19)).attr({
    "fill-opacity": "0.0",
    "stroke": "black"
  });
  paper.circle(p(50), p(50), p(29)).attr({
    "fill-opacity": "0.0",
    "stroke": "black"
  });
  paper.circle(p(50), p(50), p(39)).attr({
    "fill-opacity": "0.0",
    "stroke": "black"
  });
  paper.circle(p(50), p(50), p(49)).attr({
    "fill-opacity": "0.0",
    "stroke": "black"
  });
  paper.path("M"+p(1)+","+p(50)+"H"+p(99)).attr("stroke", "black");
  paper.path("M"+p(50)+","+p(1)+"V"+p(99)).attr("stroke", "black");

  return paper;
}

function createBlipCircles(paper) {
  var blipCircles = [];
  Meteor.autorun(function() {
    for (var i in blipCircles) {
      blipCircles[i].remove();
    }
    var blips = activeBlips();
    blips.forEach(function(blip) {
      var circle = createBlipCircle(blip, paper);
      blipCircles.push(circle);
    });
  });
  return blipCircles;
}

function createBlipCircle(blip, paper) {
  var circle = paper.circle(blip.posx, blip.posy, p(2));
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
  return circle;
}

Template["radar-svg"].blips  = activeBlips;
Template["radar-svg"].rendered = function() {
  var paper = createRadarCanvas();
  var circles = createBlipCircles(paper);
};
