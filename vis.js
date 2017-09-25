var feature; // eventually: all svg paths (countries) of the world
//  , toggle; // animation on/off control

var projection = d3.geoOrthographic()
    .scale(380)
    .rotate([71.03,-42.37])
    .clipAngle(90)
//    .rotate()
    
//    .mode("orthographic")
    .translate([400, 400]);
    
//var rotate = [-71.03, 42.37],
//    velocity = [.018, .006];

//var circle = d3.geoCircle()
//    .center(projection.center());

// TODO fix d3.geo.azimuthal to be consistent with scale
//var scale =
//{ orthographic: 380
//, stereographic: 380
//, gnomonic: 380
//, equidistant: 380 / Math.PI * 2
//, equalarea: 380 / Math.SQRT2
//};

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#body").append("svg:svg")
    .attr("width",  "100%")
    .attr("height", "100%")
    .on("mousedown", mousedown);

if (frameElement) frameElement.style.height = '800px';
//if (frameElement) frameElement.style.width = '1500px';

d3.json("https://gist.githubusercontent.com/phil-pedruco/10447085/raw/426fb47f0a6793776a044f17e66d17cbbf8061ad/countries.geo.json", function(collection) {
  feature = svg.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d",clip);

  feature.append("svg:title")
      .text(function(d) { return d.properties.name; });

  stopAnimation();
  d3.select('#animate').on('click', function () {
    if (done) startAnimation(); else stopAnimation();
  });
});

function stopAnimation() {
  done = true;
  d3.select('#animate').node().checked = false;
}

function startAnimation() {
  done = false;
  d3.timer(function() {
    var rotate = projection.rotate();
    rotate = [rotate[0] + 0.1, rotate[1]];
    projection.rotate(rotate);
//    circle.center(rotate);
    refresh();
    return done;
  });
}

function animationState() {
  return 'animation: '+ (done ? 'off' : 'on');
}

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

//d3.select("select").on("change", function() {
//  stopAnimation();
//  projection.scale(scale[this.value]);
//  projection.rotate(rotate[this.value]);
//  refresh(750);
//});

var m0
  , o0
  , done
  ;

function mousedown() {
  stopAnimation();
  m0 = [d3.event.pageX, d3.event.pageY];
  o0 = projection.rotate();
  d3.event.preventDefault();
}

function mousemove() {
  if (m0) {
    var m1 = [d3.event.pageX, d3.event.pageY]
      , o1 = [o0[0] - (m0[0] - m1[0]) / 8, o0[1] - (m1[1] - m0[1]) / 8];
    projection.rotate(o1);
//    circle.center(o1);
    refresh();
  }
}

function mouseup() {
  if (m0) {
    mousemove();
    m0 = null;
  }
}

function refresh(duration) {
  (duration ? feature.transition().duration(duration) : feature).attr("d",clip);
}

function clip(d) {
  return path(d);
}

function reframe(css) {
  for (var name in css)
    frameElement.style[name] = css[name] + 'px';
}