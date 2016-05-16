

 Router.route('/',function (){
   this.render('homePage');
 });

ReadyList = {};
Router.map(function() {


  this.route('chart', {
    path: '/chart/:token',
    template: 'app_ui',
    layout: 'main_layout',
    onBeforeAction: function(){
      ReadyList.js1 = IRLibLoader.load('/amcharts/amcharts.js');
      if(!ReadyList.js1.ready()){ return }
      ReadyList.js2 = IRLibLoader.load('/amcharts/serial.js');
      if(!ReadyList.js2.ready()){ return }
      ReadyList.js3 = IRLibLoader.load('/amcharts/amstock.js');
      if(!ReadyList.js3.ready()){ return }
      ReadyList.js4 = IRLibLoader.load('/amcharts/themes/light.js');
      if(!ReadyList.js4.ready()){ return }
      this.next();
    },
    waitOn: function(){
      ReadyList.subPrices = Meteor.subscribe('stockPrices_db',this.params.token);
      ReadyList.subEvents = Meteor.subscribe('stockEvents_db',this.params.token);
      return [
        // ReadyList.subPrices,
        // ReadyList.subEvents,
      ];
    },
    fastRender: true,
    // cache: true,
  });
});

// Template.chart.helper({
//   'subscriptionsReady' : function () {
//     return Template.chart.subscriptionsReady;
//   }
// });


Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'loading',
    layoutTemplate: 'main_layout'
});

// ---------- amChart example ----------

Router.route('/chart_click_example', function () {
  this.render('click_example');
  this.layout('chart_layout');
});

Router.route('/example1', function () {
  this.render('example1');
  this.layout('chart_layout');
});

Router.route('/example2', function () {
  this.render('example2');
  this.layout('chart_layout');
});

Router.route('/example3', function () {
  this.render('example3');
  this.layout('chart_layout');
});

// Router.route('/', function () {
//   this.render('home');
//   this.layout('chart_layout');
// });

