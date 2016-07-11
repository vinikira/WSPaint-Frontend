(function () {
   'use strict';
    angular.module("wspaint").config(function ($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "views/session.html",
      controller: "sessionCtrl",
      controllerAs: "vm",
      reloadOnSearch: false
    })
    .when("/desenho",{
      templateUrl: "views/desenho.html",
      controller: "desenhoCtrl",
      controllerAs: "vm",
      resolve: {
        users: function(sessionService){
          return sessionService.getSession().users;
        },
        actualUser: function(sessionService){
          return sessionService.getActualUser();
        }
      }
    })
  });
})();