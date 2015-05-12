// Generated by CoffeeScript 1.9.0
(function() {
  var height, initializeGraph, linkArc, tick, transform, width;

  tick = function() {
    path.attr("d", linkArc);
    circle.attr("transform", transform);
    text.attr("transform", transform);
  };

  linkArc = function(d) {
    var dr, dx, dy;
    dx = d.target.x - d.source.x;
    dy = d.target.y - d.source.y;
    dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  };

  transform = function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  };

  width = window.innerWidth;

  height = window.innerHeight;

  initializeGraph = function(data) {
    var c, d, id, p, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    window.courses = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      d = data[_i];
      courses[d.id] = d;
    }
    window.links = [];
    for (id in courses) {
      c = courses[id];
      _ref = c.prereqs;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        p = _ref[_j];
        if (courses[p] == null) {
          console.log(p);
          courses[p] = {
            prereqs_desc: "",
            prereqs: [],
            prereq_type: "",
            title: p,
            id: p
          };
        }
      }
    }
    for (id in courses) {
      c = courses[id];
      _ref1 = c.prereqs;
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        p = _ref1[_k];
        links.push({
          source: courses[p],
          target: courses[id]
        });
      }
    }
    console.log(courses, links);
    window.force = d3.layout.force().nodes(d3.values(courses)).links(links).size([width, height]).linkDistance(100).charge(-300).on("tick", tick).start();
    window.svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
    window.marker = svg.append("defs").append("marker").attr("id", "marker-arrow").attr("viewBox", "0 -5 10 10").attr("refX", 15).attr("refY", -1.5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5");
    window.path = svg.append("g").selectAll("path").data(force.links()).enter().append("path").attr("class", "link").attr("marker-end", "url(#marker-arrow)");
    window.circle = svg.append("g").selectAll("circle").data(force.nodes()).enter().append("circle").attr("r", 6).call(force.drag);
    return window.text = svg.append("g").selectAll("text").data(force.nodes()).enter().append("text").attr("x", 8).attr("y", ".31em").text(function(d) {
      return d.title;
    });
  };

  $.getJSON("/ut_math_courses.json", initializeGraph);

}).call(this);
