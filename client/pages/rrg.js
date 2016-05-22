Template.rrgMain.rendered = function() {
  var token = Session.get('token');

  Tracker.autorun(function(){

    Meteor.subscribe('stockPrices_db',token);
    Meteor.subscribe('stockEvents_db',token);
    console.log("tracker");
  });

  Array.prototype.indexOf || (Array.prototype.indexOf = function(t, i) {
      if (void 0 === this || null === this) throw new TypeError('"this" is null or not defined');
      var e = this.length >>> 0;
      i = +i || 0;
      1 / 0 === Math.abs(i) && (i = 0);
      if (0 > i) {
          i += e;
          0 > i && (i = 0)
      }
      for (; e > i; i++)
          if (this[i] === t) return i;
      return -1
  });
  var rrg = {
      animationId: 0,
      zoomId: 0,
      mouseResizePosition: null,
      rrgChart: null,
      benchmarkChart: null,
      symbolGrid: null,
      isInitialized: !1,
      defaults: {
          s: "$cdnx,$compq,$indu,$nya,$tsx,$xax",
          b: void 0,
          p: "w",
          y: 3,
          t: 8,
          d: void 0,
          r: void 0,
          f: void 0,
          h: void 0,
          i: void 0,
          c: !1
      },
      submit: function() {
          var t = {
              s: $("#symbols").val().replace(/\s/g, ""),
              b: $("#benchmark").val().replace(/\s/g, ""),
              p: $("#period").val(),
              y: $("#years").val(),
              t: $("#taillength").val(),
              d: this.rrgChart.getEndTailTimeStamp().format("YYYYMMDD"),
              f: this.symbolGrid.getSortColumn() + "," + this.symbolGrid.getSortDirection(),
              c: this.rrgChart.isCentered()
          };
          this.rrgChart.isEndTailTimeStampToday() && delete t.d;
          this.limitDailyData(t);
          window.location = this.getLinkableVersion(t);
          return !1
      },
      submitWithoutPageRefresh: function() {
          this.init();
          return !1
      },
      limitDailyData: function(t) {
          "d" == t.p && t.y > 5 && (t.y = 5)
      },
      init: function() {
          var t = this;
          util.isFree() && $(".membercontent").hide();
          var i = this.parseForm();
          var e = this.parseUrl();
          var s = $.extend({}, this.defaults, i, e);
          this.limitDailyData(s);
          this.fillFormFields(s);
          this.hideUiElements();
          // changed getJson to return the json we want
          this.getJson("http://stockcharts.com/d-rrg/rrg", s, function(i, e, n, o, a) {
              $("#symbols").size() > 0 && "hidden" != $("#symbols").attr("type") && $("#symbols").val(n);
              $("#benchmark").val(i);
              t.showUiElements();
              t.initRrgChart(i, e, o, s.t, s.d, s.r, s.h, s.i, s.c);
              t.initBenchmarkChart(i, e, s.t, s.d);
              t.initSymbolGrid(a, s.t, s.p, s.f, s.h, s.i);
              t.initControls(s.t, s.p, s.c);
              t.isInitialized = !0
          })
      },
      hideUiElements: function() {
          $("#symbolgrid-title").hide();
          $("#showlinkableversion").hide();
          $("#controls").hide()
      },
      showUiElements: function() {
          $("#symbolgrid-title").show();
          $("#showlinkableversion").show();
          $("#controls").show()
      },
      parseUrl: function() {
          var t = {};
          if (util.isMember()) {
              var i = document.URL.split("?");
              if (i && 2 == i.length && i[1].length > 0) {
                  var e = i[1].toLowerCase().split("&");
                  for (var s = 0; s < e.length; s++) {
                      var n = e[s].split("=");
                      var o = n[0];
                      var a = void 0 != n[1] ? n[1].replace(/\s/g, "") : "";
                      o && a && (t[o] = a)
                  }
              }
          }
          return t
      },
      parseForm: function() {
          var t = {
              s: $("#symbols").val() ? $("#symbols").val() : void 0,
              b: $("#benchmark").val() ? $("#benchmark").val() : void 0,
              p: $("#period").val() ? $("#period").val() : void 0,
              y: $("#years").val() ? $("#years").val() : void 0,
              t: $("#taillength").val() ? $("#taillength").val() : void 0
          };
          if (this.rrgChart) {
              this.rrgChart.isEndTailTimeStampToday() || (t.d = this.rrgChart.getEndTailTimeStamp().format("YYYYMMDD"));
              t.c = this.rrgChart.isCentered();
              t.r = this.rrgChart.getValueBounds().left + "," + this.rrgChart.getValueBounds().right + "," + this.rrgChart.getValueBounds().bottom + "," + this.rrgChart.getValueBounds().top
          }
          if (this.symbolGrid) {
              t.f = this.symbolGrid.getSortColumn() + "," + this.symbolGrid.getSortDirection();
              t.h = this.symbolGrid.getHilitedSymbol();
              t.i = this.symbolGrid.getHiddenSymbols().join(",")
          }
          return t
      },
      fillFormFields: function(t) {
          $("#symbols").val(t.s);
          $("#benchmark").val(t.b);
          $("#period").val(t.p);
          $("#years").val(t.y);
          $("#taillength").val(t.t)
      },
      initRrgChart: function(t, i, e, s, n, o, a, r, h) {
          var l = this;
          this.rrgChart = new RrgChart("#rrgchart", {
              benchmarkSymbol: t,
              benchmarkData: i,
              rrgData: e,
              width: 600,
              height: 400,
              colorFill: null,
              colorBorder: null,
              endTailDate: n,
              tailLength: s,
              gridBounds: o,
              hilitedSymbol: a,
              hiddenSymbols: r,
              isCentered: h,
              onZoom: function(t) {
                  l.updateLinkableVersion();
                  l.setCentered(t)
              },
              onPan: function() {
                  l.updateLinkableVersion();
                  l.setCentered(!1)
              },
              onChangeTailLength: function(t, i) {
                  l.symbolGrid.setTailLength(i);
                  l.symbolGrid.setData(t);
                  l.updateLinkableVersion()
              },
              onChangeEndTailDate: function(t) {
                  l.symbolGrid.setData(t);
                  l.updateLinkableVersion()
              }
          })
      },
      initBenchmarkChart: function(t, i, e, s) {
          var n = this;
          this.benchmarkChart = new LineChart("#benchmarkchart", {
              series: new TimeSeries(t, i),
              width: 320,
              height: 240,
              pageColorFill: null,
              pageColorBorder: null,
              gridColorFill: "#f5f5f5",
              endTailDate: s,
              tailLength: e,
              useArrowKeys: !0,
              onInit: function(t, i) {
                  $("#enddate-value").text(i.format("MMM D, YYYY"))
              },
              onChange: function(t, i) {
                  $("#enddate-value").text(i.format("MMM D, YYYY"));
                  n.rrgChart && n.rrgChart.setEndTailDate(i.format("YYYYMMDD"))
              }
          })
      },
      initSymbolGrid: function(t, i, e, s, n, o) {
          var a = this;
          this.symbolGrid = new SymbolGrid("#symbolgrid", {
              companyInfo: t,
              data: this.rrgChart.getDataDump(),
              tailLength: i,
              period: e,
              sortFlags: s,
              hilitedSymbol: n,
              hiddenSymbols: o,
              onHiliteSymbol: function(t) {
                  a.rrgChart.hilite(t);
                  a.updateLinkableVersion()
              },
              onUnHiliteSymbol: function() {
                  a.rrgChart.unHilite();
                  a.updateLinkableVersion()
              },
              onHideSymbol: function(t) {
                  a.rrgChart.hideSymbol(t);
                  a.updateLinkableVersion()
              },
              onShowSymbol: function(t) {
                  a.rrgChart.showSymbol(t);
                  a.updateLinkableVersion()
              },
              onChange: function() {
                  a.symbolGrid && a.updateLinkableVersion()
              }
          })
      },
      initControls: function(t, i, e) {
          var s = "w" == i ? "week" : "trading day";
          1 != t && (s += "s");
          $(".period-value").text(s);
          if (!this.isInitialized) {
              var n = this;
              // $('#taillength').noUiSlider({
              //   start: [ 10 ],
              //   step: 1,
              //   range: {
              //     'min': [  0 ],
              //     'max': [ 30 ]
              //   }
              // });

              $("#taillength").slider({
                  value: 10,
                  step: 1,
                  width: 150,
                  min: 0,
                  max: 30,
                  sizeDragger: this.isTouchDevice() ? 28 : 16,
                  backgroundDragger: ["#ffffff", "#eeeeee"],
                  create: function(t, i) {
                      console.log("INIT");
                      $(".taillength-value").text(i.value);
                  },
                  slide: function(t, i) {
                      console.log('CHANGEEE');
                      $(".taillength-value").text(i.value);
                      var e = $("#period").val();
                      var s = "w" == e ? "week" : "trading day";
                      1 != i.value && (s += "s");
                      $(".period-value").text(s);
                      n.rrgChart.setTailLength(i.value);
                      n.benchmarkChart.setTailLength(i.value)
                  }
              });
              $("#animate").on("click", function() {
                  "animate" == $(this).text() ? n.startAnimation() : n.stopAnimation()
              });
              $("#zoomin").on("mousedown touchstart", function() {
                  n.zoomId = setInterval(function() {
                      n.rrgChart.zoom(.99)
                  }, 33)
              }).on("mouseup mouseout touchend", function() {
                  clearInterval(n.zoomId)
              });
              $("#zoomout").on("mousedown touchstart", function() {
                  n.zoomId = setInterval(function() {
                      n.rrgChart.zoom(1.01)
                  }, 33)
              }).on("mouseup mouseout touchend", function() {
                  clearInterval(n.zoomId)
              });
              $("#zoomfit").on("click", function() {
                  n.rrgChart.zoom("fit")
              });
              $("#zoomctr").on("click", function() {
                  n.rrgChart.zoom("ctr")
              });
              $("#zoommax").on("click", function() {
                  n.rrgChart.zoom("max")
              });
              $("#showlinkableversion").on("click", function(t) {
                  var i = $(this).text();
                  if (0 == i.indexOf("Show")) {
                      $("#linkableversion").show();
                      $(this).text("Hide Linkable Version")
                  } else {
                      $("#linkableversion").hide();
                      $(this).text("Show Linkable Version")
                  }
                  t.preventDefault()
              });
              $("#predef").on("change", function() {
                  var t = $(this).val();
                  var i = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + t;
                  window.location = i
              });
              $("#resize").on("mousedown", function(t) {
                  t.preventDefault();
                  n.startResize(t)
              });
              $("#expandscreen").on("click", function() {
                  var t = $(this).attr("src");
                  if (-1 != t.indexOf("expand")) {
                      $(this).attr("src", t.replace("expand", "compress"));
                      n.expandScreen()
                  } else {
                      $(this).attr("src", t.replace("compress", "expand"));
                      n.compressScreen()
                  }
              }).on("mouseover", function() {
                  $(this).css("cursor", "pointer")
              });
              this.setCentered(e);
              this.updateLinkableVersion()
          }
      },
      expandScreen: function() {
          var t = $("#ui").height();
          var i = $("#ui").offset().left + $("#ui").width();
          var e = $(window).width() - $("#ui").offset().left;
          var s = $(window).height();
          var n = e - i;
          var o = this.rrgChart.getWidth();
          var a = this.rrgChart.getHeight();
          if (n > 0) {
              var r = (o + n) / o;
              var h = a * (r - 1);
              t + h > s && (h = s - t);
              this.rrgChart.resize({
                  x: n,
                  y: h
              })
          }
      },
      compressScreen: function() {
          this.rrgChart.resetSize()
      },
      startResize: function(t) {
          this.mouseResizePosition = {
              x: t.pageX,
              y: t.pageY
          };
          var i = this;
          $("body").on("mousemove", function(t) {
              i.doResize(t)
          }).on("mouseup", function() {
              i.stopResize()
          })
      },
      doResize: function(t) {
          if (this.mouseResizePosition) {
              var i = {
                  x: Math.floor(t.pageX - this.mouseResizePosition.x),
                  y: Math.floor(t.pageY - this.mouseResizePosition.y)
              };
              (0 != i.x || 0 != i.y) && this.rrgChart.resize(i);
              this.mouseResizePosition = {
                  x: t.pageX,
                  y: t.pageY
              }
          }
      },
      stopResize: function() {
          this.mouseResizePosition = null;
          $(document.body).off("mousemove mouseup")
      },
      setCentered: function(t) {
          t ? $("#zoomctr").addClass("selected") : $("#zoomctr").removeClass("selected")
      },
      isTouchDevice: function() {
          return "ontouchstart" in window
      },
      updateLinkableVersion: function() {
          var t = this.getLinkableVersion();
          var i = $("#linkableversion");
          i.attr("href", t).text(t)
      },
      startAnimation: function() {
          var t = this;
          $("#animate").text("pause").addClass("selected");
          this.benchmarkChart.isTailAtEnd() && this.benchmarkChart.moveTailToStart();
          this.animationId = setInterval(function() {
              var i = t.benchmarkChart.incrementDate();
              i || t.stopAnimation()
          }, 150)
      },
      stopAnimation: function() {
          $("#animate").text("animate").removeClass("selected");
          clearInterval(this.animationId)
      },
      getLinkableVersion: function(t) {
          t || (t = this.parseForm());
          var i = window.location.protocol + "//" + window.location.host + window.location.pathname + "?";
          var e = 0;
          for (name in t) {
              var s = t[name];
              if (s) {
                  e > 0 && (i += "&");
                  i += name + "=" + t[name]
              }
              e++
          }
          return i
      },
      // originally: http://stockcharts.com/d-rrg/rrg?callback=jQuery1112012784511172177426_1463748828312&cmd=getrrgdata&auth=88658836448883843644141&f=json&s=%24cdnx%2C%24compq%2C%24indu%2C%24nya%2C%24tsx%2C%24xax&p=w&y=1&z=true&_=1463748828313
      getJson: function(t, i, e) {
          // var s = this;
          // $.ajax({
          //     url: t,
          //     type: "GET",
          //     data: {
          //         cmd: "getrrgdata",
          //         auth: window.authtoken,
          //         f: "json",
          //         s: i.s,
          //         b: i.b,
          //         p: i.p,
          //         y: i.y,
          //         z: !0
          //     },
          //     dataType: "jsonp",
          //     timeout: 5e3,
          //     error: function() {
          //         console && console.log("error getting data from server")
          //     },
          //     success: function(t) {
          //         results = s.parseJson(t);
          //         e && e(results.benchmarkSymbol, results.benchmarkData, results.rrgSymbols, results.rrgData, results.companyInfo)
          //     }
          // })

          // change string (text) or obj (json) to what we want our graph to be
  //         var string =
  // '{"companies":[{"symbol":"$CDNX","name":"S&P/TSX Venture (CDNX) Composite Index","sector":"","industry":""},{"symbol":"$COMPQ","name":"Nasdaq Composite","sector":"","industry":""},{"symbol":"$INDU","name":"Dow Jones Industrial Average","sector":"","industry":""},{"symbol":"$NYA","name":"NYSE Composite Index","sector":"","industry":""},{"symbol":"DER","name":"S&P 500 Large Cap Index","sector":"","industry":""},{"symbol":"$TSX","name":"TSX Composite Index","sector":"","industry":""},{"symbol":"$XAX","name":"AMEX Composite","sector":"","industry":""}],"rrgdata":[{"date":"20150522","DER":2126.0601,"rrgdata":{"$CDNX":{"price":703.48,"jdkratio":96.45,"jdkmom":null},"$COMPQ":{"price":5089.3618,"jdkratio":101.75,"jdkmom":null},"$INDU":{"price":18232.0195,"jdkratio":99.6,"jdkmom":null},"$NYA":{"price":11197.6855,"jdkratio":100.06,"jdkmom":null},"$TSX":{"price":15200.7598,"jdkratio":100.35,"jdkmom":null},"$XAX":{"price":2460.8003,"jdkratio":98.25,"jdkmom":null}}},{"date":"20150529","DER":2107.3899,"rrgdata":{"$CDNX":{"price":692.4,"jdkratio":97.54,"jdkmom":null},"$COMPQ":{"price":5070.0259,"jdkratio":101.68,"jdkmom":null},"$INDU":{"price":18010.6797,"jdkratio":99.56,"jdkmom":null},"$NYA":{"price":11056.3037,"jdkratio":100.13,"jdkmom":null},"$TSX":{"price":15014.0898,"jdkratio":100.53,"jdkmom":null},"$XAX":{"price":2429.4685,"jdkratio":98.54,"jdkmom":null}}},{"date":"20150605","DER":2092.8301,"rrgdata":{"$CDNX":{"price":689.82,"jdkratio":98,"jdkmom":null},"$COMPQ":{"price":5068.458,"jdkratio":101.68,"jdkmom":99.77},"$INDU":{"price":17849.4609,"jdkratio":99.53,"jdkmom":99.88},"$NYA":{"price":10979.3301,"jdkratio":100.13,"jdkmom":100.41},"$TSX":{"price":14957.1602,"jdkratio":100.52,"jdkmom":null},"$XAX":{"price":2350.5754,"jdkratio":98.56,"jdkmom":101.03}}},{"date":"20150612","DER":2094.1101,"rrgdata":{"$CDNX":{"price":682.14,"jdkratio":98.38,"jdkmom":103.25},"$COMPQ":{"price":5051.1021,"jdkratio":101.72,"jdkmom":99.83},"$INDU":{"price":17898.8398,"jdkratio":99.52,"jdkmom":99.89},"$NYA":{"price":11009.9111,"jdkratio":100.1,"jdkmom":100.27},"$TSX":{"price":14741.1504,"jdkratio":100.29,"jdkmom":100.09},"$XAX":{"price":2363.7412,"jdkratio":98.55,"jdkmom":100.73}}},{"date":"20150619","DER":2109.99,"rrgdata":{"$CDNX":{"price":683.89,"jdkratio":98.69,"jdkmom":102.68},"$COMPQ":{"price":5117.001,"jdkratio":101.73,"jdkmom":99.87},"$INDU":{"price":18015.9492,"jdkratio":99.49,"jdkmom":99.89},"$NYA":{"price":11038.96,"jdkratio":100.07,"jdkmom":100.16},"$TSX":{"price":14653.1201,"jdkratio":99.92,"jdkmom":99.7},"$XAX":{"price":2414.1169,"jdkratio":98.64,"jdkmom":100.58}}},{"date":"20150626","DER":2101.49,"rrgdata":{"$CDNX":{"price":679.38,"jdkratio":98.84,"jdkmom":102.08},"$COMPQ":{"price":5080.5049,"jdkratio":101.78,"jdkmom":99.97},"$INDU":{"price":17946.6797,"jdkratio":99.5,"jdkmom":99.91},"$NYA":{"price":11040.3135,"jdkratio":99.98,"jdkmom":100.02},"$TSX":{"price":14808.0898,"jdkratio":99.58,"jdkmom":99.39},"$XAX":{"price":2423.2925,"jdkratio":98.38,"jdkmom":100.16}}},{"date":"20150702","DER":2076.78,"rrgdata":{"$CDNX":{"price":null,"jdkratio":98.84,"jdkmom":101.48},"$COMPQ":{"price":5009.2139,"jdkratio":101.66,"jdkmom":99.9},"$INDU":{"price":17730.1094,"jdkratio":99.54,"jdkmom":99.97},"$NYA":{"price":10864.8203,"jdkratio":99.92,"jdkmom":99.91},"$TSX":{"price":null,"jdkratio":99.58,"jdkmom":99.45},"$XAX":{"price":2362.3469,"jdkratio":98.12,"jdkmom":99.83}}},{"date":"20150710","DER":2076.6201,"rrgdata":{"$CDNX":{"price":640.98,"jdkratio":98.71,"jdkmom":100.87},"$COMPQ":{"price":4997.6958,"jdkratio":101.68,"jdkmom":99.96},"$INDU":{"price":17760.4102,"jdkratio":99.57,"jdkmom":100.02},"$NYA":{"price":10853.9199,"jdkratio":99.82,"jdkmom":99.8},"$TSX":{"price":14411.0703,"jdkratio":99.2,"jdkmom":99.18},"$XAX":{"price":2367.2576,"jdkratio":97.89,"jdkmom":99.56}}},{"date":"20150717","DER":2126.6399,"rrgdata":{"$CDNX":{"price":628.81,"jdkratio":98.04,"jdkmom":99.87},"$COMPQ":{"price":5210.1431,"jdkratio":101.83,"jdkmom":100.1},"$INDU":{"price":18086.4492,"jdkratio":99.5,"jdkmom":99.97},"$NYA":{"price":10987.1699,"jdkratio":99.64,"jdkmom":99.66},"$TSX":{"price":14642.8398,"jdkratio":98.69,"jdkmom":98.84},"$XAX":{"price":2373.9575,"jdkratio":97.62,"jdkmom":99.32}}},{"date":"20150724","DER":2079.6499,"rrgdata":{"$CDNX":{"price":592.49,"jdkratio":97.18,"jdkmom":98.92},"$COMPQ":{"price":5088.6299,"jdkratio":101.91,"jdkmom":100.16},"$INDU":{"price":17568.5293,"jdkratio":99.39,"jdkmom":99.88},"$NYA":{"price":10721.9463,"jdkratio":99.45,"jdkmom":99.53},"$TSX":{"price":14186.2402,"jdkratio":98.22,"jdkmom":98.6},"$XAX":{"price":2291.417,"jdkratio":97.28,"jdkmom":99.09}}},{"date":"20150731","DER":2103.8401,"rrgdata":{"$CDNX":{"price":594.31,"jdkratio":96.24,"jdkmom":98.1},"$COMPQ":{"price":5128.2808,"jdkratio":101.89,"jdkmom":100.12},"$INDU":{"price":17689.8594,"jdkratio":99.3,"jdkmom":99.81},"$NYA":{"price":10882.2803,"jdkratio":99.33,"jdkmom":99.5},"$TSX":{"price":14468.7305,"jdkratio":97.94,"jdkmom":98.6},"$XAX":{"price":2419.6902,"jdkratio":97.3,"jdkmom":99.25}}},{"date":"20150807","DER":2077.5701,"rrgdata":{"$CDNX":{"price":576.6,"jdkratio":95.24,"jdkmom":97.39},"$COMPQ":{"price":5043.5439,"jdkratio":101.8,"jdkmom":100.02},"$INDU":{"price":17373.3809,"jdkratio":99.2,"jdkmom":99.75},"$NYA":{"price":10763.1504,"jdkratio":99.24,"jdkmom":99.51},"$TSX":{"price":14302.7002,"jdkratio":97.7,"jdkmom":98.67},"$XAX":{"price":2387.9587,"jdkratio":97.33,"jdkmom":99.41}}},{"date":"20150814","DER":2091.54,"rrgdata":{"$CDNX":{"price":573.21,"jdkratio":94.16,"jdkmom":96.74},"$COMPQ":{"price":5048.2349,"jdkratio":101.6,"jdkmom":99.84},"$INDU":{"price":17477.4004,"jdkratio":99.12,"jdkmom":99.72},"$NYA":{"price":10782.2373,"jdkratio":99.14,"jdkmom":99.52},"$TSX":{"price":14277.8799,"jdkratio":97.37,"jdkmom":98.67},"$XAX":{"price":2381.8484,"jdkratio":97.64,"jdkmom":99.83}}},{"date":"20150821","DER":1970.89,"rrgdata":{"$CDNX":{"price":537.52,"jdkratio":92.95,"jdkmom":96.13},"$COMPQ":{"price":4706.0391,"jdkratio":101.4,"jdkmom":99.68},"$INDU":{"price":16459.75,"jdkratio":98.99,"jdkmom":99.65},"$NYA":{"price":10195.6904,"jdkratio":99.04,"jdkmom":99.53},"$TSX":{"price":13473.6699,"jdkratio":97.05,"jdkmom":98.66},"$XAX":{"price":2235.553,"jdkratio":97.86,"jdkmom":100.15}}},{"date":"20150828","DER":1988.87,"rrgdata":{"$CDNX":{"price":555.67,"jdkratio":91.99,"jdkmom":95.89},"$COMPQ":{"price":4828.3252,"jdkratio":101.26,"jdkmom":99.6},"$INDU":{"price":16643.0098,"jdkratio":98.89,"jdkmom":99.6},"$NYA":{"price":10242.0596,"jdkratio":98.96,"jdkmom":99.57},"$TSX":{"price":13865.0703,"jdkratio":97.06,"jdkmom":98.95},"$XAX":{"price":2230.1304,"jdkratio":97.94,"jdkmom":100.28}}},{"date":"20150904","DER":1921.22,"rrgdata":{"$CDNX":{"price":552.61,"jdkratio":91.33,"jdkmom":96.05},"$COMPQ":{"price":4683.9189,"jdkratio":101.16,"jdkmom":99.56},"$INDU":{"price":16102.3799,"jdkratio":98.81,"jdkmom":99.61},"$NYA":{"price":9871.8555,"jdkratio":98.83,"jdkmom":99.55},"$TSX":{"price":13478.3096,"jdkratio":97.31,"jdkmom":99.46},"$XAX":{"price":2144.0215,"jdkratio":97.83,"jdkmom":100.21}}},{"date":"20150911","DER":1961.05,"rrgdata":{"$CDNX":{"price":547.2,"jdkratio":90.49,"jdkmom":96.08},"$COMPQ":{"price":4822.3408,"jdkratio":101.18,"jdkmom":99.63},"$INDU":{"price":16433.0898,"jdkratio":98.71,"jdkmom":99.6},"$NYA":{"price":10040.2207,"jdkratio":98.71,"jdkmom":99.56},"$TSX":{"price":13461.4697,"jdkratio":97.27,"jdkmom":99.64},"$XAX":{"price":2162.0649,"jdkratio":97.74,"jdkmom":100.13}}},{"date":"20150918","DER":1958.03,"rrgdata":{"$CDNX":{"price":549.91,"jdkratio":90.09,"jdkmom":96.57},"$COMPQ":{"price":4827.228,"jdkratio":101.26,"jdkmom":99.77},"$INDU":{"price":16384.5801,"jdkratio":98.58,"jdkmom":99.58},"$NYA":{"price":10031.6025,"jdkratio":98.6,"jdkmom":99.56},"$TSX":{"price":13646.9004,"jdkratio":97.46,"jdkmom":99.97},"$XAX":{"price":2228.2744,"jdkratio":97.81,"jdkmom":100.18}}},{"date":"20150925","DER":1931.34,"rrgdata":{"$CDNX":{"price":541.5,"jdkratio":90.08,"jdkmom":97.37},"$COMPQ":{"price":4686.4961,"jdkratio":101.07,"jdkmom":99.67},"$INDU":{"price":16314.6699,"jdkratio":98.58,"jdkmom":99.67},"$NYA":{"price":9857.25,"jdkratio":98.58,"jdkmom":99.64},"$TSX":{"price":13378.5703,"jdkratio":97.64,"jdkmom":100.22},"$XAX":{"price":2173.2119,"jdkratio":98.1,"jdkmom":100.38}}},{"date":"20151002","DER":1951.36,"rrgdata":{"$CDNX":{"price":525.56,"jdkratio":90.22,"jdkmom":98.23},"$COMPQ":{"price":4707.7749,"jdkratio":100.88,"jdkmom":99.6},"$INDU":{"price":16472.3691,"jdkratio":98.64,"jdkmom":99.8},"$NYA":{"price":9973.5586,"jdkratio":98.57,"jdkmom":99.71},"$TSX":{"price":13339.7402,"jdkratio":97.85,"jdkmom":100.44},"$XAX":{"price":2212.0115,"jdkratio":98.53,"jdkmom":100.68}}},{"date":"20151009","DER":2014.89,"rrgdata":{"$CDNX":{"price":552.26,"jdkratio":90.52,"jdkmom":99.13},"$COMPQ":{"price":4830.4702,"jdkratio":100.68,"jdkmom":99.52},"$INDU":{"price":17084.4902,"jdkratio":98.79,"jdkmom":100},"$NYA":{"price":10361.2598,"jdkratio":98.57,"jdkmom":99.79},"$TSX":{"price":13964.3604,"jdkratio":98.05,"jdkmom":100.62},"$XAX":{"price":2317.1782,"jdkratio":98.55,"jdkmom":100.56}}},{"date":"20151016","DER":2033.11,"rrgdata":{"$CDNX":{"price":556.3,"jdkratio":90.88,"jdkmom":99.93},"$COMPQ":{"price":4886.688,"jdkratio":100.55,"jdkmom":99.51},"$INDU":{"price":17215.9707,"jdkratio":98.96,"jdkmom":100.19},"$NYA":{"price":10421.9092,"jdkratio":98.54,"jdkmom":99.83},"$TSX":{"price":13838.0996,"jdkratio":98.11,"jdkmom":100.59},"$XAX":{"price":2329.198,"jdkratio":98.56,"jdkmom":100.46}}},{"date":"20151023","DER":2075.1499,"rrgdata":{"$CDNX":{"price":551.21,"jdkratio":91.13,"jdkmom":100.42},"$COMPQ":{"price":5031.8638,"jdkratio":100.53,"jdkmom":99.58},"$INDU":{"price":17646.6992,"jdkratio":99.17,"jdkmom":100.38},"$NYA":{"price":10506.5107,"jdkratio":98.5,"jdkmom":99.85},"$TSX":{"price":13953.6602,"jdkratio":98.14,"jdkmom":100.49},"$XAX":{"price":2304.9612,"jdkratio":98.48,"jdkmom":100.32}}},{"date":"20151030","DER":2079.3601,"rrgdata":{"$CDNX":{"price":542.03,"jdkratio":91.44,"jdkmom":100.83},"$COMPQ":{"price":5053.748,"jdkratio":100.61,"jdkmom":99.73},"$INDU":{"price":17663.5391,"jdkratio":99.38,"jdkmom":100.54},"$NYA":{"price":10460.96,"jdkratio":98.4,"jdkmom":99.81},"$TSX":{"price":13529.1699,"jdkratio":97.99,"jdkmom":100.23},"$XAX":{"price":2304.5583,"jdkratio":98.45,"jdkmom":100.22}}},{"date":"20151106","DER":2099.2,"rrgdata":{"$CDNX":{"price":534.28,"jdkratio":91.38,"jdkmom":100.76},"$COMPQ":{"price":5147.1201,"jdkratio":100.61,"jdkmom":99.79},"$INDU":{"price":17910.3301,"jdkratio":99.59,"jdkmom":100.67},"$NYA":{"price":10513.3564,"jdkratio":98.3,"jdkmom":99.77},"$TSX":{"price":13553.2998,"jdkratio":97.63,"jdkmom":99.83},"$XAX":{"price":2253.6982,"jdkratio":98.32,"jdkmom":100.04}}},{"date":"20151113","DER":2023.04,"rrgdata":{"$CDNX":{"price":523.95,"jdkratio":91.17,"jdkmom":100.44},"$COMPQ":{"price":4927.8828,"jdkratio":100.51,"jdkmom":99.76},"$INDU":{"price":17245.2402,"jdkratio":99.78,"jdkmom":100.73},"$NYA":{"price":10155.0703,"jdkratio":98.26,"jdkmom":99.77},"$TSX":{"price":13075.4004,"jdkratio":97.23,"jdkmom":99.43},"$XAX":{"price":2186.5696,"jdkratio":98.38,"jdkmom":100.03}}},{"date":"20151120","DER":2089.1699,"rrgdata":{"$CDNX":{"price":520.65,"jdkratio":91.07,"jdkmom":100.21},"$COMPQ":{"price":5104.9189,"jdkratio":100.39,"jdkmom":99.74},"$INDU":{"price":17823.8105,"jdkratio":99.96,"jdkmom":100.76},"$NYA":{"price":10444.2021,"jdkratio":98.21,"jdkmom":99.77},"$TSX":{"price":13433.4902,"jdkratio":97.05,"jdkmom":99.29},"$XAX":{"price":2247.0842,"jdkratio":98.5,"jdkmom":100.08}}},{"date":"20151127","DER":2090.1101,"rrgdata":{"$CDNX":{"price":521.99,"jdkratio":90.83,"jdkmom":99.86},"$COMPQ":{"price":5127.5249,"jdkratio":100.23,"jdkmom":99.68},"$INDU":{"price":17798.4902,"jdkratio":100.15,"jdkmom":100.77},"$NYA":{"price":10450.5303,"jdkratio":98.15,"jdkmom":99.75},"$TSX":{"price":13368.2402,"jdkratio":96.63,"jdkmom":98.98},"$XAX":{"price":2263.1726,"jdkratio":98.3,"jdkmom":99.85}}},{"date":"20151204","DER":2091.6899,"rrgdata":{"$CDNX":{"price":517.14,"jdkratio":90.56,"jdkmom":99.53},"$COMPQ":{"price":5142.271,"jdkratio":100.23,"jdkmom":99.75},"$INDU":{"price":17847.6309,"jdkratio":100.27,"jdkmom":100.72},"$NYA":{"price":10408.8594,"jdkratio":98.1,"jdkmom":99.76},"$TSX":{"price":13358.7695,"jdkratio":96.26,"jdkmom":98.77},"$XAX":{"price":2221.7307,"jdkratio":98.06,"jdkmom":99.66}}},{"date":"20151211","DER":2012.37,"rrgdata":{"$CDNX":{"price":502.09,"jdkratio":90.69,"jdkmom":99.64},"$COMPQ":{"price":4933.4648,"jdkratio":100.29,"jdkmom":99.85},"$INDU":{"price":17265.2109,"jdkratio":100.45,"jdkmom":100.7},"$NYA":{"price":9976.6504,"jdkratio":98.01,"jdkmom":99.73},"$TSX":{"price":12789.9502,"jdkratio":95.94,"jdkmom":98.68},"$XAX":{"price":2105.0105,"jdkratio":97.64,"jdkmom":99.33}}},{"date":"20151218","DER":2005.55,"rrgdata":{"$CDNX":{"price":501.3,"jdkratio":90.66,"jdkmom":99.64},"$COMPQ":{"price":4923.082,"jdkratio":100.45,"jdkmom":100.02},"$INDU":{"price":17128.5508,"jdkratio":100.53,"jdkmom":100.61},"$NYA":{"price":9967.6436,"jdkratio":97.86,"jdkmom":99.66},"$TSX":{"price":13024.2998,"jdkratio":95.59,"jdkmom":98.61},"$XAX":{"price":2104.9722,"jdkratio":97.06,"jdkmom":98.9}}},{"date":"20151224","DER":2060.99,"rrgdata":{"$CDNX":{"price":516.83,"jdkratio":90.71,"jdkmom":99.74},"$COMPQ":{"price":5048.4922,"jdkratio":100.57,"jdkmom":100.14},"$INDU":{"price":17552.1699,"jdkratio":100.6,"jdkmom":100.52},"$NYA":{"price":10258.5479,"jdkratio":97.75,"jdkmom":99.62},"$TSX":{"price":13309.7998,"jdkratio":95.4,"jdkmom":98.72},"$XAX":{"price":2178.6484,"jdkratio":96.54,"jdkmom":98.59}}},{"date":"20151231","DER":2043.9399,"rrgdata":{"$CDNX":{"price":525.59,"jdkratio":91.18,"jdkmom":100.29},"$COMPQ":{"price":5007.4111,"jdkratio":100.64,"jdkmom":100.2},"$INDU":{"price":17425.0293,"jdkratio":100.63,"jdkmom":100.41},"$NYA":{"price":10143.4199,"jdkratio":97.73,"jdkmom":99.68},"$TSX":{"price":13009.9502,"jdkratio":95.23,"jdkmom":98.86},"$XAX":{"price":2149.1458,"jdkratio":96.21,"jdkmom":98.51}}},{"date":"20160108","DER":1922.03,"rrgdata":{"$CDNX":{"price":514.67,"jdkratio":92.12,"jdkmom":101.24},"$COMPQ":{"price":4643.6309,"jdkratio":100.57,"jdkmom":100.14},"$INDU":{"price":16346.4502,"jdkratio":100.66,"jdkmom":100.32},"$NYA":{"price":9528.7676,"jdkratio":97.78,"jdkmom":99.79},"$TSX":{"price":12445.4502,"jdkratio":95.5,"jdkmom":99.38},"$XAX":{"price":2027.3616,"jdkratio":95.94,"jdkmom":98.5}}},{"date":"20160115","DER":1880.33,"rrgdata":{"$CDNX":{"price":488.96,"jdkratio":93.07,"jdkmom":102.03},"$COMPQ":{"price":4488.417,"jdkratio":100.36,"jdkmom":99.94},"$INDU":{"price":15988.0801,"jdkratio":100.64,"jdkmom":100.2},"$NYA":{"price":9299.6201,"jdkratio":97.84,"jdkmom":99.9},"$TSX":{"price":12073.46,"jdkratio":95.74,"jdkmom":99.8},"$XAX":{"price":1949.4473,"jdkratio":95.92,"jdkmom":98.75}}},{"date":"20160122","DER":1906.9,"rrgdata":{"$CDNX":{"price":483.67,"jdkratio":93.68,"jdkmom":102.38},"$COMPQ":{"price":4591.1802,"jdkratio":100.26,"jdkmom":99.86},"$INDU":{"price":16093.5098,"jdkratio":100.58,"jdkmom":100.08},"$NYA":{"price":9426.9072,"jdkratio":97.89,"jdkmom":99.99},"$TSX":{"price":12389.5801,"jdkratio":96,"jdkmom":100.2},"$XAX":{"price":1983.0798,"jdkratio":95.88,"jdkmom":99.01}}},{"date":"20160129","DER":1940.24,"rrgdata":{"$CDNX":{"price":499.52,"jdkratio":94.75,"jdkmom":103.06},"$COMPQ":{"price":4613.9531,"jdkratio":100.03,"jdkmom":99.66},"$INDU":{"price":16466.3008,"jdkratio":100.55,"jdkmom":100},"$NYA":{"price":9632.7002,"jdkratio":97.99,"jdkmom":100.11},"$TSX":{"price":12822.1299,"jdkratio":96.48,"jdkmom":100.72},"$XAX":{"price":2085.2197,"jdkratio":96.05,"jdkmom":99.44}}},{"date":"20160205","DER":1880.05,"rrgdata":{"$CDNX":{"price":508.15,"jdkratio":95.97,"jdkmom":103.71},"$COMPQ":{"price":4363.144,"jdkratio":99.61,"jdkmom":99.3},"$INDU":{"price":16204.9697,"jdkratio":100.64,"jdkmom":100.05},"$NYA":{"price":9390.3301,"jdkratio":98.13,"jdkmom":100.25},"$TSX":{"price":12763.9902,"jdkratio":97.14,"jdkmom":101.3},"$XAX":{"price":2046.2926,"jdkratio":96.25,"jdkmom":99.86}}},{"date":"20160212","DER":1864.78,"rrgdata":{"$CDNX":{"price":511.14,"jdkratio":97.24,"jdkmom":104.26},"$COMPQ":{"price":4337.5122,"jdkratio":99.23,"jdkmom":99.04},"$INDU":{"price":15973.8398,"jdkratio":100.66,"jdkmom":100.05},"$NYA":{"price":9229.6777,"jdkratio":98.22,"jdkmom":100.32},"$TSX":{"price":12381.2402,"jdkratio":97.64,"jdkmom":101.62},"$XAX":{"price":2035.2067,"jdkratio":96.59,"jdkmom":100.33}}},{"date":"20160219","DER":1917.78,"rrgdata":{"$CDNX":{"price":530.76,"jdkratio":98.36,"jdkmom":104.51},"$COMPQ":{"price":4504.4292,"jdkratio":98.94,"jdkmom":98.92},"$INDU":{"price":16391.9902,"jdkratio":100.58,"jdkmom":99.96},"$NYA":{"price":9485.96,"jdkratio":98.33,"jdkmom":100.38},"$TSX":{"price":12813.4199,"jdkratio":98.2,"jdkmom":101.9},"$XAX":{"price":2077.6821,"jdkratio":96.99,"jdkmom":100.75}}},{"date":"20160226","DER":1948.05,"rrgdata":{"$CDNX":{"price":538.06,"jdkratio":99.43,"jdkmom":104.56},"$COMPQ":{"price":4590.4731,"jdkratio":98.64,"jdkmom":98.83},"$INDU":{"price":16639.9707,"jdkratio":100.53,"jdkmom":99.92},"$NYA":{"price":9619.7959,"jdkratio":98.42,"jdkmom":100.39},"$TSX":{"price":12798.4502,"jdkratio":98.46,"jdkmom":101.81},"$XAX":{"price":2101.9463,"jdkratio":97.47,"jdkmom":101.14}}},{"date":"20160304","DER":1999.99,"rrgdata":{"$CDNX":{"price":562.38,"jdkratio":100.52,"jdkmom":104.58},"$COMPQ":{"price":4717.021,"jdkratio":98.36,"jdkmom":98.8},"$INDU":{"price":17006.7695,"jdkratio":100.46,"jdkmom":99.87},"$NYA":{"price":9968.4111,"jdkratio":98.56,"jdkmom":100.44},"$TSX":{"price":13212.5,"jdkratio":98.82,"jdkmom":101.76},"$XAX":{"price":2220.1836,"jdkratio":98.07,"jdkmom":101.55}}},{"date":"20160311","DER":2022.1899,"rrgdata":{"$CDNX":{"price":576.35,"jdkratio":101.43,"jdkmom":104.4},"$COMPQ":{"price":4748.4658,"jdkratio":98.03,"jdkmom":98.75},"$INDU":{"price":17213.3105,"jdkratio":100.38,"jdkmom":99.83},"$NYA":{"price":10104.1865,"jdkratio":98.73,"jdkmom":100.51},"$TSX":{"price":13522,"jdkratio":99.38,"jdkmom":101.88},"$XAX":{"price":2246.4578,"jdkratio":98.7,"jdkmom":101.88}}},{"date":"20160318","DER":2049.5801,"rrgdata":{"$CDNX":{"price":580.82,"jdkratio":101.88,"jdkmom":103.81},"$COMPQ":{"price":4795.647,"jdkratio":97.78,"jdkmom":98.78},"$INDU":{"price":17602.3008,"jdkratio":100.39,"jdkmom":99.86},"$NYA":{"price":10223.4277,"jdkratio":98.91,"jdkmom":100.57},"$TSX":{"price":13497.1299,"jdkratio":99.67,"jdkmom":101.73},"$XAX":{"price":2231.9924,"jdkratio":99.15,"jdkmom":101.96}}},{"date":"20160324","DER":2035.9399,"rrgdata":{"$CDNX":{"price":580.02,"jdkratio":102.74,"jdkmom":103.63},"$COMPQ":{"price":4773.5049,"jdkratio":97.71,"jdkmom":99},"$INDU":{"price":17515.7305,"jdkratio":100.41,"jdkmom":99.9},"$NYA":{"price":10086.6035,"jdkratio":99.06,"jdkmom":100.58},"$TSX":{"price":13358.1104,"jdkratio":100.09,"jdkmom":101.68},"$XAX":{"price":2188.928,"jdkratio":99.64,"jdkmom":102.03}}},{"date":"20160401","DER":2072.78,"rrgdata":{"$CDNX":{"price":581.41,"jdkratio":103.84,"jdkmom":103.68},"$COMPQ":{"price":4914.542,"jdkratio":97.65,"jdkmom":99.2},"$INDU":{"price":17792.75,"jdkratio":100.5,"jdkmom":100},"$NYA":{"price":10219.96,"jdkratio":99.17,"jdkmom":100.56},"$TSX":{"price":13440.3301,"jdkratio":100.33,"jdkmom":101.49},"$XAX":{"price":2233.4009,"jdkratio":100.11,"jdkmom":102.04}}},{"date":"20160408","DER":2047.6,"rrgdata":{"$CDNX":{"price":603.94,"jdkratio":105.04,"jdkmom":103.83},"$COMPQ":{"price":4850.689,"jdkratio":97.74,"jdkmom":99.5},"$INDU":{"price":17576.9609,"jdkratio":100.53,"jdkmom":100.04},"$NYA":{"price":10119.6904,"jdkratio":99.24,"jdkmom":100.51},"$TSX":{"price":13396.7305,"jdkratio":100.4,"jdkmom":101.19},"$XAX":{"price":2249.8462,"jdkratio":100.34,"jdkmom":101.8}}},{"date":"20160415","DER":2080.73,"rrgdata":{"$CDNX":{"price":633.84,"jdkratio":106.01,"jdkmom":103.79},"$COMPQ":{"price":4938.2158,"jdkratio":98.08,"jdkmom":99.98},"$INDU":{"price":17897.4609,"jdkratio":100.42,"jdkmom":99.96},"$NYA":{"price":10355.5654,"jdkratio":99.31,"jdkmom":100.45},"$TSX":{"price":13637.2002,"jdkratio":100.25,"jdkmom":100.74},"$XAX":{"price":2293.9492,"jdkratio":100.58,"jdkmom":101.59}}},{"date":"20160422","DER":2091.5801,"rrgdata":{"$CDNX":{"price":656.17,"jdkratio":107.04,"jdkmom":103.82},"$COMPQ":{"price":4906.228,"jdkratio":98.27,"jdkmom":100.25},"$INDU":{"price":18003.75,"jdkratio":100.41,"jdkmom":99.96},"$NYA":{"price":10510.9951,"jdkratio":99.51,"jdkmom":100.52},"$TSX":{"price":13873.9805,"jdkratio":100.39,"jdkmom":100.64},"$XAX":{"price":2309.5547,"jdkratio":100.76,"jdkmom":101.34}}},{"date":"20160429","DER":2065.3,"rrgdata":{"$CDNX":{"price":674.87,"jdkratio":108.13,"jdkmom":103.9},"$COMPQ":{"price":4775.3579,"jdkratio":98.26,"jdkmom":100.28},"$INDU":{"price":17773.6406,"jdkratio":100.41,"jdkmom":99.98},"$NYA":{"price":10436.915,"jdkratio":99.76,"jdkmom":100.63},"$TSX":{"price":13951.4502,"jdkratio":100.55,"jdkmom":100.56},"$XAX":{"price":2358.5911,"jdkratio":101.27,"jdkmom":101.43}}},{"date":"20160506","DER":2057.1399,"rrgdata":{"$CDNX":{"price":668.97,"jdkratio":109.25,"jdkmom":104.01},"$COMPQ":{"price":4736.1548,"jdkratio":98.16,"jdkmom":100.2},"$INDU":{"price":17740.6309,"jdkratio":100.45,"jdkmom":100.02},"$NYA":{"price":10308.8311,"jdkratio":100,"jdkmom":100.7},"$TSX":{"price":13701.4697,"jdkratio":100.82,"jdkmom":100.61},"$XAX":{"price":2318.2925,"jdkratio":101.79,"jdkmom":101.53}}},{"date":"20160513","DER":2046.61,"rrgdata":{"$CDNX":{"price":679.68,"jdkratio":110.33,"jdkmom":104.06},"$COMPQ":{"price":4717.6758,"jdkratio":98.07,"jdkmom":100.11},"$INDU":{"price":17535.3203,"jdkratio":100.49,"jdkmom":100.04},"$NYA":{"price":10228.0537,"jdkratio":100.11,"jdkmom":100.66},"$TSX":{"price":13748.5801,"jdkratio":101.04,"jdkmom":100.64},"$XAX":{"price":2299.6421,"jdkratio":101.98,"jdkmom":101.35}}},{"date":"20160520","DER":2050.21,"rrgdata":{"$CDNX":{"price":683,"jdkratio":111.17,"jdkmom":103.84},"$COMPQ":{"price":4746.0571,"jdkratio":98.08,"jdkmom":100.08},"$INDU":{"price":17511.6895,"jdkratio":100.51,"jdkmom":100.05},"$NYA":{"price":10230.0117,"jdkratio":100.14,"jdkmom":100.56},"$TSX":{"price":13901.6201,"jdkratio":101.15,"jdkmom":100.59},"$XAX":{"price":2294.4067,"jdkratio":102.03,"jdkmom":101.08}}}]}';
  //         var obj = JSON.parse(string);
          var obj = this.generateJson();
          var results = this.parseJson(obj);
          e && e(results.benchmarkSymbol, results.benchmarkData, results.rrgSymbols, results.rrgData, results.companyInfo);
      },
      generateJson: function() {
        var token = Session.get('token');
        var helpers = {};
        helpers.average = function(data){
          var sum = 0;
          for(var i = 0; i<data.length; i++) {
            sum = sum + data[i];
          }

          var avg = sum / data.length;
          return avg;
        }

        function standardDeviation(values){
          var avg = helpers.average(values);
          
          var squareDiffs = values.map(function(value){
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
          });
          
          var avgSquareDiff = helpers.average(squareDiffs);

          var stdDev = Math.sqrt(avgSquareDiff);
          return stdDev;
        }

        // (from: https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object)
        function yyyymmdd(d) {
          var yyyy = d.getFullYear().toString();
          var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
          var dd  = d.getDate().toString();
          return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
        }
        var wanted_company = Session.get('company');
        var json = new Object();
        // companies
        var all_company = _.uniq(StockPrices.find({token: token}, {fields:{company_name:1}},{sort:{company_name: 1}}).fetch().map(function(x){return x.company_name}),true);
        var list_companies = [];
        all_company.forEach(function(c){
          // have to find a way to get companies' real names
          list_companies.push({
            symbol: c,
            name: "",
            industry: "",
          });
        });
        // rrgdata - for all dates, list all companies' values
        // start: 04 FEB 2015, end: 27 JAN 2016 (??), increment: +7 days
        var list_rrgdata = [];
        var date = new Date(Date.UTC(2015, 1, 4, 6));
        var oldratios = {};
        var ratio = null;
        for (var i=0; i<52; i++) {
          var dateString = yyyymmdd(date);

          var company_price_query = StockPrices.findOne({token: token, date: date, company_name:wanted_company}, {fields: {last: 1, open:1}});
          var company_price;
          if (company_price_query == null) {
            // can't use findOne for some reason
            // TODO fix, doesn't work
            console.log('null: ' + date);
            // var all_queries = StockPrices.find({date: date, company_name:wanted_company}, {fields: {last: 1, open:1}});
            // if ((all_queries != null) && (all_queries.length > 0) && (all_queries[0] != null)) {
            //   company_price = all_queries[0].last;
            // } else {
            //   company_price = null;
            // }
          } else {
            console.log('not null: ' + date);
            company_price = company_price_query.last;
          }
          
          var current = new Object();
          current.date = dateString;
          current[wanted_company] = company_price;
          var other_prices = new Object();
          // other companies' prices
          // https://quant.stackexchange.com/questions/17963/how-to-calculate-the-jdk-rs-ratio
          // http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:price_relative
          // http://www.investopedia.com/articles/technical/03/070203.asp

          var rcps = []; // relative last/closing prices for all companies today
          all_company.forEach(function(company) {
            var price_query = StockPrices.findOne({date: date, company_name: company}, {fields:{last:1}});
            var price = null;
            var rcp = null;
            if ((price_query == null) || (company_price_query == null)) {
              rcp = 100;
            } else {
              price = price_query.last;
              var rcp = 100 * (price / company_price);
            }
            rcps.push(rcp);
          });
          var average = helpers.average(rcps);
          var stddev = standardDeviation(rcps);
          // console.log('average: ' + average);
          // console.log('stddev: ' + stddev);

          var other_companies = [];
          var index = all_company.indexOf(wanted_company);
          if (index > -1) {
            all_company.splice(index, 1);
          }
          all_company.forEach(function(company) {
            var price_query = StockPrices.findOne({date: date, company_name: company}, {fields:{last:1}});
            var price = null;
            var momentum = null;
            var jdkratio = null;
            var jdkmom = null;
            // also need ratio & momentum
            if ((price_query != null) && (company_price_query != null)) {
              // we can calculate safely
              price = price_query.last;
              ratio = price/company_price;
              // console.log(price + ' ' + company_price);
              
              if (oldratios[company] != null) {
                momentum = oldratios[company] - ratio;
              }

              // normalise ratio & momentum
              if (ratio != null) {
                jdkratio = (((100*ratio) - average)/stddev) + 100;
                // console.log(ratio + ' ' + average + ' ' + stddev);
              } else {
                jdkratio = null;
              }
              if (momentum != null) {
                // jdkmom = (((100*momentum) - average)/stddev) + 100;
                jdkmom = 100 + momentum;
              } /*else {
                jdkmom = 100;
              }*/
              // console.log(momentum);
            }
            // console.log(price + ' ' + jdkratio + ' ' + jdkmom);
            company_stats = new Object();
            company_stats.price = price;
            company_stats.jdkmom = jdkmom;
            company_stats.jdkratio = jdkratio;
            other_prices[company] = company_stats;

            // increment oldratio of this company
            oldratios[company] = ratio;
          });
          current.rrgdata = other_prices;
          list_rrgdata.push(current);

          // increment date
          var inc = date.getUTCDate() + 7;
          date.setUTCDate(inc);
        }
        json.companies = list_companies;
        json.rrgdata = list_rrgdata;
        console.log(JSON.stringify(json));
        return json;
      },
      getStaticJson: function(t) {
          var i = this;
          $.ajax({
              url: "example.json",
              type: "GET",
              dataType: "json",
              timeout: 5e3,
              error: function() {
                  console && console.log("error getting data from server")
              },
              success: function(e) {
                  results = i.parseJson(e);
                  t && t(results.benchmarkSymbol, results.benchmarkData, results.rrgSymbols, results.rrgData, results.companyInfo)
              }
          })
      },
      parseJson: function(t) {
          var i = {
              benchmarkSymbol: null,
              benchmarkData: [],
              rrgSymbols: [],
              rrgData: {},
              companyInfo: {}
          };
          for (key in t)
              if ("rrgdata" == key) {
                  var e = t[key];
                  for (var s = 0; s < e.length; s++) {
                      var n = e[s];
                      var o = n.date;
                      var a = n.rrgdata;
                      for (key in a) {
                          var r = key.toUpperCase();
                          var h = a[key];
                          h.date = o;
                          0 == s && i.rrgSymbols.push(r);
                          var l = i.rrgData[r];
                          if (!l) {
                              l = [];
                              i.rrgData[r] = l
                          }
                          l.push(h)
                      }
                      for (key in n)
                          if ("rrgdata" != key && "date" != key) {
                              var r = key.toUpperCase();
                              var u = n[key];
                              i.benchmarkSymbol || (i.benchmarkSymbol = r);
                              i.benchmarkData.push({
                                  date: o,
                                  price: u
                              })
                          }
                  }
              } else "companies" == key && (i.companyInfo = t[key]);
          return i
      }
  };
  var util = {
      getCookie: function(t) {
          var i = null;
          var e = document.cookie.replace(/\s/g, "").split(";");
          for (var s = 0; s < e.length; s++) {
              var n = e[s].split("=");
              if (t.toLowerCase() == n[0].toLowerCase()) {
                  i = n[1];
                  break
              }
          }
          return i
      },
      isFree: function() {
          return !this.isMember()
      },
      isMember: function() {
          return null != this.getCookie("SCCLogin2") && this.getCookie("SCCLogin2").length > 0
      },
      isPro: function() {
          var t = this.getCookie("SCCLogin2");
          return t && "O" == t.substring(t.length - 1)
      },
      extend: function(t, i) {
          t = t || {};
          for (var e in i) t[e] = "object" == typeof i[e] ? extend(t[e], i[e]) : i[e];
          return t
      }
  };
  var RrgChart = function(t, i) {
      this.init(t, i)
  };
  RrgChart.prototype = {
      init: function(t, i) {
          this.settings = $.extend({
              benchmarkSymbol: null,
              benchmarkData: null,
              rrgData: null,
              width: 800,
              height: 600,
              tailLength: 10,
              endTailDate: null,
              gridBounds: null,
              fontSize: 10,
              colorFill: "#fafacc",
              colorBorder: "#000000",
              gridColorFill: "#fafafa",
              gridColorBorder: "#000000",
              gridColorLines: "#dddddd",
              gridMargin: {
                  top: 10,
                  right: 13,
                  bottom: 34,
                  left: 56
              },
              hilitedSymbol: null,
              hiddenSymbols: null,
              isCentered: !1,
              minWidth: 800,
              minHeight: 600,
              onZoom: function() {},
              onPan: function() {},
              onChangeTailLength: function() {},
              onChangeEndTailDate: function() {}
          }, i || {});
          // this.width = this.settings.width;
          // this.height = this.settings.height;
          this.width = 1000;
          this.height = 500;
          console.log(this.width + ' x ' + this.height);
          this.$canvas = $("<canvas width='" + this.width + "' height='" + this.height + "'></canvas>").css("-webkit-user-select", "none");
          this.canvas = this.$canvas[0];
          this.ctx = this.canvas.getContext("2d");
          this.bounds = new Rectangle(0, 0, this.width, this.height);
          this.$elem = t instanceof jQuery ? t : $(t);
          this.$elem.empty().append(this.canvas);
          this.messages = new Messages;
          this.benchmarkSeries = new TimeSeries(this.settings.benchmarkSymbol, this.settings.benchmarkData);
          this.seriesCollection = new TimeSeriesCollection;
          for (var e in this.settings.rrgData) {
              var s = this.settings.rrgData[e];
              var n = s[s.length - 1].jdkratio;
              var o = s[s.length - 1].jdkmom;
              null != n && null != o && this.seriesCollection.push(new TimeSeries(e, s))
          }
          this.isPainting = !1;
          this.isInitialized = !1;
          this.mouse = {
              x: 0,
              y: 0
          };
          this.isTrackingMouse = !1;
          this.isHovered = !1;
          this.hiddenSymbols = this.settings.hiddenSymbols ? this.settings.hiddenSymbols.toUpperCase().split(",") : [];
          this.hilitedSymbol = this.settings.hilitedSymbol;
          var a = this;
          this.$canvas.on("mousedown", function(t) {
              a.onMouseDown(t)
          }).on("mouseover", function() {
              a.onMouseOver()
          }).on("mouseout", function() {
              a.onMouseOut()
          }).on("touchstart", function(t) {
              a.onTouchStart(t)
          }).on("touchend", function(t) {
              a.onTouchEnd(t)
          }).on("touchmove", function(t) {
              a.onTouchMove(t)
          });
          this.graph = new RrgChartAxes(this, {
              benchmarkSeries: this.benchmarkSeries,
              seriesCollection: this.seriesCollection,
              fontSize: this.settings.fontSize,
              tailLength: this.settings.tailLength,
              gridBounds: this.settings.gridBounds,
              endTailDate: this.settings.endTailDate,
              margin: this.settings.gridMargin,
              colorFill: this.settings.gridColorFill,
              colorBorder: this.settings.gridColorBorder,
              colorLines: this.settings.gridColorLines,
              isCentered: this.settings.isCentered,
              messages: this.messages
          });
          this.paint();
          this.isInitialized = !0
      },
      paint: function() {
          if (!this.isPainting) {
              this.isPainting = !0;
              this.ctx.clearRect(0, 0, this.width, this.height);
              this.bounds.paint(this.ctx, this.settings.colorFill, this.settings.colorBorder);
              this.graph.paint();
              this.isPainting = !1
          }
      },
      isTouchDevice: function() {
          return "ontouchstart" in window
      },
      onMouseOver: function() {
          this.isHovered = !0;
          this.isTrackingMouse || this.startTrackingMouse();
          this.messages.send("mouseover")
      },
      onMouseOut: function() {
          this.isHovered = !1;
          this.isTrackingMouse && this.stopTrackingMouse();
          this.messages.send("mouseout")
      },
      onMouseMove: function(t) {
          var i = this.mouse;
          this.mouse = this.globalToLocal({
              x: t.pageX,
              y: t.pageY
          });
          this.messages.send("mousemove", i, this.mouse)
      },
      onMouseDown: function(t) {
          this.mouse = this.globalToLocal({
              x: t.pageX,
              y: t.pageY
          });
          var i = this;
          $(document.body).on("mouseup.rrgchart", function() {
              i.onMouseUp()
          });
          this.messages.send("mousedown", this.mouse)
      },
      onMouseUp: function() {
          this.isHovered || this.stopTrackingMouse();
          $(document.body).off("mouseup.rrgchart");
          this.messages.send("mouseup")
      },
      onTouchStart: function(t) {
          t = t.originalEvent;
          this.mouse = this.globalToLocal({
              x: t.targetTouches[0].pageX,
              y: t.targetTouches[0].pageY
          });
          this.messages.send("mousedown", this.mouse)
      },
      onTouchEnd: function() {
          this.messages.send("mouseup")
      },
      onTouchMove: function(t) {
          t.preventDefault();
          t = t.originalEvent;
          var i = this.mouse;
          this.mouse = this.globalToLocal({
              x: t.changedTouches[0].pageX,
              y: t.changedTouches[0].pageY
          });
          this.messages.send("mousemove", i, this.mouse)
      },
      startTrackingMouse: function() {
          var t = this;
          if (!this.isTrackingMouse) {
              $(document.body).on("mousemove.rrgchart", function(i) {
                  t.onMouseMove(i)
              });
              this.isTrackingMouse = !0
          }
      },
      stopTrackingMouse: function() {
          $(document.body).off("mousemove.rrgchart");
          this.isTrackingMouse = !1
      },
      globalToLocal: function(t) {
          return {
              x: t.x - this.$canvas.offset().left,
              y: t.y - this.$canvas.offset().top
          }
      },
      localToGlobal: function(t) {
          return {
              x: t.x + this.$canvas.offset().left,
              y: t.y + this.$canvas.offset().top
          }
      },
      getStartTimeStamp: function() {
          return this.graph.getStartTimeStamp()
      },
      getEndTimeStamp: function() {
          return this.graph.getEndTimeStamp()
      },
      getStartTailTimeStamp: function() {
          return this.graph.getStartTailTimeStamp()
      },
      getEndTailTimeStamp: function() {
          return this.graph.getEndTailTimeStamp()
      },
      isEndTailTimeStampToday: function() {
          return this.graph.isEndTailTimeStampToday()
      },
      getTailLength: function() {
          return this.settings.tailLength
      },
      getDataDump: function() {
          return this.graph.getDataDump()
      },
      getValueBounds: function() {
          return this.graph.getValueBounds()
      },
      isCentered: function() {
          return this.graph.settings.isCentered
      },
      getWidth: function() {
          return this.width
      },
      getHeight: function() {
          return this.height
      },
      setTailLength: function(t) {
          var i = this.graph.setTailLength(t);
          if (i) {
              this.paint();
              this.isInitialized && this.settings.onChangeTailLength(this.graph.getDataDump(), this.graph.getTailLength())
          }
      },
      setEndTailDate: function(t) {
          var i = this.graph.setEndTailDate(t);
          if (i) {
              this.paint();
              this.isInitialized && this.settings.onChangeEndTailDate(this.graph.getDataDump(), this.graph.getEndTailTimeStamp())
          }
      },
      zoom: function(t) {
          "ctr" == t && (this.graph.settings.isCentered = !this.graph.settings.isCentered);
          this.graph.zoom(t);
          this.paint();
          this.isInitialized && this.settings.onZoom(this.graph.settings.isCentered)
      },
      hideSymbol: function(t) {
          this.hiddenSymbols.push(t.toUpperCase());
          this.paint()
      },
      showSymbol: function(t) {
          var i = [];
          for (var e = 0; e < this.hiddenSymbols.length; e++) this.hiddenSymbols[e] != t.toUpperCase() && i.push(this.hiddenSymbols[e]);
          this.hiddenSymbols = i;
          this.paint()
      },
      hilite: function(t) {
          this.hilitedSymbol = t.toUpperCase();
          this.paint()
      },
      unHilite: function() {
          this.hilitedSymbol = null;
          this.paint()
      },
      isResizing: !1,
      resize: function(t) {
          if (!this.isResizing) {
              this.isResizing = !0;
              var i = Math.max(this.width + t.x, this.settings.minWidth);
              var e = Math.max(this.height + t.y, this.settings.minHeight);
              this.width = i;
              this.height = e;
              this.canvas.width = this.width;
              this.canvas.height = this.height;
              this.graph.resizeBounds();
              this.paint();
              this.isResizing = !1
          }
      },
      resetSize: function() {
          if (!this.isResizing) {
              this.isResizing = !0;
              this.width = this.settings.width;
              this.height = this.settings.height;
              this.canvas.width = this.width;
              this.canvas.height = this.height;
              this.graph.resizeBounds();
              this.paint();
              this.isResizing = !1
          }
      }
  };
  var RrgChartAxes = function(t, i) {
      this.init(t, i)
  };
  RrgChartAxes.prototype = {
      GREEN: {
          r: 0,
          g: 128,
          b: 0
      },
      BLUE: {
          r: 48,
          g: 68,
          b: 219
      },
      YELLOW: {
          r: 243,
          g: 195,
          b: 0
      },
      RED: {
          r: 255,
          g: 0,
          b: 0
      },
      init: function(t, i) {
          this.settings = $.extend({
              benchmarkSeries: null,
              seriesCollection: null,
              margin: {
                  top: 10,
                  right: 12,
                  bottom: 34,
                  left: 56
              },
              fontSize: 10,
              fontFamily: "Arial",
              tailLength: 10,
              gridBounds: null,
              endTailDate: null,
              colorFill: "lightgray",
              colorBorder: "black",
              colorLines: "gray",
              yLabels: "left",
              isCentered: !1,
              messages: null
          }, i || {});
          this.parent = t;
          this.canvas = t.canvas;
          this.ctx = t.ctx;
          this.messages = this.settings.messages;
          this.bounds = new Rectangle(this.settings.margin.left, this.settings.margin.top, this.parent.width - this.settings.margin.left - this.settings.margin.right, this.parent.height - this.settings.margin.top - this.settings.margin.bottom);
          this.grid = new Grid({
              top: this.settings.margin.top,
              right: this.parent.width - this.settings.margin.right,
              bottom: this.parent.height - this.settings.margin.bottom,
              left: this.settings.margin.left
          });
          this.startTailIndex = null;
          this.endTailIndex = null;
          this.setEndTailDate(this.settings.endTailDate);
          if (this.settings.gridBounds) {
              var e = this.settings.gridBounds.split(",");
              var s = {
                  left: +e[0],
                  right: +e[1],
                  bottom: +e[2],
                  top: +e[3]
              };
              this.zoom(s)
          } else this.zoom(this.settings.isCentered ? "ctr" : "fit");
          this.isMouseDown = !1;
          this.mouseDownPixel = null;
          this.cursorStyle = "default";
          this.messages.receive("mousemove", this.onMouseMove, this);
          this.messages.receive("mousedown", this.onMouseDown, this);
          this.messages.receive("mouseup", this.onMouseUp, this);
          this.font = this.settings.fontSize + "px " + this.settings.fontFamily;
          this.ctx.font = this.font;
          this.ctx.lineJoin = "round"
      },
      resizeBounds: function() {
          this.bounds = new Rectangle(this.settings.margin.left, this.settings.margin.top, this.parent.width - this.settings.margin.left - this.settings.margin.right, this.parent.height - this.settings.margin.top - this.settings.margin.bottom);
          this.grid.setPixels({
              top: this.settings.margin.top,
              right: this.parent.width - this.settings.margin.right,
              bottom: this.parent.height - this.settings.margin.bottom,
              left: this.settings.margin.left
          })
      },
      onMouseMove: function(t, i) {
          this.bounds.contains(i) ? this.isMouseDown ? this.pan({
              x: i.x - t.x,
              y: i.y - t.y
          }) : this.setCursor("grab") : this.setCursor("default")
      },
      onMouseDown: function(t) {
          if (this.bounds.contains(t)) {
              this.isMouseDown = !0;
              this.mouseDownPixel = {
                  x: t.x,
                  y: t.y
              };
              this.setCursor("grabbing");
              this.parent.paint()
          }
      },
      onMouseUp: function() {
          this.isMouseDown = !1;
          this.mouseDownPixel = null;
          this.setCursor("default");
          this.parent.paint()
      },
      setCursor: function(t) {
          if (t != this.cursorStyle) {
              this.cursorStyle = t;
              if (0 == t.indexOf("grab")) {
                  this.parent.$canvas.css("cursor", "-moz-" + t);
                  this.parent.$canvas.css("cursor", "-webkit-" + t)
              } else this.parent.$canvas.css("cursor", t)
          }
      },
      pan: function(t) {
          this.settings.isCentered = !1;
          this.grid.translate(t);
          this.parent.paint();
          this.parent.isInitialized && this.parent.settings.onPan()
      },
      zoom: function(t) {
          "ctr" != t && (this.settings.isCentered = !1);
          if ("string" == typeof t) {
              if ("fit" == t) {
                  var i = this.settings.seriesCollection.getMinMaxInRange(this.startTailIndex, this.endTailIndex, "jdkratio", this.parent.hiddenSymbols);
                  var e = this.settings.seriesCollection.getMinMaxInRange(this.startTailIndex, this.endTailIndex, "jdkmom", this.parent.hiddenSymbols)
              } else if ("ctr" == t) {
                  var i = this.settings.seriesCollection.getMinMaxInRange(this.startTailIndex, this.endTailIndex, "jdkratio", this.parent.hiddenSymbols);
                  var e = this.settings.seriesCollection.getMinMaxInRange(this.startTailIndex, this.endTailIndex, "jdkmom", this.parent.hiddenSymbols);
                  if (!this.hasNullValues(i) && !this.hasNullValues(e)) {
                      var s = Math.max(100 - i.min, i.max - 100);
                      var n = Math.max(100 - e.min, e.max - 100);
                      i = {
                          min: 100 - s,
                          max: 100 + s
                      };
                      e = {
                          min: 100 - n,
                          max: 100 + n
                      }
                  }
              } else {
                  var i = this.settings.seriesCollection.getMinMax("jdkratio", this.parent.hiddenSymbols);
                  var e = this.settings.seriesCollection.getMinMax("jdkmom", this.parent.hiddenSymbols)
              }
              var o = this.hasNullValues(i) || this.hasNullValues(e) ? {
                  left: 99,
                  right: 101,
                  bottom: 99,
                  top: 101
              } : {
                  left: i.min,
                  right: i.max,
                  bottom: e.min,
                  top: e.max
              };
              this.grid.setValues(o).zoom(1.05)
          } else if ("object" == typeof t) {
              var o = t;
              this.grid.setValues(o)
          } else {
              var a = t;
              this.grid.zoom(a)
          }
      },
      hasNullValues: function(t) {
          var i = !1;
          for (var e in t)
              if (null == t[e]) {
                  i = !0;
                  break
              }
          return i
      },
      getBenchmarkSeries: function() {
          return this.settings.benchmarkSeries
      },
      paint: function() {
          this.settings.isCentered && this.zoom("ctr");
          this.bounds.clear(this.ctx);
          this.bounds.paint(this.ctx, this.settings.colorFill, this.settings.colorBorder);
          this.paintQuadrants();
          this.paintGrid();
          this.paintSeries()
      },
      isNull: function(t) {
          return null == t || "undefined" == typeof t || isNaN(parseFloat(t))
      },
      paintQuadrants: function() {
          this.ctx.save();
          this.clip();
          var t = this.grid.valueToPixel({
              x: 100,
              y: 100
          });
          var i = t.x < this.bounds.right && t.y > this.bounds.top;
          var e = t.x < this.bounds.right && t.y < this.bounds.bottom;
          var s = t.x > this.bounds.left && t.y < this.bounds.bottom;
          var n = t.x > this.bounds.left && t.y > this.bounds.top;
          i && new Rectangle(t.x, this.bounds.top, this.bounds.right - t.x, t.y - this.bounds.top).paint(this.ctx, this.getColor(this.GREEN, .05), null);
          e && new Rectangle(t.x, t.y, this.bounds.right - t.x, this.bounds.bottom - t.y).paint(this.ctx, this.getColor(this.YELLOW, .05), null);
          s && new Rectangle(this.bounds.left, t.y, t.x - this.bounds.left, this.bounds.bottom - t.y).paint(this.ctx, this.getColor(this.RED, .05), null);
          n && new Rectangle(this.bounds.left, this.bounds.top, t.x - this.bounds.left, t.y - this.bounds.top).paint(this.ctx, this.getColor(this.BLUE, .05), null);
          var o = 14;
          this.ctx.font = "bold " + o + "px Arial";
          if (i) {
              var a = "Leading";
              var r = this.ctx.measureText(a).width;
              var h = {
                  x: this.bounds.right - r - 1,
                  y: this.bounds.top + o
              };
              this.ctx.fillStyle = this.getColor(this.GREEN, .5);
              this.ctx.fillText(a, h.x, h.y)
          }
          if (e) {
              a = "Weakening";
              r = this.ctx.measureText(a).width;
              h = {
                  x: this.bounds.right - r - 1,
                  y: this.bounds.bottom - 4
              };
              this.ctx.fillStyle = this.getColor(this.YELLOW, .75);
              this.ctx.fillText(a, h.x, h.y)
          }
          if (n) {
              a = "Improving";
              h = {
                  x: this.bounds.left + 2,
                  y: this.bounds.top + o
              };
              this.ctx.fillStyle = this.getColor(this.BLUE, .5);
              this.ctx.fillText(a, h.x, h.y)
          }
          if (s) {
              a = "Lagging";
              h = {
                  x: this.bounds.left + 2,
                  y: this.bounds.bottom - 4
              };
              this.ctx.fillStyle = this.getColor(this.RED, .4);
              this.ctx.fillText(a, h.x, h.y)
          }
          this.ctx.restore()
      },
      paintGrid: function() {
          this.ctx.save();
          var t = this.settings.fontSize;
          var i = "JdK RS-Ratio";
          var e = this.ctx.measureText(i).width;
          var s = {
              x: (this.bounds.left + this.bounds.right) / 2 - e / 2,
              y: this.bounds.bottom + t + 2 * this.settings.fontSize + 1
          };
          this.ctx.fillText(i, s.x, s.y);
          this.ctx.save();
          i = "JdK RS-Momentum";
          e = this.ctx.measureText(i).width;
          var n = this.ctx.measureText("100.00").width + t;
          this.ctx.translate(this.bounds.left - n - 4, (this.bounds.top + this.bounds.bottom) / 2 + e / 2);
          this.ctx.rotate(-Math.PI / 2);
          this.ctx.fillText(i, 0, 0);
          this.ctx.restore();
          this.grid.yFloorToCeiling(function(i, e) {
              if (!(i <= this.bounds.top || i >= this.bounds.bottom)) {
                  new Path(this.ctx).moveTo(this.bounds.left, i).lineTo(this.bounds.right, i).stroke(this.settings.colorLines);
                  var s = e.toFixed(2);
                  var n = this.ctx.measureText(s).width;
                  this.ctx.fillStyle = this.settings.colorBorder;
                  "right" == this.settings.yLabels ? this.ctx.fillText(s, this.bounds.right + 2 + t, i + this.settings.fontSize / 2 - 1) : this.ctx.fillText(s, this.bounds.left - t - n - 2, i + this.settings.fontSize / 2 - 2)
              }
          }, this);
          this.grid.xFloorToCeiling(function(i, e) {
              if (!(i <= this.bounds.left || i >= this.bounds.right)) {
                  new Path(this.ctx).moveTo(i, this.bounds.top).lineTo(i, this.bounds.bottom).stroke(this.settings.colorLines);
                  var s = e.toFixed(2);
                  var n = this.ctx.measureText(s).width;
                  this.ctx.fillStyle = this.settings.colorBorder;
                  this.ctx.fillText(s, i - n / 2, this.bounds.bottom + t + this.settings.fontSize)
              }
          }, this);
          this.bounds.paint(this.ctx, null, this.settings.colorBorder);
          var s = this.grid.valueToPixel({
              x: 100,
              y: 100
          });
          s.x > this.bounds.left && s.x < this.bounds.right && new Path(this.ctx).moveTo(s.x, this.bounds.top).lineTo(s.x, this.bounds.bottom).stroke(this.settings.colorBorder);
          s.y > this.bounds.top && s.y < this.bounds.bottom && new Path(this.ctx).moveTo(this.bounds.left, s.y).lineTo(this.bounds.right, s.y).stroke(this.settings.colorBorder);
          this.ctx.restore()
      },
      clip: function() {
          this.ctx.rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
          this.ctx.clip()
      },
      isVisibleSeries: function(t) {
          return !this.isHiddenSeries(t)
      },
      isHiddenSeries: function(t) {
          var i = t.getId();
          return -1 != this.parent.hiddenSymbols.indexOf(i)
      },
      hasHilitedSymbol: function() {
          return null != this.parent.hilitedSymbol
      },
      isHilitedSymbol: function(t) {
          return this.parent.hilitedSymbol && t.toUpperCase() == this.parent.hilitedSymbol.toUpperCase()
      },
      paintSeries: function() {
          this.ctx.save();
          this.clip();
          var t = [];
          this.settings.seriesCollection.each(function(i, e) {
              if (!this.isHiddenSeries(e)) {
                  var s = new RrgChartTail(this.ctx);
                  e.traverseRange(this.startTailIndex, this.endTailIndex, function(t, i) {
                      var e = i.jdkratio;
                      var n = i.jdkmom;
                      if (e && n) {
                          var o = this.grid.valueToPixel({
                              x: e,
                              y: n
                          });
                          s.add(o.x, o.y)
                      }
                  }, this);
                  this.ctx.lineWidth = this.getSeriesThickness(e);
                  var n = this.getSeriesColor(e);
                  var o = this.hasHilitedSymbol() && !this.isHilitedSymbol(e.getId()) ? .1 : 1;
                  if (s.size() > 0) {
                      s.paint(n.r, n.g, n.b, o);
                      t.push(s);
                      var a = e.getId();
                      var r = this.ctx.measureText(a).width;
                      var h = {
                          x: e.get(this.endTailIndex, "jdkratio"),
                          y: e.get(this.endTailIndex, "jdkmom")
                      };
                      var l = this.grid.valueToPixel(h);
                      this.ctx.fillStyle = "black";
                      var u = l.x + 7;
                      var g = l.y + this.settings.fontSize / 2 - 1.5;
                      var c = u + r > this.bounds.right;
                      c && (u -= 14 + r);
                      u + r > this.bounds.right && (u = this.bounds.right - r - 1);
                      u < this.bounds.left + 2 && (u = this.bounds.left + 2);
                      g < this.bounds.top - 1 && (g = this.bounds.top - 1);
                      if (g > this.bounds.bottom + this.settings.fontSize) {
                          g = this.bounds.bottom + this.settings.fontSize;
                          this.ctx.fillStyle = null != this.parent.settings.colorFill ? this.parent.settings.colorFill : "#eeeeee";
                          this.ctx.fillRect(u, g - this.settings.fontSize + 1, r, this.settings.fontSize)
                      }
                      o = this.hasHilitedSymbol() && !this.isHilitedSymbol(e.getId()) ? .1 : 1;
                      this.ctx.font = this.hasHilitedSymbol() && this.isHilitedSymbol(e.getId()) ? "bold " + this.font : this.font;
                      this.ctx.fillStyle = "rgba(0,0,0," + o + ")";
                      this.ctx.fillText(a, u, g)
                  }
              }
          }, this);
          this.ctx.restore();
          this.ctx.save();
          for (var i = 0; i < t.length; i++) {
              var e = t[i].getHead();
              var s = t[i].headRadius;
              var n = e.x > this.bounds.right - s - 1 || e.x < this.bounds.left + s + 1 || e.y > this.bounds.bottom - s - 1 || e.y < this.bounds.top + s + 1;
              e.x > this.bounds.right + s + 1 && (e.x = this.bounds.right + s + 1);
              e.x < this.bounds.left - s && (e.x = this.bounds.left - s);
              e.y > this.bounds.bottom + s + 1 && (e.y = this.bounds.bottom + s + 1);
              e.y < this.bounds.top - s && (e.y = this.bounds.top - s);
              if (n) {
                  this.ctx.beginPath();
                  this.ctx.arc(e.x, e.y, s, 0, 2 * Math.PI, !1);
                  this.ctx.fillStyle = t[i].getColor();
                  this.ctx.fill();
                  this.ctx.strokeStyle = "rgba(0,0,0," + t[i].alpha + ")";
                  this.ctx.stroke()
              }
          }
          this.ctx.restore()
      },
      getSeriesColor: function(t) {
          var i = t.get(this.endTailIndex, "jdkratio");
          var e = t.get(this.endTailIndex, "jdkmom");
          if (!i || !e) return {
              r: 0,
              g: 0,
              b: 0
          };
          var s = i - 100;
          var n = e - 100;
          var o = 0;
          o = s >= 0 ? n >= 0 ? Math.atan(n / s) * (180 / Math.PI) : 360 - Math.atan(-n / s) * (180 / Math.PI) : e >= 100 ? 180 - Math.atan(-n / s) * (180 / Math.PI) : 180 + Math.atan(n / s) * (180 / Math.PI);
          return o >= 0 && 90 > o ? this.GREEN : o >= 90 && 180 > o ? this.BLUE : o >= 180 && 270 > o ? this.RED : o >= 270 && 360 > o ? this.YELLOW : {
              r: 0,
              g: 0,
              b: 0
          }
      },
      getSeriesThickness: function(t) {
          var i = t.get(this.endTailIndex, "jdkratio");
          var e = t.get(this.endTailIndex, "jdkmom");
          if (!i || !e) return 1;
          var s = Math.sqrt(Math.pow(i - 100, 2) + Math.pow(e - 100, 2));
          var n = 1.5 * s;
          .5 > n && (n = .5);
          n > 4.5 && (n = 4.5);
          return n
      },
      getColor: function(t, i) {
          return "rgba(" + t.r + "," + t.g + "," + t.b + "," + i + ")"
      },
      getStartTimeStamp: function() {
          return this.getBenchmarkSeries().getStartTimeStamp()
      },
      getEndTimeStamp: function() {
          return this.getBenchmarkSeries().getEndTimeStamp()
      },
      getStartTailTimeStamp: function() {
          return this.getBenchmarkSeries().timestamps[this.startTailIndex]
      },
      getEndTailTimeStamp: function() {
          return this.getBenchmarkSeries().timestamps[this.endTailIndex]
      },
      isEndTailTimeStampToday: function() {
          return this.endTailIndex == this.getBenchmarkSeries().length - 1
      },
      getTailLength: function() {
          return this.settings.tailLength
      },
      getDataDump: function() {
          var t = this.getBenchmarkSeries().timestamps[this.startTailIndex];
          var i = this.getBenchmarkSeries().timestamps[this.endTailIndex];
          var e = [];
          var s = this.getBenchmarkSeries();
          var n = {
              symbol: s.getId(),
              timestampStart: t,
              timestampEnd: i,
              priceStart: s.get(this.startTailIndex, "price"),
              priceEnd: s.get(this.endTailIndex, "price")
          };
          e.push(n);
          this.settings.seriesCollection.each(function(s, n) {
              var o = n.get(this.endTailIndex, "jdkratio");
              var a = n.get(this.endTailIndex, "jdkmom");
              var r = n.get(this.startTailIndex, "price");
              var h = n.get(this.endTailIndex, "price");
              // if(isNaN(priceStart) && this.startTailIndex!=0) {
              var l = !this.isNull(o) && !this.isNull(a);
              if (l) {
                  var u = {
                      symbol: n.getId(),
                      timestampStart: t,
                      timestampEnd: i,
                      priceStart: r,
                      priceEnd: h,
                      jdkRatioEnd: o,
                      jdkMomentumEnd: a
                  };
                  e.push(u)
              }
          }, this);
          return e
      },
      getValueBounds: function() {
          return {
              left: this.grid.x.value.min.toFixed(2),
              right: this.grid.x.value.max.toFixed(2),
              bottom: this.grid.y.value.min.toFixed(2),
              top: this.grid.y.value.max.toFixed(2)
          }
      },
      setTailLength: function(t) {
          if (t != this.settings.tailLength) {
              this.settings.tailLength = t;
              this.setEndTailIndex(this.endTailIndex);
              return !0
          }
          return !1
      },
      setEndTailDate: function(t) {
          var i = t ? this.getBenchmarkSeries().getIndexFromDate(t) : null;
          this.setEndTailIndex(i);
          return !0
      },
      setEndTailIndex: function(t) {
          null == t && (t = this.getBenchmarkSeries().length - 1);
          this.endTailIndex = t;
          this.startTailIndex = this.endTailIndex - this.settings.tailLength;
          this.startTailIndex < 0 && (this.startTailIndex = 0)
      }
  };
  var RrgChartTail = function(t) {
      this.init(t)
  };
  RrgChartTail.prototype = {
      init: function(t) {
          this.ctx = t;
          this.points = [];
          this.headRadius = 4.5;
          this.red = 0;
          this.green = 0;
          this.blue = 0;
          this.alpha = 1
      },
      getHead: function() {
          return this.points[this.points.length - 1]
      },
      add: function(t, i) {
          null != t && null != i && this.points.push({
              x: Math.round(t) + .5,
              y: Math.round(i) + .5
          });
          return this
      },
      clear: function() {
          this.points = [];
          return this
      },
      size: function() {
          return this.points.length
      },
      paint: function(t, i, e, s) {
          this.red = t;
          this.green = i;
          this.blue = e;
          this.alpha = s;
          this.ctx.save();
          if (this.points.length > 1) {
              this.ctx.beginPath();
              for (var n = 0; n < this.points.length - 2; n++)
                  if (0 == n) this.ctx.moveTo(this.points[0].x, this.points[0].y);
                  else {
                      var o = (this.points[n].x + this.points[n + 1].x) / 2;
                      var a = (this.points[n].y + this.points[n + 1].y) / 2;
                      this.ctx.quadraticCurveTo(this.points[n].x, this.points[n].y, o, a)
                  }
              this.ctx.quadraticCurveTo(this.points[n].x, this.points[n].y, this.points[n + 1].x, this.points[n + 1].y);
              this.ctx.strokeStyle = "rgba(" + t + "," + i + "," + e + "," + s + ")";
              this.ctx.stroke();
              this.ctx.closePath()
          }
          this.ctx.lineWidth = 1;
          for (var n = 0; n < this.points.length; n++) {
              this.ctx.beginPath();
              var r = n < this.points.length - 1 ? 2 : this.headRadius;
              this.ctx.arc(this.points[n].x, this.points[n].y, r, 0, 2 * Math.PI, !1);
              if (n == this.points.length - 1) {
                  this.ctx.fillStyle = "rgba(" + t + "," + i + "," + e + "," + s + ")";
                  this.ctx.fill();
                  this.ctx.strokeStyle = "rgba(0,0,0," + s + ")";
                  this.ctx.stroke()
              } else {
                  this.ctx.fillStyle = "rgba(255,255,255," + s + ")";
                  this.ctx.fill();
                  this.ctx.strokeStyle = "rgba(" + t + "," + i + "," + e + "," + s + ")";
                  this.ctx.stroke()
              }
              this.ctx.stroke();
              this.ctx.closePath()
          }
          this.ctx.restore();
          return this
      },
      getColor: function() {
          return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")"
      }
  };
  var LineChart = function(t, i) {
      this.init(t, i)
  };
  LineChart.prototype = {
      init: function(t, i) {
          this.settings = $.extend({
              series: null,
              symbol: null,
              data: null,
              width: 480,
              height: 360,
              tailLength: 10,
              endTailDate: null,
              fontSize: 10,
              pageColorFill: "#fafacc",
              pageColorBorder: "#000000",
              gridColorFill: "#fafafa",
              gridColorBorder: "#000000",
              gridColorLines: "#bbbbbb",
              gridColorSeries: "#111111",
              gridMargin: {
                  top: 10,
                  right: 45,
                  bottom: 20,
                  left: 10
              },
              showVerticalScale: !0,
              showHorizontalScale: !0,
              useArrowsKeys: !1,
              onInit: function() {},
              onChange: function() {}
          }, i || {});
          this.isInitializing = !0;
          this.$canvas = $("<canvas width='" + this.settings.width + "' height='" + this.settings.height + "'></canvas>").css("-webkit-user-select", "none");
          this.canvas = this.$canvas[0];
          this.ctx = this.canvas.getContext("2d");
          this.width = this.settings.width;
          this.height = this.settings.height;
          this.bounds = new Rectangle(0, 0, this.width, this.height);
          this.$elem = t instanceof jQuery ? t : $(t);
          this.$elem.empty().append(this.canvas);
          this.messages = new Messages;
          this.mouse = {
              x: 0,
              y: 0
          };
          this.isTrackingMouse = !1;
          this.isHovered = !1;
          this.lastKeyTyped = 0;
          this.TAB = 9;
          this.RETURN = 13;
          this.LEFT = 37;
          this.UP = 38;
          this.RIGHT = 39;
          this.DOWN = 40;
          var e = this;
          this.$canvas.on("mousedown", function(t) {
              e.onMouseDown(t)
          }).on("mouseover", function() {
              e.onMouseOver()
          }).on("mouseout", function() {
              e.onMouseOut()
          }).on("touchstart", function(t) {
              e.onTouchStart(t)
          }).on("touchend", function(t) {
              e.onTouchEnd(t)
          }).on("touchmove", function(t) {
              e.onTouchMove(t)
          });
          this.settings.useArrowKeys && $(document.body).on("keydown", function(t) {
              var i = $("input, textarea, select").is(":focus");
              i || e.onKeyDown(t)
          });
          this.messages.receive("change", this.onChange, this);
          this.timeseries = null != this.settings.series ? this.settings.series : new TimeSeries(this.settings.symbol, this.settings.data);
          this.graph = new LineChartAxes(this, {
              timeSeries: this.timeseries,
              tailLength: this.settings.tailLength,
              endTailDate: this.settings.endTailDate,
              margin: this.settings.gridMargin,
              colorFill: this.settings.gridColorFill,
              colorBorder: this.settings.gridColorBorder,
              colorLines: this.settings.gridColorLines,
              colorSeries: this.settings.gridColorSeries,
              showVerticalScale: this.settings.showVerticalScale,
              showHorizontalScale: this.settings.showHorizontalScale,
              messages: this.messages
          });
          this.isPainting = !1;
          this.paint();
          this.isInitializing = !1;
          this.settings.onInit(this.graph.getStartTailTimeStamp(), this.graph.getEndTailTimeStamp(), this.graph.getStartTailPrice(), this.graph.getEndTailPrice(), this.graph.getStartTailIndex(), this.graph.getEndTailIndex())
      },
      paint: function() {
          if (!this.isPainting) {
              this.isPainting = !0;
              this.ctx.clearRect(0, 0, this.width, this.height);
              this.bounds.paint(this.ctx, this.settings.pageColorFill, this.settings.pageColorBorder);
              this.graph.paint();
              this.isPainting = !1
          }
      },
      isTouchDevice: function() {
          return "ontouchstart" in window
      },
      onChange: function(t, i, e, s, n, o) {
          this.settings.onChange(t, i, e, s, n, o)
      },
      onMouseOver: function() {
          this.isHovered = !0;
          this.isTrackingMouse || this.startTrackingMouse();
          this.messages.send("mouseover")
      },
      onMouseOut: function() {
          this.isHovered = !1;
          this.isTrackingMouse && this.stopTrackingMouse();
          this.messages.send("mouseout")
      },
      onMouseMove: function(t) {
          var i = this.mouse;
          this.mouse = this.globalToLocal({
              x: t.pageX,
              y: t.pageY
          });
          this.messages.send("mousemove", i, this.mouse)
      },
      onMouseDown: function(t) {
          this.mouse = this.globalToLocal({
              x: t.pageX,
              y: t.pageY
          });
          var i = this;
          $(document.body).on("mouseup.linechart", function() {
              i.onMouseUp()
          });
          this.messages.send("mousedown", this.mouse)
      },
      onMouseUp: function() {
          this.isHovered || this.stopTrackingMouse();
          $(document.body).off("mouseup.linechart");
          this.messages.send("mouseup")
      },
      onTouchStart: function(t) {
          t = t.originalEvent;
          this.mouse = this.globalToLocal({
              x: t.targetTouches[0].pageX,
              y: t.targetTouches[0].pageY
          });
          this.messages.send("mousedown", this.mouse)
      },
      onTouchEnd: function() {
          this.messages.send("mouseup")
      },
      onTouchMove: function(t) {
          t.preventDefault();
          t = t.originalEvent;
          var i = this.mouse;
          this.mouse = this.globalToLocal({
              x: t.changedTouches[0].pageX,
              y: t.changedTouches[0].pageY
          });
          this.messages.send("mousemove", i, this.mouse)
      },
      onKeyDown: function(t) {
          var i = t.which;
          var e = i == this.LEFT;
          var s = i == this.RIGHT;
          e ? this.messages.send("leftarrow") : s && this.messages.send("rightarrow")
      },
      startTrackingMouse: function() {
          var t = this;
          if (!this.isTrackingMouse) {
              $(document.body).on("mousemove.linechart", function(i) {
                  t.onMouseMove(i)
              });
              this.isTrackingMouse = !0
          }
      },
      stopTrackingMouse: function() {
          $(document.body).off("mousemove.linechart");
          this.isTrackingMouse = !1
      },
      globalToLocal: function(t) {
          return {
              x: t.x - this.$canvas.offset().left,
              y: t.y - this.$canvas.offset().top
          }
      },
      localToGlobal: function(t) {
          return {
              x: t.x + this.$canvas.offset().left,
              y: t.y + this.$canvas.offset().top
          }
      },
      getTailLength: function() {
          return this.graph.getTailLength()
      },
      isTailAtEnd: function() {
          return this.graph.isTailAtEnd()
      },
      setTailLength: function(t) {
          var i = this.graph.setTailLength(t);
          i && this.paint();
          return i
      },
      setEndTailDate: function(t) {
          var i = this.graph.setEndTailDate(t);
          i && this.paint();
          return i
      },
      setEndTailIndex: function(t) {
          var i = this.graph.setEndTailIndex(t);
          i && this.paint();
          return i
      },
      moveTailToStart: function() {
          var t = this.graph.moveTailToStart();
          t && this.paint();
          return t
      },
      incrementDate: function() {
          var t = this.graph.incrementDate();
          t && this.paint();
          return t
      },
      decrementDate: function() {
          var t = this.graph.decrementDate();
          t && this.paint();
          return t
      },
      setSeries: function(t) {
          var i = this.graph.setSeries(t);
          i && this.paint();
          return i
      }
  };
  var LineChartAxes = function(t, i) {
      this.init(t, i)
  };
  LineChartAxes.prototype = {
      BLUE: {
          r: 48,
          g: 68,
          b: 219
      },
      BLACK: {
          r: 0,
          g: 0,
          b: 0
      },
      init: function(t, i) {
          this.settings = $.extend({
              timeSeries: null,
              margin: {
                  top: 10,
                  right: 45,
                  bottom: 20,
                  left: 10
              },
              tailLength: 10,
              endTailDate: null,
              fontSize: 10,
              fontFamily: "Arial",
              colorFill: "#eeeeee",
              colorBorder: "black",
              colorLines: "gray",
              colorSeries: "black",
              showVerticalScale: !0,
              showHorizontalScale: !0,
              messages: null
          }, i || {});
          this.parent = t;
          this.canvas = t.canvas;
          this.ctx = t.ctx;
          this.messages = this.settings.messages;
          this.bounds = new Rectangle(this.settings.margin.left, this.settings.margin.top, this.parent.width - this.settings.margin.left - this.settings.margin.right, this.parent.height - this.settings.margin.top - this.settings.margin.bottom);
          this.grid = new Grid({
              top: this.settings.margin.top,
              right: this.parent.width - this.settings.margin.right - 1,
              bottom: this.parent.height - this.settings.margin.bottom - 1,
              left: this.settings.margin.left,
              margin: {
                  top: 10,
                  right: 0,
                  bottom: 10,
                  left: 0
              }
          });
          var e = this.settings.timeSeries.getMinMax("price");
          var s = {
              left: this.settings.timeSeries.getStartTimeStamp().getMillis(),
              right: this.settings.timeSeries.getEndTimeStamp().getMillis(),
              bottom: e.min,
              top: e.max
          };
          this.grid.setValues(s);
          this.tailLength = +this.settings.tailLength;
          this.isMouseDown = !1;
          this.mouseDownPixel = null;
          this.mouseDownIndex = null;
          this.cursorStyle = "default";
          this.endTailIndex = null;
          this.startTailIndex = null;
          this.setEndTailDate(this.settings.endTailDate);
          this.messages.receive("mousemove", this.onMouseMove, this);
          this.messages.receive("mousedown", this.onMouseDown, this);
          this.messages.receive("mouseup", this.onMouseUp, this);
          this.messages.receive("leftarrow", this.onKeyLeft, this);
          this.messages.receive("rightarrow", this.onKeyRight, this);
          this.font = this.settings.fontSize + "px " + this.settings.fontFamily;
          this.ctx.font = this.font;
          this.ctx.lineJoin = "round"
      },
      paint: function() {
          this.bounds.clear(this.ctx);
          this.bounds.paint(this.ctx, this.settings.colorFill, this.settings.colorBorder);
          this.paintGrid();
          this.paintChartTitle();
          this.paintSeries();
          this.paintTail()
      },
      getColor: function(t, i) {
          return "rgba(" + t.r + "," + t.g + "," + t.b + "," + i + ")"
      },
      drawText: function(t, i, e, s) {
          this.ctx.fillStyle = s;
          this.ctx.fillText(t, i, e)
      },
      paintGrid: function() {
          this.ctx.save();
          var t = this.settings.timeSeries;
          this.grid.yFloorToCeiling(function(t, i) {
              if (!(t <= this.bounds.top || t >= this.bounds.bottom)) {
                  new Path(this.ctx).moveTo(this.bounds.left, t).lineTo(this.bounds.right, t).stroke(this.settings.colorLines);
                  if (this.settings.showVerticalScale) {
                      var e = i;
                      this.ctx.fillStyle = this.settings.colorBorder;
                      this.ctx.fillText(e, this.bounds.right + 1, t + this.settings.fontSize / 2 - 2)
                  }
              }
          }, this);
          var i = (t.getEndTimeStamp().getMillis() - t.getStartTimeStamp().getMillis()) / 315576e5;
          var e = this.bounds.w / i;
          var s = {
              year: t.getEndTimeStamp().getYear(),
              month: t.getEndTimeStamp().getMonth(),
              day: t.getEndTimeStamp().getDay()
          };
          t.traverse(function(t) {
              var i = {
                  year: t.getYear(),
                  month: t.getMonth(),
                  day: t.getDay()
              };
              3 > e ? i.year % 10 == 0 && i.year != s.year && this.paintDateLabel(t, "YY") : e >= 3 && 15 > e ? i.year % 5 == 0 && i.year != s.year && this.paintDateLabel(t, "YY") : e >= 15 && 25 > e ? 1 == i.month && i.year != s.year && this.paintDateLabel(t, "YY") : e >= 25 && 170 > e ? 1 == i.month && i.year != s.year && this.paintDateLabel(t, "YYYY") : e >= 170 && 270 > e ? (i.month - 1) % 3 == 0 && i.month != s.month && this.paintDateLabel(t, "MMM") : e >= 270 && 1700 > e ? i.month != s.month && this.paintDateLabel(t, "MMM") : e >= 1700 && 7100 > e ? (1 == i.day || (i.day - 1) % 5 == 0) && this.paintDateLabel(t, "D") : e >= 7100 && this.paintDateLabel(t, "D");
              s = {
                  year: i.year,
                  month: i.month,
                  day: i.day
              }
          }, this);
          this.bounds.paint(this.ctx, null, this.settings.colorBorder);
          this.ctx.restore()
      },
      paintChartTitle: function() {
          this.ctx.save();
          var t = 14;
          this.ctx.font = "bold " + t + "px arial";
          var i = this.settings.timeSeries.getId();
          var e = {
              x: this.bounds.left + 2,
              y: this.bounds.top + t
          };
          this.ctx.fillStyle = this.getColor(this.BLACK, .5);
          this.ctx.fillText(i, e.x, e.y);
          this.ctx.restore()
      },
      paintSeries: function() {
          this.ctx.save();
          this.ctx.lineWidth = 1.5;
          var t = this.settings.timeSeries;
          var i = new Path(this.ctx);
          var e = new Path(this.ctx);
          t.traverse(function(t, s) {
              var n = t.getMillis();
              var o = s.price;
              if (n && o) {
                  var a = this.grid.valueToPixel({
                      x: n,
                      y: o
                  });
                  i.lineTo(a.x, a.y);
                  e.lineTo(a.x, a.y)
              }
          }, this);
          i.stroke(this.settings.colorSeries);
          var s = this.grid.valueToPixel({
              x: this.settings.timeSeries.getEndTimeStamp().getMillis(),
              y: null
          });
          e.lineTo(s.x, this.bounds.bottom);
          s = this.grid.valueToPixel({
              x: this.settings.timeSeries.getStartTimeStamp().getMillis(),
              y: null
          });
          e.lineTo(s.x, this.bounds.bottom);
          e.fill("rgba(0,0,0,.1)");
          this.ctx.restore()
      },
      paintTail: function() {
          this.ctx.save();
          var t = this.settings.timeSeries;
          var i = t.timestamps[this.endTailIndex];
          var e = t.timestamps[this.startTailIndex];
          var s = t.rows[this.endTailIndex].price;
          var n = t.rows[this.startTailIndex].price;
          var o = this.grid.valueToPixel({
              x: t.timestamps[this.endTailIndex].getMillis(),
              y: t.rows[this.endTailIndex].price
          });
          var a = this.grid.valueToPixel({
              x: t.timestamps[this.startTailIndex].getMillis(),
              y: t.rows[this.startTailIndex].price
          });
          var r = this.getColor(this.BLUE, 1);
          this.settings.showVerticalScale && new Path(this.ctx).moveTo(this.bounds.left, o.y).lineTo(this.bounds.right, o.y).stroke(r);
          new Path(this.ctx).moveTo(a.x, this.bounds.top).lineTo(a.x, this.bounds.bottom).stroke(r);
          new Path(this.ctx).moveTo(o.x, this.bounds.top).lineTo(o.x, this.bounds.bottom).stroke(r);
          if (this.settings.showVerticalScale) {
              this.ctx.fillStyle = this.parent.settings.pageColorFill ? this.parent.settings.pageColorFill : "#fafafa";
              this.ctx.fillRect(this.bounds.right + 2, o.y - this.settings.fontSize / 2 + 1, this.settings.margin.right - 2, this.settings.fontSize + 2);
              this.ctx.fillStyle = r;
              this.ctx.fillText((+s).toFixed(2), this.bounds.right + 1, o.y + this.settings.fontSize / 2)
          }
          this.ctx.lineWidth = 2.5;
          var h = new Path(this.ctx);
          var l = new Path(this.ctx);
          t.traverseRange(this.startTailIndex, this.endTailIndex, function(t, i) {
              var e = t.getMillis();
              var s = i.price;
              if (e && s) {
                  var n = this.grid.valueToPixel({
                      x: e,
                      y: s
                  });
                  h.lineTo(n.x, n.y);
                  l.lineTo(n.x, n.y)
              }
          }, this);
          h.stroke(r);
          l.lineTo(o.x, this.bounds.bottom);
          l.lineTo(a.x, this.bounds.bottom);
          l.fill(this.getColor(this.BLUE, .1));
          this.ctx.restore();
          this.parent.isInitializing || this.messages.send("change", e, i, n, s, this.startTailIndex, this.endTailIndex)
      },
      paintDateLabel: function(t, i) {
          this.ctx.save();
          var e = this.grid.valueToPixel({
              x: t.getMillis(),
              y: null
          });
          new Path(this.ctx).moveTo(e.x, this.bounds.top).lineTo(e.x, this.bounds.bottom).stroke(this.settings.colorLines);
          if (this.settings.showHorizontalScale) {
              "MMM" == i && 1 == t.getMonth() ? i = "YYYY" : "D" != i && "DD" != i || 1 != t.getDay() || (i = "MMM");
              var s = t.format(i);
              var n = this.ctx.measureText(s).width;
              this.drawText(s, e.x - n / 2, this.bounds.bottom + this.settings.fontSize, this.settings.colorBorder)
          }
          this.ctx.restore()
      },
      seriesIndexToPixel: function(t) {
          var i = this.settings.timeSeries;
          var e = i.timestamps[t];
          var s = this.grid.valueToPixel({
              x: e.getMillis(),
              y: null
          });
          return s.x
      },
      pixelToSeriesIndex: function(t) {
          var i = this.settings.timeSeries;
          var e = this.grid.pixelToValue({
              x: t,
              y: null
          });
          var s = e.x;
          var n = i.getIndexFromMillis(s);
          return n
      },
      setCursor: function(t) {
          if (t != this.cursorStyle) {
              this.cursorStyle = t;
              if (0 == t.indexOf("grab")) {
                  this.parent.$canvas.css("cursor", "-moz-" + t);
                  this.parent.$canvas.css("cursor", "-webkit-" + t)
              } else this.parent.$canvas.css("cursor", t)
          }
      },
      onMouseMove: function(t, i) {
          if (this.bounds.contains(i))
              if (this.isMouseDown) {
                  var e = i.x - this.mouseDownPixel.x;
                  if (0 != e) {
                      var s = this.mouseDownIndex;
                      var n = this.seriesIndexToPixel(s);
                      var o = n + e;
                      var a = this.pixelToSeriesIndex(o);
                      a < this.tailLength && (a = this.tailLength);
                      if (a != this.endTailIndex) {
                          this.setEndTailIndex(a);
                          this.parent.paint()
                      }
                  }
              } else this.setCursor("grab");
          else this.setCursor("default")
      },
      onMouseDown: function(t) {
          if (this.bounds.contains(t)) {
              this.isMouseDown = !0;
              this.setCursor("grabbing");
              this.mouseDownPixel = {
                  x: t.x,
                  y: t.y
              };
              this.moveTailToPixel(this.mouseDownPixel);
              this.mouseDownIndex = this.endTailIndex;
              this.parent.paint()
          }
      },
      onMouseUp: function() {
          this.isMouseDown = !1;
          this.mouseDownPixel = null;
          this.mouseDownIndex = null;
          this.setCursor("default")
      },
      onKeyRight: function() {
          var t = this.incrementDate();
          t && this.parent.paint()
      },
      onKeyLeft: function() {
          var t = this.decrementDate();
          t && this.parent.paint()
      },
      getTailLength: function() {
          return this.tailLength
      },
      isTailAtEnd: function() {
          return this.endTailIndex == this.settings.timeSeries.length - 1
      },
      getStartTailTimeStamp: function() {
          var t = this.settings.timeSeries;
          return t.timestamps[this.startTailIndex]
      },
      getEndTailTimeStamp: function() {
          var t = this.settings.timeSeries;
          return t.timestamps[this.endTailIndex]
      },
      getStartTailPrice: function() {
          var t = this.settings.timeSeries;
          return t.rows[this.startTailIndex].price
      },
      getEndTailPrice: function() {
          var t = this.settings.timeSeries;
          return t.rows[this.endTailIndex].price
      },
      getStartTailIndex: function() {
          return this.startTailIndex
      },
      getEndTailIndex: function() {
          return this.endTailIndex
      },
      setTailLength: function(t) {
          if (t != this.tailLength) {
              this.tailLength = t;
              if (this.endTailIndex - t < 0) this.setEndTailIndex(t);
              else {
                  this.startTailIndex = this.endTailIndex - this.tailLength;
                  this.startTailIndex < 0 && (this.startTailIndex = 0)
              }
              return !0
          }
          return !1
      },
      setEndTailDate: function(t) {
          if (null == t) var i = this.settings.timeSeries.length - 1;
          else var i = this.settings.timeSeries.getIndexFromDate(t);
          if (i != this.endTailIndex) {
              this.setEndTailIndex(i);
              return !0
          }
          return !1
      },
      setEndTailIndex: function(t) {
          null == t && (t = this.settings.timeSeries.length - 1);
          if (t != this.endTailIndex) {
              this.endTailIndex = t;
              this.startTailIndex = this.endTailIndex - this.tailLength;
              this.startTailIndex < 0 && (this.startTailIndex = 0);
              return !0
          }
          return !1
      },
      moveTailToStart: function() {
          if (this.endTailIndex != this.tailLength) {
              this.setEndTailIndex(this.tailLength);
              return !0
          }
          return !1
      },
      moveTailToPixel: function(t) {
          var i = this.seriesIndexToPixel(this.startTailIndex);
          var e = this.seriesIndexToPixel(this.endTailIndex);
          var s = e - i;
          if (t.x >= i && t.x <= e);
          else {
              var n = t.x + s / 2;
              var o = this.pixelToSeriesIndex(n);
              var a = o - this.tailLength;
              if (0 > a) {
                  a = 0;
                  o = this.tailLength
              }
              this.setEndTailIndex(o)
          }
      },
      incrementDate: function() {
          if (this.endTailIndex == this.settings.timeSeries.length - 1) return !1;
          this.setEndTailIndex(this.endTailIndex + 1);
          return !0
      },
      decrementDate: function() {
          if (this.endTailIndex == this.tailLength) return !1;
          this.setEndTailIndex(this.endTailIndex - 1);
          return !0
      },
      setSeries: function(t) {
          this.settings.timeSeries = t;
          var i = this.settings.timeSeries.getMinMax("price");
          var e = {
              left: this.settings.timeSeries.getStartTimeStamp().getMillis(),
              right: this.settings.timeSeries.getEndTimeStamp().getMillis(),
              bottom: i.min,
              top: i.max
          };
          this.grid.setValues(e);
          return !0
      }
  };
  var SymbolGrid = function(t, i) {
      this.init(t, i)
  };
  SymbolGrid.prototype = {
      init: function(t, i) {
          this.settings = $.extend({
              companyInfo: [],
              data: [],
              period: null,
              tailLength: null,
              sortFlags: "tail,d",
              hilitedSymbol: null,
              hiddenSymbols: null,
              onHiliteSymbol: function() {},
              onUnHiliteSymbol: function() {},
              onShowSymbol: function() {},
              onHideSymbol: function() {},
              onChange: function() {}
          }, i || {});
          this.$elem = t instanceof jQuery ? t : $(t);
          this.lastKeyTyped = 0;
          this.TAB = 9;
          this.RETURN = 13;
          this.LEFT = 37;
          this.UP = 38;
          this.RIGHT = 39;
          this.DOWN = 40;
          this.benchmarkSymbol = null;
          this.hilitedSymbol = this.settings.hilitedSymbol;
          this.hiddenSymbols = this.settings.hiddenSymbols ? this.settings.hiddenSymbols.toUpperCase().split(",") : [];
          this.sortColumn = this.settings.sortFlags.split(",")[0];
          this.sortDirection = this.settings.sortFlags.split(",")[1];
          this.initRows(this.settings.data);
          this.sort();
          this.bindEvents();
          this.isPainting = !1;
          this.paint();
          this.isInitialized = !0;
          this.thumbnails = {}, this.preloadThumbnails(this.settings.data)
      },
      initRows: function(t) {
          this.rows = [];
          for (var i = 0; i < t.length; i++) {
              var e = {};
              var s = t[i].symbol.toUpperCase();
              var n = this.getCompanyInfo(s);
              var o = null == t[i].jdkRatioEnd && null == t[i].jdkMomentumEnd;
              var a = !o;
              var r = a && t[i].jdkRatioEnd < 100 && t[i].jdkMomentumEnd >= 100;
              var h = a && t[i].jdkRatioEnd >= 100 && t[i].jdkMomentumEnd >= 100;
              var l = a && t[i].jdkRatioEnd < 100 && t[i].jdkMomentumEnd < 100;
              var u = a && t[i].jdkRatioEnd >= 100 && t[i].jdkMomentumEnd < 100;
              e.jdkmag = a ? Math.sqrt(Math.pow(t[i].jdkRatioEnd - 100, 2) + Math.pow(t[i].jdkMomentumEnd - 100, 2)) : 0;
              e.symbol = s;
              e.name = n.name;
              e.sector = n.sector || "";
              e.industry = n.industry || "";
              e.price = t[i].priceEnd;
              e.chg = 100 * (t[i].priceEnd - t[i].priceStart) / t[i].priceStart;
              e.visible = !this.isHidden(s);
              e.tail = r ? "blue" : h ? "green" : u ? "yellow" : l ? "red" : "white";
              this.rows.push(e);
              !this.benchmarkSymbol && o && (this.benchmarkSymbol = s.toUpperCase())
          }
      },
      paint: function() {
          if (!this.isPainting) {
              this.isPainting = !0;
              this.$elem.empty();
              this.$elem.append(this.toTable());
              this.settings.onChange(this.sortColumn, this.sortDirection);
              this.isPainting = !1
          }
      },
      preloadThumbnails: function(t) {
          // for (var i = 0; i < t.length; i++) {
          //     var e = t[i].symbol.toUpperCase();
          //     var s = new Image;
          //     s.src = "http://stockcharts.com/c-sc/sc?chart=" + e + ",uu[300,a]dacayaci[pb20!b50!b200]&r=" + Math.random();
          //     this.thumbnails[e] = s
          // }
      },
      bindEvents: function() {
          var t = this;
          this.$elem.off();
          this.$elem.on("mouseover", ".row", function(i) {
              var e = $(this);
              var s = $(i.target).closest("td").attr("class");
              if ("visible" == s);
              else if ("chart" == s) {
                  if (0 == $(".hoverchart").size()) {
                      var n = e.find(".symbol").text();
                      var o = e.offset().left;
                      var a = e.offset().top;
                      $(t.thumbnails[n]).addClass("hoverchart").css({
                          position: "absolute",
                          left: o + 20,
                          top: a - 180,
                          zIndex: 999,
                          border: "1px solid gray",
                          boxShadow: "0px 0px 15px gray"
                      }).appendTo(document.body)
                  }
              } else {
                  var r = e.find(".visible [type=checkbox]").is(":checked");
                  r && e.addClass("hovered")
              }
          }).on("mouseleave", ".row", function() {
              var t = $(this);
              t.removeClass("hovered");
              $(".hoverchart").remove()
          }).on("click", ".row", function(i) {
              var e = $(i.target).closest("td").attr("class");
              if ("visible" != e && "chart" != e) {
                  var s = $(this);
                  var n = s.find(".visible [type=checkbox]").is(":checked");
                  if (n)
                      if (s.is(".hilited")) {
                          s.removeClass("hilited");
                          t.unHilite()
                      } else {
                          s.addClass("hilited").siblings().removeClass("hilited");
                          var o = s.find(".symbol").text();
                          t.hiliteSymbol(o)
                      }
              }
          }).on("change", ".visible [type=checkbox]", function() {
              var i = $(this).is(":checked");
              var e = $(this).closest("tr");
              var s = e.find(".symbol").text();
              if (i) t.showSymbol(s);
              else {
                  if (t.isHilited(s)) {
                      t.unHilite();
                      e.removeClass("hilited")
                  }
                  t.hideSymbol(s)
              }
          }).on("click", "th", function() {
              var i = $(this);
              var e = i.text().replace(/\W/, "");
              if ("chart" != e) {
                  if (e != t.sortColumn) {
                      t.sortColumn = e;
                      t.sortDirection = "symbol" == e || "name" == e || "sector" == e || "industry" == e ? "a" : "d"
                  } else t.sortDirection = t.sortDirection && "d" != t.sortDirection ? "d" : "a";
                  "a" == t.sortDirection ? i.addClass("sort-ascending").removeClass("sort-descending").siblings().removeClass("sort-ascending sort-descending") : i.addClass("sort-descending").removeClass("sort-ascending").siblings().removeClass("sort-ascending sort-descending");
                  t.sort()
              }
          });
          $(document.body).on("keydown", function(i) {
              var e = $("input, textarea, select").is(":focus");
              if (!e) {
                  var s = i.which;
                  var n = s == t.UP;
                  var o = s == t.DOWN;
                  n ? t.hilitePrevRow() : o && t.hiliteNextRow()
              }
          })
      },
      hiliteNextRow: function() {
          var t = 0;
          if (null != this.hilitedSymbol)
              for (var i = 0; i < this.rows.length; i++) {
                  var e = this.rows[i];
                  var s = "white" == e.tail;
                  if (!s && e.symbol.toUpperCase() == this.hilitedSymbol.toUpperCase()) {
                      t = i < this.rows.length - 1 ? i + 1 : 0;
                      break
                  }
                  if (s && "" == this.hilitedSymbol) {
                      t = i < this.rows.length - 1 ? i + 1 : 0;
                      break
                  }
              }
          var s = "white" == this.rows[t].tail;
          if (s) this.hiliteSymbol("");
          else {
              var n = this.rows[t].symbol;
              this.hiliteSymbol(n)
          }
          this.paint()
      },
      hilitePrevRow: function() {
          var t = this.rows.length - 1;
          if (null != this.hilitedSymbol)
              for (var i = 0; i < this.rows.length; i++) {
                  var e = this.rows[i];
                  var s = "white" == e.tail;
                  if (!s && e.symbol.toUpperCase() == this.hilitedSymbol.toUpperCase()) {
                      t = i > 0 ? i - 1 : this.rows.length - 1;
                      break
                  }
                  if (s && "" == this.hilitedSymbol) {
                      t = i > 0 ? i - 1 : this.rows.length - 1;
                      break
                  }
              }
          var s = "white" == this.rows[t].tail;
          if (s) this.hiliteSymbol("");
          else {
              var n = this.rows[t].symbol;
              this.hiliteSymbol(n)
          }
          this.paint()
      },
      hideSymbol: function(t) {
          if (this.isVisible(t)) {
              this.hiddenSymbols.push(t.toUpperCase());
              for (var i = 0; i < this.rows.length; i++) {
                  var e = this.rows[i];
                  if (e.symbol.toUpperCase() == t.toUpperCase()) {
                      e.visible = !1;
                      break
                  }
              }
              this.settings.onHideSymbol(t)
          }
      },
      showSymbol: function(t) {
          var i = [];
          for (var e = 0; e < this.hiddenSymbols.length; e++) t.toUpperCase() != this.hiddenSymbols[e] && i.push(this.hiddenSymbols[e]);
          this.hiddenSymbols = i;
          for (var e = 0; e < this.rows.length; e++) {
              var s = this.rows[e];
              if (s.symbol.toUpperCase() == t.toUpperCase()) {
                  s.visible = !0;
                  break
              }
          }
          this.settings.onShowSymbol(t)
      },
      unHilite: function() {
          this.hilitedSymbol = null;
          this.settings.onUnHiliteSymbol()
      },
      hiliteSymbol: function(t) {
          this.hilitedSymbol = t.toUpperCase();
          "" == t ? this.settings.onUnHiliteSymbol() : this.settings.onHiliteSymbol(t)
      },
      isHidden: function(t) {
          return -1 != this.hiddenSymbols.indexOf(t.toUpperCase())
      },
      isVisible: function(t) {
          return !this.isHidden(t)
      },
      isHilited: function(t) {
          return this.hilitedSymbol && t.toUpperCase() == this.hilitedSymbol.toUpperCase()
      },
      sort: function() {
          var t = this;
          var i = function(i, e) {
              var s = "price" == t.sortColumn || "chg" == t.sortColumn;
              var n = "tail" == t.sortColumn;
              var o = "chart" == t.sortColumn;
              var a = null;
              var r = null;
              if (s) {
                  a = parseFloat(i[t.sortColumn]);
                  r = parseFloat(e[t.sortColumn])
              } else if (n) {
                  a = i[t.sortColumn];
                  r = e[t.sortColumn];
                  "green" == a && (a = 4);
                  "blue" == a && (a = 3);
                  "yellow" == a && (a = 2);
                  "red" == a && (a = 1);
                  "white" == a && (a = 0);
                  "green" == r && (r = 4);
                  "blue" == r && (r = 3);
                  "yellow" == r && (r = 2);
                  "red" == r && (r = 1);
                  "white" == r && (r = 0);
                  if (a == r) {
                      a = i.jdkmag;
                      r = e.jdkmag
                  }
              } else if (o) {
                  a = 0;
                  r = 0
              } else {
                  a = i[t.sortColumn];
                  r = e[t.sortColumn]
              }
              return r > a ? -1 : a > r ? 1 : 0
          };
          this.rows.sort(i);
          "d" == this.sortDirection && this.rows.reverse();
          this.paint()
      },
      toTable: function() {
          var t = ["chart", "visible", "tail", "symbol", /*"name",*/  "sector", "industry", "price", "chg"];
          var i = "";
          i += "<table class='symbolgrid'> \n";
          i += "<thead>";
          i += "<tr>";
          for (var e = 0; e < t.length; e++) {
              var s = t[e];
              "chg" == s && (s = "%chg");
              i += t[e] == this.sortColumn ? "a" == this.sortDirection ? "<th class='sort-ascending'>" + s + "</th>" : "<th class='sort-descending'>" + s + "</th>" : "<th>" + s + "</th>"
          }
          i += "</tr>";
          i += "</thead>";
          i += "<tbody>";
          for (var e = 0; e < this.rows.length; e++) {
              var n = this.rows[e];
              var o = "white" == n.tail;
              var a = n.symbol;
              var r = ["row", n.tail];
              (!o && this.isHilited(a) || o && "" == this.hilitedSymbol) && r.push("hilited");
              i += "<tr class='" + r.join(" ") + "'>";
              for (var h = 0; h < t.length; h++) {
                  var l = t[h];
                  var u = n[l];
                  var g = "right";
                  var c = l;
                  if ("price" == l) u = isNaN(u) ? "" : u.toFixed(2);
                  else if ("chg" == l)
                      if (isNaN(u)) u = "";
                      else {
                          var d = "d" == this.settings.period.toLowerCase() ? .75 : 3;
                          this.settings.tailLength > 0 && (d *= this.settings.tailLength);
                          var m = Math.ceil(40 * (Math.abs(u) / d));
                          m > 40 && (m = 40);
                          1 > m && (m = 1);
                          var f = u >= 0 ? "/images/greenbar.png" : "/images/redbar.png";
                          u = "<img src='" + f + "' width='" + m + "' height='10'> " + u.toFixed(1);
                          g = "left"
                      }
                  else if ("tail" == l) {
                      var v = 8;
                      var m = Math.ceil(40 * (Math.abs(n.jdkmag) / v));
                      m > 40 && (m = 40);
                      1 > m && (m = 1);
                      if ("white" == u) u = "";
                      else if (u) {
                          var f = "/images/" + u + "bar.png";
                          u = "<img src='" + f + "' width='" + m + "' height='10'>"
                      }
                      g = "left"
                  } else if ("visible" == l) {
                      u = o ? "" : u ? "<input type='checkbox' checked='checked' />" : "<input type='checkbox' />";
                      g = "center"
                  } else if ("chart" == l) {
                      u = "<a href=''><img src='/images/candle.gif'></a>";
                      g = "center"
                  }
                  i += "<td align='" + g + "' class='" + c + "'>" + u + "</td>"
              }
              i += "</tr>"
          }
          i += "</tbody>";
          i += "</table>";
          return i
      },
      getCompanyInfo: function(t) {
          var i = {};
          for (var e = 0; e < this.settings.companyInfo.length; e++)
              if (this.settings.companyInfo[e].symbol.toLowerCase() == t.toLowerCase()) {
                  i = this.settings.companyInfo[e];
                  break
              }
          return i
      },
      getHiddenSymbols: function() {
          return this.hiddenSymbols
      },
      getHilitedSymbol: function() {
          return this.hilitedSymbol
      },
      getSortColumn: function() {
          return this.sortColumn
      },
      getSortDirection: function() {
          return this.sortDirection
      },
      setData: function(t) {
          this.initRows(t);
          this.sort();
          this.paint()
      },
      setTailLength: function(t) {
          this.settings.tailLength = t
      }
  };
  var TimeStamp = function() {
      this.init.apply(this, arguments)
  };
  TimeStamp.prototype = {
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      monthsVerbose: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysVerbose: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      reYYYYMMDD: /^(19\d{2}|20\d{2})(\d{2})(\d{2})$/,
      reMillis: /^(-?\d+)\.?\d*$/,
      init: function() {
          this.date = null;
          0 == arguments.length ? this.date = new Date : 1 == arguments.length ? this.date = this.parse(arguments[0]) : 3 == arguments.length && (this.date = new Date(arguments[2], arguments[0] - 1, arguments[1]));
          if (this.date) {
              this.date.setHours(0);
              this.date.setMinutes(0);
              this.date.setSeconds(0);
              this.date.setMilliseconds(0)
          }
      },
      parse: function(t) {
          t = t.toString().toLowerCase().replace(/\s+/g, "");
          if (0 == t.length) return new Date;
          var i = t.match(this.reYYYYMMDD);
          if (i) return new Date(i[1], i[2] - 1, i[3]);
          i = t.match(this.reMillis);
          return i ? new Date(parseInt(i[1])) : null
      },
      getYear: function() {
          return this.date.getFullYear()
      },
      getMonth: function() {
          return this.date.getMonth() + 1
      },
      getDay: function() {
          return this.date.getDate()
      },
      getMillis: function() {
          return this.date ? this.date.getTime() : 0
      },
      isNull: function() {
          return null == this.date
      },
      format: function(t) {
          var i = t.replace(/YYYY/g, this.getYear());
          i = i.replace(/YY/g, this.getYear().toString().substr(-2));
          i = i.replace(/MMMM/g, this.monthsVerbose[this.date.getMonth()]);
          i = i.replace(/MMM/g, this.months[this.date.getMonth()]);
          i = i.replace(/MM/g, this.pad(this.getMonth()));
          i = i.replace(/M/g, this.getMonth());
          i = i.replace(/DD/g, this.pad(this.getDay()));
          i = i.replace(/D/g, this.getDay());
          i = i.replace(/EEEE/g, this.daysVerbose[this.date.getDay()]);
          i = i.replace(/EEE/g, this.days[this.date.getDay()]);
          i = i.replace(/EE/g, this.pad(this.date.getDay()));
          i = i.replace(/E/g, this.date.getDay());
          i = i.replace(/\d+ar/g, "Mar");
          i = i.replace(/\d+ay/g, "May");
          i = i.replace(/\d+on/g, "Mon");
          i = i.replace(/\d+ec/g, "Dec");
          return i
      },
      pad: function(t) {
          return 10 > t ? "0" + t : t
      },
      toString: function() {
          return this.format("YYYYMMDD")
      }
  };
  var TimeSeriesCollection = function() {
      this.init()
  };
  TimeSeriesCollection.prototype = {
      init: function() {
          this.seriesCollection = []
      },
      push: function(t) {
          this.seriesCollection.push(t)
      },
      size: function() {
          return this.seriesCollection.length
      },
      each: function(t, i) {
          for (var e = 0; e < this.seriesCollection.length; e++) {
              var s = this.seriesCollection[e];
              i ? t.call(i, e, s) : t(e, s)
          }
      },
      getById: function(t) {
          var i = null;
          for (var e = 0; e < this.seriesCollection.length; e++)
              if (this.seriesCollection[e].getId() == t.toUppCase()) {
                  i = this.seriesCollection[e];
                  break
              }
          return i
      },
      getByIndex: function(t) {
          return 0 > t || t > this.seriesCollection.length - 1 ? null : this.seriesCollection[t]
      },
      getMinMax: function(t, i) {
          var e = {
              min: null,
              max: null
          };
          for (var s = 0; s < this.seriesCollection.length; s++) {
              var n = this.seriesCollection[s];
              var o = i && -1 != i.indexOf(n.getId());
              if (!o) {
                  var a = n.getMinMax(t);
                  (!e.min || a.min && a.min < e.min) && (e.min = a.min);
                  (!e.max || a.max && a.max > e.max) && (e.max = a.max)
              }
          }
          return e
      },
      getMinMaxInRange: function(t, i, e, s) {
          var n = {
              min: null,
              max: null
          };
          for (var o = 0; o < this.seriesCollection.length; o++) {
              var a = this.seriesCollection[o];
              var r = s && -1 != s.indexOf(a.getId());
              if (!r) {
                  var h = a.getMinMaxInRange(t, i, e);
                  (!n.min || h.min && h.min < n.min) && (n.min = h.min);
                  (!n.max || h.max && h.max > n.max) && (n.max = h.max)
              }
          }
          return n
      }
  };
  var TimeSeries = function(t, i) {
      this.init(t, i)
  };
  TimeSeries.prototype = {
      init: function(t, i) {
          this.id = t.toUpperCase();
          this.data = i || {};
          this.summary = {}, this.timestamps = [], this.rows = [];
          this.length = 0;
          this.parse()
      },
      parse: function() {
          for (var t = 0; t < this.data.length; t++) {
              var i = this.data[t];
              var e = {};
              for (a in i) {
                  var s = i[a];
                  if ("date" == a) this.timestamps.push(new TimeStamp(s));
                  else {
                      s = parseFloat(s);
                      e[a] = s;
                      0 == this.length && (this.summary[a] = {
                          min: null,
                          max: null
                      });
                      var n = this.summary[a].min;
                      var o = this.summary[a].max;
                      s && (!n || n > s) && (this.summary[a].min = s);
                      s && (!o || s > o) && (this.summary[a].max = s)
                  }
              }
              this.rows.push(e);
              this.length++
          }
          for (t in this.summary) {
              var a = t;
              var n = this.summary[a].min;
              var o = this.summary[a].max
          }
      },
      divide: function(t) {
          var i = this.getId() + "/" + t.getId();
          var e = [];
          for (var s = 0; s < this.length; s++) {
              var n = this.timestamps[s];
              var o = this.rows[s];
              var a = t.rows[s];
              var r = {
                  date: n.format("YYYYMMDD")
              };
              for (var h in o) {
                  var l = o[h];
                  var u = a[h];
                  if ("undefined" != typeof u) {
                      var g = l / u;
                      r[h] = g
                  }
              }
              e.push(r)
          }
          return new TimeSeries(i, e)
      },
      traverse: function(t, i) {
          for (var e = 0; e < this.length; e++) i ? t.call(i, this.timestamps[e], this.rows[e]) : t(this.timestamps[e], this.rows[e])
      },
      traverseRange: function(t, i, e, s) {
          for (var n = t; i >= n; n++) s ? e.call(s, this.timestamps[n], this.rows[n]) : e(this.timestamps[n], this.rows[n])
      },
      getMinMaxInRange: function(t, i, e) {
          var s = {
              min: null,
              max: null
          };
          this.traverseRange(t, i, function(t, i) {
              var n = i[e];
              (!s.min || n && n < s.min) && (s.min = n);
              (!s.max || n && n > s.max) && (s.max = n)
          });
          return s
      },
      getMinInRange: function(t, i, e) {
          var s = null;
          this.traverseRange(t, i, function(t, i) {
              var n = i[e];
              (!s || n && s > n) && (s = n)
          });
          return s
      },
      getMaxInRange: function(t, i, e) {
          var s = null;
          this.traverseRange(t, i, function(t, i) {
              var n = i[e];
              (!s || n && n > s) && (s = n)
          });
          return s
      },
      getIndexFromDate: function(t) {
          var i = new TimeStamp(t).getMillis();
          return this.getIndexFromMillis(i)
      },
      getIndexFromMillis: function(t) {
          if (t < this.timestamps[0].getMillis()) return 0;
          if (t > this.timestamps[this.length - 1].getMillis()) return this.length - 1;
          var i = this.length - 1;
          var e = 0;
          var s = Math.round((i + e) / 2);
          for (; s != e && s != i;) {
              t > this.timestamps[s].getMillis() ? e = s : i = s;
              s = Math.round((i + e) / 2)
          }
          return s
      },
      getId: function() {
          return this.id
      },
      getStartTimeStamp: function() {
          return this.timestamps[0]
      },
      getEndTimeStamp: function() {
          return this.timestamps[this.length - 1]
      },
      get: function(t, i) {
          if ("string" == typeof t) var t = this.getIndexFromDate(date);
          var e = this.rows[t];
          return e[i]
      },
      getMin: function(t) {
          return this.summary[t].min
      },
      getMax: function(t) {
          return this.summary[t].max
      },
      getMinMax: function(t) {
          return {
              min: this.summary[t].min,
              max: this.summary[t].max
          }
      }
  };
  var Grid = function(t) {
      this.init(t)
  };
  Grid.prototype = {
      init: function(t) {
          this.x = {
              pixel: {
                  min: null,
                  max: null
              },
              value: {
                  min: null,
                  max: null,
                  inc: null,
                  floor: null,
                  ceiling: null
              }
          };
          this.y = {
              pixel: {
                  min: null,
                  max: null
              },
              value: {
                  min: null,
                  max: null,
                  inc: null,
                  floor: null,
                  ceiling: null
              }
          };
          this.margin = {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
          };
          this.setPixels({
              top: t.top,
              right: t.right,
              bottom: t.bottom,
              left: t.left
          });
          t.margin && (this.margin = t.margin)
      },
      setPixels: function(t) {
          this.x.pixel.min = t.left;
          this.x.pixel.max = t.right;
          this.y.pixel.min = t.top;
          this.y.pixel.max = t.bottom;
          return this
      },
      setValues: function(t) {
          if (null != t.left || null != t.right || null != t.top || null != t.bottom) {
              if (t.left != t.right) {
                  this.x.value.min = t.left;
                  this.x.value.max = t.right
              } else {
                  this.x.value.min = .99 * t.left;
                  this.x.value.max = 1.01 * t.right
              }
              if (t.bottom != t.top) {
                  this.y.value.min = t.bottom;
                  this.y.value.max = t.top
              } else {
                  this.y.value.min = .99 * t.bottom;
                  this.y.value.max = 1.01 * t.top
              }
              this.x.value.inc = this.getNiceIncrement(this.x.value.min, this.x.value.max);
              this.y.value.inc = this.getNiceIncrement(this.y.value.min, this.y.value.max);
              this.x.value.floor = this.x.value.inc ? this.x.value.min - this.x.value.min % this.x.value.inc : this.x.value.min;
              this.y.value.floor = this.y.value.inc ? this.y.value.min - this.y.value.min % this.y.value.inc : this.y.value.min;
              this.x.value.ceiling = this.x.value.inc ? this.x.value.max - this.x.value.max % this.x.value.inc + this.x.value.inc : this.x.value.max;
              this.y.value.ceiling = this.y.value.inc ? this.y.value.max - this.y.value.max % this.y.value.inc + this.y.value.inc : this.y.value.max
          }
          return this
      },
      toString: function() {
          var t = "px: (" + this.x.pixel.min.toFixed(2) + ", " + this.y.pixel.min.toFixed(2) + ") to (" + this.x.pixel.max.toFixed(2) + ", " + this.y.pixel.max.toFixed(2) + ")";
          t += "\nx: " + this.x.value.min + " to " + this.x.value.max + ", " + this.x.value.floor + " to " + this.x.value.ceiling + " by " + this.x.value.inc;
          t += "\ny: " + this.y.value.min + " to " + this.y.value.max + ", " + this.y.value.floor + " to " + this.y.value.ceiling + " by " + this.y.value.inc;
          return t
      },
      pixelToValue: function(t) {
          var i = this.x.pixel.min + this.margin.left;
          var e = this.x.pixel.max - this.margin.right;
          var s = this.y.pixel.min + this.margin.top;
          var n = this.y.pixel.max - this.margin.bottom;
          var o = {
              x: t.x ? (t.x - i) / (e - i) : null,
              y: t.y ? (n - t.y) / (n - s) : null
          };
          return {
              x: t.x ? o.x * (this.x.value.max - this.x.value.min) + this.x.value.min : null,
              y: t.y ? o.y * (this.y.value.max - this.y.value.min) + this.y.value.min : null
          }
      },
      valueToPixel: function(t) {
          var i = {
              x: t.x ? (t.x - this.x.value.min) / (this.x.value.max - this.x.value.min) : null,
              y: t.y ? (t.y - this.y.value.min) / (this.y.value.max - this.y.value.min) : null
          };
          var e = this.x.pixel.min + this.margin.left;
          var s = this.x.pixel.max - this.margin.right;
          var n = this.y.pixel.min + this.margin.top;
          var o = this.y.pixel.max - this.margin.bottom;
          return {
              x: t.x ? i.x * (s - e) + e : null,
              y: t.y ? o - i.y * (o - n) : null
          }
      },
      xFloorToCeiling: function(t, i) {
          for (var e = this.x.value.floor; e <= this.x.value.ceiling; e += this.x.value.inc) {
              var s = this.valueToPixel({
                  x: e,
                  y: null
              });
              i ? t.call(i, s.x, e) : t(s, e)
          }
      },
      yFloorToCeiling: function(t, i) {
          for (var e = this.y.value.floor; e <= this.y.value.ceiling; e += this.y.value.inc) {
              var s = this.valueToPixel({
                  x: null,
                  y: e
              });
              i ? t.call(i, s.y, e) : t(s, e)
          }
      },
      translate: function(t) {
          var i = {
              x: (this.x.value.max - this.x.value.min) * (t.x / (this.x.pixel.max - this.x.pixel.min)),
              y: (this.y.value.max - this.y.value.min) * (t.y / (this.y.pixel.max - this.y.pixel.min))
          };
          this.setValues({
              left: this.x.value.min - i.x,
              right: this.x.value.max - i.x,
              top: this.y.value.max + i.y,
              bottom: this.y.value.min + i.y
          })
      },
      zoom: function(t) {
          var i = (t - 1) * (this.x.value.max - this.x.value.min);
          var e = (t - 1) * (this.y.value.max - this.y.value.min);
          this.setValues({
              left: this.x.value.min - i / 2,
              right: this.x.value.max + i / 2,
              bottom: this.y.value.min - e / 2,
              top: this.y.value.max + e / 2
          })
      },
      getNiceIncrement: function(t, i) {
          var e = i - t;
          if (.001 > e) return 0;
          var s = 100;
          var n = 1e-4;
          var o;
          var a = [1, 2, 2.5, 5];
          for (; s > 10;) {
              for (var r = 0; r < a.length; r++) {
                  o = n * a[r];
                  s = e / o;
                  if (10 > s) break
              }
              n *= 10
          }
          return o
      }
  };
  var Rectangle = function(t, i, e, s) {
      this.init(t, i, e, s)
  };
  Rectangle.prototype = {
      init: function(t, i, e, s) {
          this.x = t;
          this.y = i;
          this.w = e;
          this.h = s;
          this.left = this.x;
          this.right = this.x + this.w - 1;
          this.top = this.y;
          this.bottom = this.y + this.h - 1
      },
      paint: function(t, i, e) {
          t.save();
          var s = Math.round(this.x);
          var n = Math.round(this.y);
          var o = Math.round(this.right) - Math.round(this.left) + 1;
          var a = Math.round(this.h);
          if (i) {
              t.fillStyle = i;
              t.fillRect(s, n, o, a)
          }
          if (e) {
              t.strokeStyle = e;
              t.strokeRect(s + .5, n + .5, o - 1, a - 1)
          }
          t.restore()
      },
      clear: function(t) {
          t.clearRect(this.x, this.y, this.w, this.h)
      },
      contains: function(t) {
          return t.x >= this.left && t.x <= this.right && t.y >= this.top && t.y <= this.bottom
      },
      toString: function() {
          return "L:" + Math.round(this.x) + " R:" + (Math.round(this.x) + Math.round(this.w) - 1) + " T:" + Math.round(this.y) + " B:" + (Math.round(this.y) + Math.round(this.h) - 1)
      }
  };
  var Path = function(t) {
      this.init(t)
  };
  Path.prototype = {
      init: function(t) {
          this.ctx = t;
          this.coords = []
      },
      moveTo: function(t, i) {
          this.coords.push({
              x: t,
              y: i,
              join: !1
          });
          return this
      },
      lineTo: function(t, i) {
          0 == this.coords.length && this.moveTo(t, i);
          this.coords.push({
              x: t,
              y: i,
              join: !0
          });
          return this
      },
      clear: function() {
          this.coords = [];
          return this
      },
      stroke: function(t) {
          this.ctx.save();
          this.ctx.beginPath();
          for (var i = 0; i < this.coords.length; i++) {
              var e = this.coords[i];
              var s = Math.round(e.x) + .5;
              var n = Math.round(e.y) + .5;
              e.join ? this.ctx.lineTo(s, n) : this.ctx.moveTo(s, n)
          }
          this.ctx.strokeStyle = t;
          this.ctx.stroke();
          this.ctx.closePath();
          this.ctx.restore();
          return this
      },
      fill: function(t) {
          this.ctx.save();
          this.ctx.beginPath();
          for (var i = 0; i < this.coords.length; i++) {
              var e = this.coords[i];
              var s = Math.round(e.x) + .5;
              var n = Math.round(e.y) + .5;
              e.join ? this.ctx.lineTo(s, n) : this.ctx.moveTo(s, n)
          }
          this.ctx.fillStyle = t;
          this.ctx.fill();
          this.ctx.closePath();
          this.ctx.restore();
          return this
      }
  };
  var Messages = function() {
      this.init()
  };
  Messages.prototype = {
      init: function() {
          this.callbacks = {}
      },
      send: function(t) {
          var i = Array.prototype.slice.call(arguments, 1);
          this.callbacks[t] && $.each(this.callbacks[t], function(t, e) {
              e.apply(this, i)
          })
      },
      receive: function(t, i, e) {
          this.callbacks[t] || (this.callbacks[t] = []);
          e && (i = this.bind(i, e));
          this.callbacks[t].push(i);
          return this
      },
      bind: function(t, i) {
          return function() {
              return t.apply(i, arguments)
          }
      }
  };
  rrg.init();
}