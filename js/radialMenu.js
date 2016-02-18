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

  /** circlePoints: step, big radius, small radius, center point x/y, spacing between items */
  function circlePoints(step, r1, r2, cx, cy, spacing) {
    var points = [],
      x1Before,y1Before,x2Before,y2Before,x1After,y1After,x2After,y2After,
      flag = 0,
      circleLengthR1 = 2*Math.PI*r1,
      circleLengthR2 = 2*Math.PI*r2,
      spacingR1 = (spacing/2)*360/circleLengthR1,
      spacingR2 = (spacing/2)*360/circleLengthR2;

    for (var i=0; i<=360; i+=step) {
      x1Before = Math.round(cx + r1 * Math.cos((i-spacingR1) * (Math.PI/180))),
      y1Before = Math.round(cy + r1 * Math.sin((i-spacingR1) * (Math.PI/180))),
      x2Before = Math.round(cx + r2 * Math.cos((i-spacingR2) * (Math.PI/180))),
      y2Before = Math.round(cy + r2 * Math.sin((i-spacingR2) * (Math.PI/180))),
      x1After = Math.round(cx + r1 * Math.cos((i+spacingR1) * (Math.PI/180))),
      y1After = Math.round(cy + r1 * Math.sin((i+spacingR1) * (Math.PI/180))),
      x2After = Math.round(cx + r2 * Math.cos((i+spacingR2) * (Math.PI/180))),
      y2After = Math.round(cy + r2 * Math.sin((i+spacingR2) * (Math.PI/180)));

      // points[flag] = {
      //   point1: {
      //     x: x1,
      //     y: y1
      //   },
      //   point2: {
      //     x: x2,
      //     y: y2
      //   }
      // };

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

  /** radialMenu constructor */
  var radialMenu = function (options) {
    this.defaults = {
      "stroke": 1, //stroke width around every menu item, in pixels
      "spacing": 20, //amount of space between menu items
      "x": 100, //x location of the center of the menu
      "y": 100, //y location of the center of the menu
      "opacity": 1.0, //opacity of the main menu
      "size": null, //if set to a float value 0-1, attempt to allow the section to take that percent of the circle. if null, size is automatically calculated by
      "font-size": 14, //font size of this item, in pixels
      "font-family": 'Verdana',
      "font-color": '#000000',
      "active-font-color": '#FF0000',
      "active-stroke-color": '#FF0000',
      "active-stroke-opacity": 1.0,
      "active-fill": '#FF0',
      "active-fill-opacity": 1.0,
      "stroke-color": '#CCCCCC',
      "stroke-opacity": 1.0,
      "fill": '#DDD',
      "fill-opacity": 0.5,
      "data": null, //optionally additional object can be provided that will be sent to the callback, this could include an ID or URL to load on click
      "onclick": null, //callback, none by default
      "circlesSpacing": 2
    };
    this.options = extend(this.defaults, options);
    this.parentOptions = this.options;

    this.init();
  };

  radialMenu.prototype = {
    init: function () {
      var self = this;

      // add svg to body
      this.body = document.querySelector("body");
      this.xmlns = "http://www.w3.org/2000/svg";
      this.svg = document.createElementNS (this.xmlns, "svg");

      // snap svg element
      this.s = Snap(this.svg);
      this.g;
      this.radiusBig = 200;
      this.radiusSmall = 60;

      // empty arrays too keep radial item objects
      this.childs = [];
      this.circles = [];
      this.texts = [];
      this.defs = [];

      // if opened
      this.isOpened = true;
    },
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
        this.radiusBig = textRadius+(textRadius-this.radiusSmall);
      } else {
        this.radiusSmall = this.parent?this.parent.radiusBig + 10:this.radiusSmall;
        this.radiusBig = this.radiusSmall + 50;
      }
    },
    open: function () {
      if (this.isOpened) {
        this.buildSvg();
        this.buildChildren();
        this.isOpened = false;
      }
    },
    buildSvg: function () {
      this.svg.setAttributeNS (null, "width", "100%");
      this.svg.setAttributeNS (null, "height", "100%");
      this.svg.setAttribute("style", "position: fixed; left: 0; top: 0;");
      // this.svg.setAttribute("viewbox", "0 0 800 600");

      this.body.insertBefore(this.svg, this.body.firstChild);
    },
    buildChildren: function () {
      var step = 360/this.childs.length,
        points,
        self = this,
        childs_length,
        matrix = new Snap.Matrix();

      // Calculating radiuses before children builds
      this.calculateRadiuses();
      points = circlePoints(step, this.radiusBig, this.radiusSmall, this.options.x, this.options.y, this.options.spacing);
      childs_length = Object.keys(points).length;

      matrix.scale(1.2, 1.2);
      this.g = this.s.group();

      for (var i=0; i<childs_length-1; i++) {
        (function (i) {
          var point1 = points[i].after.point1.x + " " + points[i].after.point1.y,
            point2 = points[i].after.point2.x + " " + points[i].after.point2.y,
            point1Next = points[i+1].before.point1.x + " " + points[i+1].before.point1.y,
            point2Next = points[i+1].before.point2.x + " " + points[i+1].before.point2.y,
            middlePoint1 = (points[i].after.point1.x+points[i].after.point2.x)/2 + " " + (points[i].after.point1.y+points[i].after.point2.y)/2,
            middlePoint2 = (points[i+1].before.point1.x+points[i+1].before.point2.x)/2 + " " + (points[i+1].before.point1.y+points[i+1].before.point2.y)/2;

          self.circles.push(self.g.path("M " + point1 + 
            " A " + self.radiusBig + " " + self.radiusBig + ", 0, 0, 1 " + point1Next + 
            " L " + point2Next + 
            " A " + self.radiusSmall + " " + self.radiusSmall + ", 0, 0, 0 " + point2 + " Z")
          .attr({
            "strokeWidth": self.options["stroke"],
            "stroke": self.childs[i].options["stroke-color"],
            "stroke-opacity": self.childs[i].options["stroke-opacity"],
            "fill": self.childs[i].options["fill"],
            "fill-opacity": self.childs[i].options["fill-opacity"]
          })
          .click(function () {
            if (!self.childs[i].action_flag) {
              self.childs.forEach(function (el) {
                el.closeChildren();
              });
              self.removeActive();
              self.addActive(i);
              if (self.childs[i].options.onclick) {
                self.childs[i].options.onclick();
              } else {
                setTimeout(function () {
                  self.childs[i].buildChildren();
                  self.childs[i].action_flag = true;
                }, 100);
              }
            }
          }));
          
          if (points[i].after.point1.x <= points[i+1].before.point1.x) {
            self.texts.push(self.g.text(0, 0, self.childs[i].label).attr({
              "textpath": "M " + middlePoint1 + " A " + (self.radiusBig+self.radiusSmall)/2 + " " + (self.radiusBig+self.radiusSmall)/2 + ", 0, 0, 1 " + middlePoint2
            }));
          } else {
            self.texts.push(self.g.text(0, 0, self.childs[i].label).attr({
              "textpath": "M " + middlePoint2 + " A " + (self.radiusBig+self.radiusSmall)/2 + " " + (self.radiusBig+self.radiusSmall)/2 + ", 0, 0, 0 " + middlePoint1
            }));
          }
          self.texts[i].attr({
            "fill": self.options["font-color"],
            "font-family": self.options["font-family"],
            "font-size": self.options["font-size"],
            "text-anchor": "middle",
            "pointer-events": "none"
          });
          self.texts[i].textPath.attr("startOffset", "50%");
        })(i);
      }
      this.addAnimationIn();
    },
    closeChildren: function () {
      if (this.g) {
        this.addAnimationOut();
      }
    },
    closeAllChildren: function () {
      this.childs.forEach(function (el) {
        el.closeChildren();
      });
    },
    close: function () {
      this.g.remove();
      this.circles = [];
      this.texts = [];
      this.defs = [];
      this.action_flag = false;
      this.closeAllChildren();
    },
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
          "fill": self.options["font-color"]   
        });
      });

      this.childs.forEach(function (el, index) {
        el.action_flag = false;
      });
    },
    addActive: function (index) {

      this.circles[index].attr({
        "stroke": this.options["active-stroke-color"],
        "stroke-opacity": this.options["active-stroke-opacity"],
        "fill": this.options["active-fill"],
        "fill-opacity": this.options["active-fill-opacity"]  
      });

      this.texts[index].attr({
        "fill": this.options["active-font-color"]
      });
    },
    addAnimationIn: function () {
      var group = this.g;

      this.g
        .attr({opacity: 0})
        .transform("r0," + this.g.getBBox().x + ',' + this.g.getBBox().y + "s0.5, 0.5," + this.g.getBBox().cx + "," + this.g.getBBox().cy);

      this.g.animate({ 
        transform: "r0," + this.g.getBBox().x + ',' + this.g.getBBox().y + "s1,1," + this.g.getBBox().cx + "," + this.g.getBBox().cy,
        opacity: 1
      } ,300, mina.easeout);
    },
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
    /** end return children */

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
    /** end updating options */

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

    this.parent.childs.push(this);
    this.svg = this.parent.svg;
    this.s = this.parent.s;
    this.g;

    // action flag
    this.action_flag = false;

    // radiuses
    // this.radiusSmall = this.parent.radiusBig + 10;
    // this.radiusBig = this.radiusSmall + 50;
  };

  myMenuItem.prototype = new radialMenu();

  window.radialMenu = radialMenu;
})(window);
