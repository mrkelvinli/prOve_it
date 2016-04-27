



Router.route('/vs_company_chart/:token', function () {
  this.render('vs_company_chart',{
    token: function () {
      return this.params.company_name;
    },
  });
  this.layout('main_layout');
});


Router.route('/company_topics_chart/:token/:company_name', function () {
  // console.log("router: "+this.params.company_name);
  this.render('company_topics_chart',{
    company_name: function () {
      return this.params.company_name;
    },
    token: function() {
      return this.params.token;
    }
  });
  // this.render('company_topics_chart');
  this.layout('main_layout');
});


Router.route('/company_events_highlight/:token/:company_name/amcharts/images/:image_name',function(){
  this.redirect('/amcharts/images/'+this.params.image_name);
});

Router.route('/company_events_highlight/:token/:company_name',function(){
  this.render('company_events_highlight',{
    company_name: function () {
      return this.params.company_name;
    },
    token: function() {
      return this.params.token;
    }
  });
  // this.render('company_events_highlight');
  this.layout('main_layout');
});




Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    // layoutTemplate: 'layout'
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
