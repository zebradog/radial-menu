;(function (window) {
  "use strict";

  /** creating optins object */
  function extend(a, b) {
    var key,
    c = {};
    for (key in a) {
      if (b) {
        if (b.hasOwnProperty(key)) {
          c[key] = b[key];
        } else {
          c[key] = a[key];
        }
      } else {
        c[key] = a[key];
      }
    }
    return c;
  };

  /** checking if circles have size parameter */
  function checkSize(arr) {
    var counter = 0,
      flag = false;

    for (var i=0; i<arr.length; i++) {
      if (arr[i].options.size) {
        counter += arr[i].options.size;
      }
    }

    if (counter > 1) {
      return false;
    } else {
      if (counter === 0) {
        return false;
      } else {
        return counter.toFixed(1);
      }
    }
  }

  /** building custom steps array */
  function buildStepsArr(arr, number) {
    var steps_arr = [],
      no_size_qty = 0;

    if (number === 1) {
      return returnStepsArr(arr);
    } else {
      arr.forEach(function (el, index) {
        if (!el.options.size) {
          no_size_qty++;
        }
      });
      for (var i=0; i<arr.length; i++) {
        if (!arr[i].options.size) {
          arr[i].options.size = (1-number)/no_size_qty;
        }
      };
      return returnStepsArr(arr);
    }

    function returnStepsArr(new_arr) {
      for (var i=0; i<new_arr.length; i++) {
        steps_arr.push(360*new_arr[i].options.size);
      }
      return steps_arr;
    }
  };

  /** circlePoints: step, big radius, small radius, center point x/y, spacing between items */
  function circlePoints(children, step, r1, r2, cx, cy, spacing) {
    var points = [],
      x1Before,y1Before,x2Before,y2Before,x1After,y1After,x2After,y2After,
      flag = 0,
      circleLengthR1 = 2*Math.PI*r1,
      circleLengthR2 = 2*Math.PI*r2,
      spacingR1Left = (spacing/2)*360/circleLengthR1,
      spacingR1Right = (spacing/2)*360/circleLengthR1,
      spacingR2Left = (spacing/2)*360/circleLengthR2,
      spacingR2Right = (spacing/2)*360/circleLengthR2,
      custom = checkSize(children),
      steps = [];

    if (custom) {
      steps = buildStepsArr(children, custom);
    }

    for (var i=0, j=0; i<=360; i=custom?i+steps[j]:i+Number(step.toFixed(1)), j++) {
      x1Before = Math.round(cx + r1 * Math.cos(Snap.rad(i-spacingR1Left))),
      y1Before = Math.round(cy + r1 * Math.sin(Snap.rad(i-spacingR1Left))),
      x2Before = Math.round(cx + r2 * Math.cos(Snap.rad(i-spacingR2Left))),
      y2Before = Math.round(cy + r2 * Math.sin(Snap.rad(i-spacingR2Left))),
      x1After = Math.round(cx + r1 * Math.cos(Snap.rad(i+spacingR1Right))),
      y1After = Math.round(cy + r1 * Math.sin(Snap.rad(i+spacingR1Right))),
      x2After = Math.round(cx + r2 * Math.cos(Snap.rad(i+spacingR2Right))),
      y2After = Math.round(cy + r2 * Math.sin(Snap.rad(i+spacingR2Right)));

      points[flag] = {
        before: {
          point1: {
            x: x1Before,
            y: y1Before
          },
          point2: {
            x: x2Before,
            y: y2Before
          }
        },
        after: {
          point1: {
            x: x1After,
            y: y1After
          },
          point2: {
            x: x2After,
            y: y2After
          }
        }
      }

      flag++;
    }
    return points;
  };

  /** get index of the current object from arrays */
  function getIndex(search_item, array) {
    for (var i=0; i<array.length; i++) {
      if (array[i] === search_item) {
        return i;
      }
    }
  }

  /** radialMenu constructor */
  var radialMenu = function (options) {
    this.defaults = {
      "stroke": 1, //stroke width around every menu item, in pixels
      "spacing": 10, //amount of space between menu items
      "x": 0, //x location of the center of the menu
      "y": 0, //y location of the center of the menu
      "opacity": 1, //opacity of the main menu
      "size": null, //if set to a float value 0-1, attempt to allow the section to take that percent of the circle. if null, size is automatically calculated by
      "font-size": 14, //font size of this item, in pixels
      "font-family": 'Verdana',
      "font-color": '#000000',
      "active-font-color": '#000000',
      "active-stroke-color": '#000000',
      "active-stroke-opacity": 1.0,
      "active-fill": '#FFFFFF',
      "active-fill-opacity": 1.0,
      "stroke-color": '#000000',
      "stroke-opacity": 1.0,
      "fill": '#FFFFFF',
      "fill-opacity": 0.5,
      "data": null, //optionally additional object can be provided that will be sent to the callback, this could include an ID or URL to load on click
      "onclick": null, //callback, none by default
      "circles-spacing": 0,
      "start-radius": 50
    };
    this.options = extend(this.defaults, options);
    this.parentOptions = this.options;

    if (self.Snap) {
      this.init();
    } else {
      console.log("Snap.svg library is required");
    }
  };

  radialMenu.prototype = {
    init: function () {
      var self = this;

      // add svg to body
      this.body = document.querySelector("body");
      this.xmlns = "http://www.w3.org/2000/svg";
      this.svg = document.createElementNS (this.xmlns, "svg");
      // get svg from ID
      // this.svg = document.getElementById("menu-svg");

      // radialMenu SVG elements
      this.s = Snap(this.svg);
      this.g;
      this.mainGroup = this.s.group();
      this.mainGroup.addClass("radialMenu-holder");

      // radiuses
      this.radiusBig;
      this.radiusSmall = this.options["start-radius"];

      // empty arrays too keep radial item objects
      this.childs = [];
      this.circles = [];
      this.texts = [];
      this.defs = [];

      // if opened
      this.isOpened = false;
    },

    /** finding new radiuses. Default - +50px */
    calculateRadiuses: function () {
      var text = "",
        textLength,
        circleLength,
        textRadius;

      this.radiusSmall = this.parent?this.parent.radiusBig + 10:this.radiusSmall;
      this.radiusBig = this.radiusSmall + 50;

      circleLength = 2*Math.PI*this.radiusBig;

      this.childs.forEach(function (el) {
        text = text + el.label;
      });
      textLength = this.s.text(0, 0, text);
      textLength.toDefs();
      if (circleLength < textLength.node.clientWidth) {
        textRadius = textLength.node.clientWidth / (2*Math.PI);

        this.radiusSmall = this.parent?this.parent.radiusBig + 10:this.radiusSmall;
        this.radiusBig = textRadius+(textRadius-this.radiusSmall)+10;
      } else {
        this.radiusSmall = this.parent?this.parent.radiusBig + 10:this.radiusSmall;
        this.radiusBig = this.radiusSmall + 50;
      }
    },

    /** get menu holder */
    get: function () {
      return this.mainGroup;
    },

    /** open method for each object */
    open: function () {
      var self = this;

      if (!this.isOpened) {
        if (!this.parent) {
          this.buildSvg();
          this.buildChildren();
        } else {
          this.parent.childs.forEach(function (el) {
            if (el.isOpened){
              el.closeChildren();
            }
          });
          if (!this.parent.isOpened) {    
            this.parent.open();
          }
          
          this.buildChildren();
          this.parent.removeActive();
          this.parent.addActive(getIndex(this, this.parent.childs));
        }
      }
    },

    /** creating SVG element and paste it to body */
    buildSvg: function () {
      this.svg.setAttributeNS (null, "width", "100%");
      this.svg.setAttributeNS (null, "height", "100%");
      this.svg.setAttribute("style", "position: absolute; left: 0; top: 0;");

      this.mainGroup.attr("opacity", this.options.opacity);
      // this.mainGroup.transform("0");
      this.body.insertBefore(this.svg, this.body.firstChild);
    },

    /** all drawing magic is here */
    buildChildren: function () {
      var step = 360/this.childs.length,
        points,
        self = this,
        childs_length,
        matrix = new Snap.Matrix(),
        x_center = this.options.x,
        y_center = this.options.y,
        custom = checkSize(this.childs);

      // add flag means menu is opened
      this.isOpened = true;
      // Calculating radiuses before children builds
      this.calculateRadiuses();
      // building points for drawing
      points = circlePoints(this.childs, step, this.radiusBig, this.radiusSmall, x_center, y_center, this.options.spacing);
      childs_length = Object.keys(points).length;
      matrix.scale(1.2, 1.2);
      this.g = this.mainGroup.group();

      for (var i=0; i<childs_length-1; i++) {
        (function (i) {
          var point1 = points[i].after.point1.x + " " + points[i].after.point1.y,
            point2 = points[i].after.point2.x + " " + points[i].after.point2.y,
            point1Next = points[i+1].before.point1.x + " " + points[i+1].before.point1.y,
            point2Next = points[i+1].before.point2.x + " " + points[i+1].before.point2.y,
            middlePoint1 = (points[i].after.point1.x+points[i].after.point2.x)/2 + " " + (points[i].after.point1.y+points[i].after.point2.y)/2,
            middlePoint2 = (points[i+1].before.point1.x+points[i+1].before.point2.x)/2 + " " + (points[i+1].before.point1.y+points[i+1].before.point2.y)/2,
            this_size = self.childs[i].options.size;

          self.circles.push(self.g.path("M " + point1 + 
            " A " + self.radiusBig + " " + self.radiusBig + (custom?((this_size<=0.5)?" 0, 0, 1 ":" 0, 1, 1 "):" 0, 0, 1 ") + point1Next + 
            " L " + point2Next + 
            " A " + self.radiusSmall + " " + self.radiusSmall + (custom?((this_size<=0.5)?" 0, 0, 0 ":" 0, 1, 0 "):" 0, 0, 0 ") + point2 + " Z")
          .attr({
            "strokeWidth": self.options["stroke"],
            "stroke": self.childs[i].options["stroke-color"],
            "stroke-opacity": self.childs[i].options["stroke-opacity"],
            "fill": self.childs[i].options["fill"],
            "fill-opacity": self.childs[i].options["fill-opacity"],
            "cursor": "pointer"
          })
          .click(function () {
            if (self.childs[i].options.onclick) {
              self.childs[i].options.onclick();
            }
            if (!self.childs[i].isOpened) {
              self.childs[i].open(i);
            }
          }));
          
          if (points[i].after.point1.x <= points[i+1].before.point1.x) {
            self.texts.push(self.g.text(0, 0, self.childs[i].label).attr({
              "textpath": "M " + middlePoint1 + " A " + (self.radiusBig+self.radiusSmall)/2 + " " + (self.radiusBig+self.radiusSmall)/2 + (custom?((this_size<=0.5)?" 0, 0, 1 ":" 0, 1, 1 "):" 0, 0, 1 ") + middlePoint2
            }));
          } else {
            self.texts.push(self.g.text(0, 0, self.childs[i].label).attr({
              "textpath": "M " + middlePoint2 + " A " + (self.radiusBig+self.radiusSmall)/2 + " " + (self.radiusBig+self.radiusSmall)/2 + (custom?((this_size<=0.5)?" 0, 0, 0 ":" 0, 1, 0 "):" 0, 0, 0 ") + middlePoint1
            }));
          }
          self.texts[i].attr({
            "fill": self.childs[i].options["font-color"],
            "font-family": self.childs[i].options["font-family"],
            "font-size": self.childs[i].options["font-size"],
            "text-anchor": "middle",
            "pointer-events": "none",
            "alignment-baseline": "baseline"
          });
          self.texts[i].textPath.attr({
            "startOffset": "50%",
            "alignment-baseline": "middle"
          });
        })(i);
      }
      this.addAnimationIn();
    },

    /** close current item */
    closeChildren: function () {
      if (this.g) {
        this.addAnimationOut();
      }
    },

    /** close childs of every item */
    closeAllChildren: function () {
      this.childs.forEach(function (el) {
        el.closeChildren();
      });
    },

    /** closing each circle */
    close: function () {
      var self = this,
        length;

      if (!this.parent) {
        length = this.mainGroup.selectAll("g").length;
        setTimeout(function () {
          self.clearWholeMenu();
        }, length*60);
      }

      if (this.g && !this.g.removed) {
        this.g.remove();
        this.circles = [];
        this.texts = [];
        this.defs = [];
        this.isOpened = false;
        this.closeAllChildren();
      }
    },

    /** remove all snapSVG elements after all circles was removed */
    clearWholeMenu: function () {
      this.g.remove();
      this.circles = [];
      this.texts = [];
      this.defs = [];
      this.isOpened = false;
      this.s.remove();
    },

    /** remove active  */
    removeActive: function () {
      var self = this;

      this.circles.forEach(function (el, index) {
        el.attr({
          "stroke": self.childs[index].options["stroke-color"],
          "stroke-opacity": self.childs[index].options["stroke-opacity"],
          "fill": self.childs[index].options["fill"],
          "fill-opacity": self.childs[index].options["fill-opacity"]    
        });
      });

      this.texts.forEach(function (el, index) {
        el.attr({
          "fill": self.childs[index].options["font-color"]   
        });
      });
    },

    /** add active styles */
    addActive: function (index) {
      this.circles[index].attr({
        "stroke": this.childs[index].options["active-stroke-color"],
        "stroke-opacity": this.childs[index].options["active-stroke-opacity"],
        "fill": this.childs[index].options["active-fill"],
        "fill-opacity": this.childs[index].options["active-fill-opacity"]  
      });

      this.texts[index].attr({
        "fill": this.childs[index].options["active-font-color"]
      });
    },

    /** animating each circle in */
    addAnimationIn: function () {
      var group = this.g;

      this.g
        .attr({opacity: 0})
        .transform("r0," + this.g.getBBox().x + ',' + this.g.getBBox().y + "s0.5, 0.5," + this.g.getBBox().cx + "," + this.g.getBBox().cy);

      this.g.animate({ 
        transform: "r0," + this.g.getBBox().x + ',' + this.g.getBBox().y + "s1,1," + this.g.getBBox().cx + "," + this.g.getBBox().cy,
        opacity: 1
      } , 300, mina.easeout);
    },

    /** animating each circle out. Callback - close next level circle */
    addAnimationOut: function () {
      var self = this;

      this.g.animate({ 
        transform: "r0," + this.g.getBBox().x + ',' + this.g.getBBox().y + "s0.8, 0.8," + this.g.getBBox().cx + "," + this.g.getBBox().cy,
        opacity: 0
      } , 60, mina.easeout, function () {
        self.close();
      });
    },

    /** return all children of current parent */
    children: function () {
      var children_arr = [];

      function childrenRecursion(arr) {
        arr.forEach(function (el, index) {
          children_arr.push(el);

          if (el.childs.length) {
            childrenRecursion(el.childs);
          }
        });
      }

      childrenRecursion(this.childs);
      return children_arr;
    },

    /** updating options */
    update: function (new_options) {
      this.options = extend(this.options, new_options);

      function updateOptions(arr) {
        arr.forEach(function (el, index) {
          el.options = extend(el.options, new_options);

          if (el.childs.length) {
            updateOptions(el.childs);
          }
        });
      }
      updateOptions(this.childs);
    },

    /** method to add children */
    add: function (label, options) {
      return new myMenuItem(label, options, this, this.parentOptions);
    }
  };

  /** myMenuItem constructor */
  var myMenuItem = function (label, options, parent, parentOptions) {
    this.parent = parent;
    this.defaults = this.parent.defaults;
    this.parentOptions = parentOptions;
    this.options = extend(this.parentOptions, options);
    this.label = label;

    // empty arrays too keep radial item objects
    this.childs = [];
    this.circles = [];
    this.texts = [];
    this.defs = [];

    // push just created menu item to parents items array
    this.parent.childs.push(this);

    // menuItem SVG elements
    this.svg = this.parent.svg;
    this.s = this.parent.s;
    this.mainGroup = this.parent.mainGroup;
    this.g;

    // action flag
    this.isOpened = false;
  };

  myMenuItem.prototype = radialMenu.prototype;

  window.radialMenu = radialMenu;
})(window);