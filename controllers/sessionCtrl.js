(function(){
  'use strict';
  angular
    .module("wspaint")
    .controller("sessionCtrl", sessionCtrl);

  function sessionCtrl(webSocket, $location, $scope, sessionService, $timeout, $anchorScroll){
    var vm = this;
    vm.user= {color:"#000000"};
    var refreshOpenedSessions = refreshOpenedSessions;
    function refreshOpenedSessions(){
      webSocket.on('wellcome', function(data){
        $scope.$apply(function () {
          vm.wellcome = data.message;
        });
      });
      webSocket.emit('getAllOpenedSessions');
    };

    vm.newSession = newSession;
    function newSession(user, draw){
      var session = {users:[]};
      session.users.push(angular.copy(user));
      sessionService.setActualUser(angular.copy(user));
      session.draw=[];
      if(draw)
        session.draw.push(angular.copy(draw));
      webSocket.emit("newSession", session);
      $location.path("/desenho");
    };

    vm.enterExistsSession = enterExistsSession;
    function enterExistsSession(session, user){
      var userLog = angular.copy(user);
      var sessLog = angular.copy(session);
      sessionService.setActualUser(userLog);
      sessionService.setSession(sessLog);      
      webSocket.emit('loginSession', userLog, sessLog._id);
      $location.path("/desenho");
    };

    vm.spySession = spySession;
    function spySession(session){
      vm.sessionView = angular.copy(session);
      vm.nDraw = 0;
      $timeout(function(){
        $('.slider').slider({indicators: false, interval: 60000});
        $('.materialboxed').materialbox();
        $location.hash('spySession');
        $anchorScroll();
      },100);
    }

    vm.slideImg = slideImg;
    function slideImg(direction){
      if(direction==='prev'){
        if(vm.nDraw === 0)
          vm.nDraw = vm.sessionView.draw.lenght-1;
        else
          vm.nDraw--;
      }else{
        if(vm.nDraw === vm.sessionView.draw.lenght-1)
          vm.nDraw = 0;
        else
          vm.nDraw++;
      }
      $('.slider').slider(direction);
    }

    vm.slideImgTo = slideImgTo;
    function slideImgTo(num){
      let ant = vm.nDraw;
      for(var i = 0; i < ant; i++){
        vm.slideImg('prev');
      }
      for(var i = 0; i < (num-1); i++){
        vm.slideImg('next');
      }
    }

    webSocket.on('sessions', function(data){
        $scope.$apply(function () {
          console.log('recebi as sessions', data);
          vm.sessions = data;
        });
      });
    refreshOpenedSessions();
  }
})();
