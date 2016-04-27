
Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'loading',
    // layoutTemplate: 'layout'
});


// fix me
// Router.route('/notFound', function() {
//   this.render('loading');
// })


Router.route('/',function (){
  this.render('chart');
  this.layout('main_layout');
});

// Router.route('/vs_company_chart/:token', function () {
//   this.render('vs_company_chart', {
//     token: function () {
//       return this.params.token;
//     },
//     onBeforeAction: function (){
//       Session.set('token',this.params.token);
//       console.log(Session.get('token'));
//       this.next();
//     }
//   });
//   this.layout('main_layout');
// });

// Router.route('/company_topics_chart/:company_name', function () {
//   Session.set('company_name',this.params.company_name);
//   this.render('company_topics_chart',{
//     company_name: function () {
//       return this.params.company_name;
//     },
//     token: function() {
//       return Session.get('token');
//     }
//   });
//   this.layout('main_layout');
// });


// Router.route('/company_events_highlight/',function(){

//   this.render('company_events_highlight',{
//     company_name: function () {
//       return Session.get('company_name');
//     },
//     token: function() {
//       return Session.get('token');
//     }
//   });
//   // this.render('company_events_highlight');
//   this.layout('main_layout');
// });




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
