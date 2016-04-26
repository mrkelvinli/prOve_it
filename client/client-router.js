

Router.route('/', function(){
  this.render('chart');
},{
	where: 'client'
});

Router.configure({
	layoutTemplate: 'main_layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});