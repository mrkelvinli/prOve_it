Template.chart_layout.helpers({
  isActive: function(routeName) {
    var routeObject = Router.current();
    var currentRoute = routeObject.route;
    return currentRoute.getName() === routeName ? 'active' : '';
  }
});