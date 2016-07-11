( function() {
  'use strict';
  angular
    .module("wspaint")
    .controller("desenhoCtrl", desenhoCtrl);

  function desenhoCtrl(telaService, webSocket, $scope, users, actualUser, sessionService){
    var vm = this;
    vm.users = users;
    vm.user = actualUser;
    var desenhar = function(traces){
      var img = new Image;
      img.src = traces;
      telaService.ctx.drawImage(img,0,0);
    }

    webSocket.on('refreshSession', function (newSession){
      $scope.$apply(function () {
        vm.user = newSession.users.filter(function(value){
          if(value.user === vm.user.user){
            return value;
          }
        })[0];
        sessionService.setActualUser(vm.user);
        sessionService.setSession(newSession);
        vm.users = sessionService.getSession().users;
        vm.version = sessionService.getSession().__v;
        console.log('entrei no refreshSession');
        console.log(vm.version);
        if(newSession.draw.length>0){
          var desenho = (newSession.draw.slice(-1)[0]);
          desenhar(desenho);
        }
      });
    });

    //Configuração da telaService de Desenho
    telaService.quadro.onmousedown = function(evt){
      var x = ((evt.clientX - telaService.rect.left) / (telaService.rect.right - telaService.rect.left) * telaService.quadro.width);
      var y = ((evt.clientY - telaService.rect.top) / (telaService.rect.bottom - telaService.rect.top) * telaService.quadro.height);
      telaService.ctx.moveTo(x, y);
      telaService.desenhando = true;
    }

    telaService.quadro.onmouseup = function(){
      telaService.desenhando = false;
      var traces = telaService.quadro.toDataURL();
      var id = sessionService.getSession()._id;
      webSocket.emit('putTraces', id, traces);
    }

    telaService.quadro.onmousemove = function(evt){
      if(telaService.desenhando){
        var x = ((evt.clientX - telaService.rect.left) / (telaService.rect.right - telaService.rect.left) * telaService.quadro.width);
        var y = ((evt.clientY - telaService.rect.top) / (telaService.rect.bottom - telaService.rect.top) * telaService.quadro.height);
        telaService.ctx.lineTo(x, y);
        telaService.ctx.strokeStyle = vm.user.color;
        telaService.ctx.stroke();
      }
    }
  }
})();
