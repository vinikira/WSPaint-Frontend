(function () {
   'use strict';
   angular.module('wspaint').factory('sessionService', sessionService);

   function sessionService(webSocket){
      var session = {};
      var actualUser = {};

      return{
        getSession: function(){
          return session;
        },
        setSession: function(newSession){
          session = newSession;
        },
        getActualUser: function(){
          return actualUser;
        },
        setActualUser: function(newUser){
          actualUser = newUser;
        }
      }
   }
})();