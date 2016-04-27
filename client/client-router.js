



Router.route('/', function () {
  // this.render('vs_company_chart',{
  //   data: function () {
  //     return Companys.find().fetch();
  //   }
  // });
    this.render('vs_company_chart');
  this.layout('main_layout');
});


Router.route('/c2', function () {
    this.render('company_topics_chart');
  this.layout('main_layout');
});

Router.route('/c3', function () {
    this.render('company_events_highlight');
  this.layout('main_layout');
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
