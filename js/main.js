var mainMenu = new radialMenu({
  x: 400,
  y: 400,
  spacing: 10
});

var child1 = mainMenu.add("CHILD", {
  "stroke-color": "#000000",
  "stroke-opacity": 0.5,
  "fill": "#FFFFFF",
  "fill-opacity": 1 
});
var child2 = mainMenu.add("CHILD LOREM IPSUM");
var child3 = mainMenu.add("CHILD");
var child4 = mainMenu.add("Level1");
var child5 = mainMenu.add("Level1");
var child6 = mainMenu.add("Level1");

var child11 = child1.add("CHILD");
var child12 = child1.add("Level21");
var child13 = child1.add("Level21");

var child21 = child2.add("Level22", {
  "stroke-color": "#000000",
  "stroke-opacity": 0.5,
  "fill": "#FFFFFF",
  "fill-opacity": 1 
});
var child22 = child2.add("Level22");
var child23 = child2.add("Level22");
var child24 = child2.add("Level22");

var child31 = child3.add("Level23");
var child32 = child3.add("Level23");
var child33 = child3.add("Level23");
var child34 = child3.add("Level23");
var child35 = child3.add("Level23");

var child111 = child11.add("CHILD");
var child112 = child11.add("Level31");
var child113 = child11.add("Level31");
var child114 = child11.add("Level31");

var child1111 = child111.add("Level41 With Custom Event", {
  "stroke-color": "#000000",
  "stroke-opacity": 0.5,
  "fill": "#FFFFFF",
  "fill-opacity": 1,
  "onclick": function () {
    alert("custom event");
  }
});
var child1112 = child111.add("Level41");
var child1113 = child111.add("Level41");
var child1114 = child111.add("Level41");

var opened = false;

window.addEventListener("click", function (e) {
  e.preventDefault();
  var x = e.pageX,
    y = e.pageY;

  if (!opened) {
    mainMenu.update({
      x: x,
      y: y
    });

    mainMenu.open();
    opened = true;
  }

    
});
