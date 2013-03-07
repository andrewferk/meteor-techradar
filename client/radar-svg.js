(function() {
  function p(percent) {
    return 400 * (percent / 100);
  }
  
  function createRadarCanvas() {
    var paper = Raphael("radar-canvas", 400, 400);
    paper.circle(p(50), p(50), p(49)).attr({
      "fill": "#BFEFFF",
      "fill-opacity": "0.3",
      "stroke": "black"
    });
    paper.circle(p(50), p(50), p(39)).attr({
      "fill": "#BFEFFF",
      "fill-opacity": "0.35",
      "stroke": "black"
    });
    paper.circle(p(50), p(50), p(29)).attr({
      "fill": "#BFEFFF",
      "fill-opacity": "0.50",
      "stroke": "black"
    });
    paper.circle(p(50), p(50), p(19)).attr({
      "fill": "#BFEFFF",
      "fill-opacity": "1.0",
      "stroke": "black"
    });
    paper.text(p(55), p(35), "Adopt").rotate(10);
    paper.text(p(54), p(24), "Trial").rotate(10);
    paper.text(p(55.5), p(14), "Assess").rotate(10);
    paper.text(p(54), p(4), "Hold").rotate(10);
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
    var circle = paper.circle(blip.posx, blip.posy, p(1.5));
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
      var quadrant = getQuadrant(this.attr("cx"), this.attr("cy"));
      var ring = getRing(this.attr("cx"), this.attr("cy"));
      if (!quadrant || !ring) {
        this.attr({
          cx: this.ox,
          cy: this.oy
        });
      } else {
        Blips.update(blip._id, {$set: {
          quadrant: quadrant,
          ring: ring,
          posx: this.attr("cx"),
          posy: this.attr("cy")
        }});
      }
    });
    Meteor.autorun(function() {
      var color = Session.equals("selectedBlip", blip._id) ?
        "blue": "black";
      circle.attr("fill", color);
    });
    return circle;
  }

  function getQuadrant(cx, cy) {
    var quadrant = null;
    var dmax = 200 - p(1);
    var d = Math.sqrt(Math.pow(200 - cx, 2) + Math.pow(200 - cy, 2));
    if (d <= dmax) {
      var a = Math.sqrt(Math.pow(dmax + 200 - cx, 2) + Math.pow(200 - cy, 2));
      var degree = Math.acos(
        (Math.pow(d, 2) + Math.pow(dmax, 2) - Math.pow(a, 2)) /
        (2 * d * dmax)
      );
      if (cy < 200 && degree < (Math.PI / 2)) {
        quadrant = "Tools";
      } else if (cy < 200 && degree > (Math.PI / 2)) {
        quadrant = "Techniques";
      } else if (cy > 200 && degree > (Math.PI / 2)) {
        quadrant = "Platforms";
      } else if (cy > 200 && degree < (Math.PI / 2)) {
        quadrant = "Languages";
      }
    }
    return quadrant;
  }

  function getRing(cx, cy) {
    var ring = null;
    var d = Math.sqrt(Math.pow(200 - cx, 2) + Math.pow(200 - cy, 2));
    if (d < p(19)) {
      ring = "Adopt";
    } else if (d < p(29)) {
      ring = "Trial";
    } else if (d < p(39)) {
      ring = "Assess";
    } else if (d < p(49)) {
      ring = "Hold";
    }
    return ring;
  }

  Template["radar-svg"].blips  = activeBlips;
  Template["radar-svg"].rendered = function() {
    var paper = createRadarCanvas();
    var circles = createBlipCircles(paper);
  };
})();
