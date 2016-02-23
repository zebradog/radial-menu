var mainMenu = new radialMenu({
  x: 400,
  y: 300,
  "start-radius":100
});

// FIRST LEVEL ITEMS
// SIZE MORE THEN 1 - IGNORING THIS
var child1 = mainMenu.add("CHILD", {
  "stroke-color": "#6cff00",
  "stroke-opacity": 0.5,
  "fill": "#FFFFFF",
  "fill-opacity": 1,
  "size": 0.2,
  "data": {"a": 123, "b": 234},
  "onclick": function () {
    console.log(this.data);
  }
});
var child2 = mainMenu.add("CHILD", {
  "size": 0.3
});
var child3 = mainMenu.add("CHILD", {
  "size": 0.6
});

// SECOND LEVEL ITEMS
// SIZE 1
var child11 = child1.add("CHILD", {
  size: 0.4
});
var child12 = child1.add("Level21", {
  size: 0.6
});

var child21 = child2.add("Level22", {
  "stroke-color": "#6cff00",
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

var child211 = child21.add("CHILD");
var child212 = child21.add("Level31");
var child213 = child21.add("Level31");
var child214 = child21.add("Level31");
var child215 = child21.add("Level31");
var child216 = child21.add("Level31");

var child1111 = child111.add("Level41 With Custom Event", {
  "stroke-color": "#6cff00",
  "stroke-opacity": 0.5,
  "fill": "#FFFFFF",
  "fill-opacity": 1,
  "data": "#some_id",
  "onclick": function () {
    alert("this.data = " + this.data);
  }
});
var child1112 = child111.add("Level41", {
  "font-size": "20px",
  "font-family": 'Tahoma',
  "font-color": '#FFFFFF',
  "active-font-color": '#6cff00',
  "active-stroke-color": '#ff0000',
  "active-stroke-opacity": 1.0,
  "active-fill": '#000000',
  "active-fill-opacity": 1.0,
  "stroke-color": '#000000',
  "stroke-opacity": 1.0,
  "fill": '#0012ff',
  "fill-opacity": 0.5
});
var child1113 = child111.add("Level41");

var opened = false;

window.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var x = e.pageX,
    y = e.pageY;

  if (!opened) {
    mainMenu.update({
      x: e.pageX,
      y: e.pageY
    });

    mainMenu.open();
    opened = true;
  }
});
var link = document.getElementById("link");
link.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  child21.open();
});

var link_close = document.getElementById("close-link");
link_close.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var element = mainMenu.get();

  setTimeout(function () {
    element.transform("0");
  }, 1000);

  mainMenu.close();
  opened = false;
});

var link_close_item = document.getElementById("close");
link_close_item.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  child2.close();
});

var link_children = document.getElementById("children");
link_children.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  console.log(mainMenu.children());
});

var item_children = document.getElementById("item-children");
item_children.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  console.log(child2.children());
});

var animate_link = document.getElementById("animate");
animate_link.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var element = mainMenu.get();

  element.animate({transform: 'translate(500)'}, 1000, mina.bounce);
});
