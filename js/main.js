$(function(){
  var mainMenu = new radialMenu({
    fill: 'rgba(0,0,0,0.75)',
    stroke:0,
    "font-color": '#FFF',
    "active-fill": '#000',
    "active-font-color": '#fff',
    "font-family":'sans-serif,FontAwesome'
  });

  // FIRST LEVEL ITEMS
  // SIZE MORE THEN 1 - IGNORING THIS
  var child1 = mainMenu.add('\uf040'+" CHILD 1");
  var child2 = mainMenu.add("CHILD 2");
  var child3 = mainMenu.add("CHILD 3",{
    size:0.5
  });

  // SECOND LEVEL ITEMS
  // SIZE 1
  var child11 = child1.add("CHILD", {
    size: 0.5
  });
  var child12 = child1.add("Level21", {
    //ååsize: 0.5
  });

  var child21 = child2.add("Level22");
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

  var child1111 = child111.add("Level41");
  var child1112 = child111.add("Level41");
  var child1113 = child111.add("Level41");

  var opened = false;

  window.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    //var g = mainMenu.get();

    //  console.log(mainMenu,g.getBBox());

    if (!mainMenu.isOpened) {
      opened = true;

      var x = e.pageX,
        y = e.pageY;

      mainMenu.open();

      var $s  = $('svg');
      $s.css({
        top: y+'px',
        left: x+'px'
      });

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
    mainMenu.close();
    opened = false;
  });

  var link_close_item = document.getElementById("close");
  link_close_item.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    child2.close();
  });

});
