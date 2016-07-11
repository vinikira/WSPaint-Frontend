window.onload = function(){
  var pontos = [];
  var ws = new WebSocket('ws://localhost:8080');
  var quadro  = document.getElementById("quadro");
  var ctx = quadro.getContext("2d");
  var desenhando = false;
  var rect = quadro.getBoundingClientRect();

  //eventos do Socket
  ws.onopen = function(){
    console.log("Conectei");
  }
  
  ws.onmessage = function(evt){    
    pontos = JSON.parse(evt.data);
    ctx.moveTo(pontos[0].x, pontos[0].y);
    pontos.forEach(function(i){
      console.log("x: "+i.x+" y: "+i.y);
      ctx.lineTo(i.x,i.y);
    });
    ctx.stroke();
  }

  ws.onclose = function(){
    console.log("conexão fechada");
  }
  /////////////////////////////////

  
  //Eventos do canvas

  quadro.onmousedown = function(evt){
    var x = ((evt.clientX - rect.left) / (rect.right - rect.left) * quadro.width);
    var y = ((evt.clientY - rect.top) / (rect.bottom - rect.top) * quadro.height);
    ctx.moveTo(x, y);
    pontos = [];
    pontos.push({x,y});
    desenhando = true;
  }

  quadro.onmouseup = function(){
    ws.send(JSON.stringify(pontos));
    desenhando = false;
  }

  quadro.onmousemove = function(evt){
    if(desenhando){
      var x = ((evt.clientX - rect.left) / (rect.right - rect.left) * quadro.width);
      var y = ((evt.clientY - rect.top) / (rect.bottom - rect.top) * quadro.height);
      ctx.lineTo(x, y);
      pontos.push({x, y});
      ctx.stroke();    
    }
  }
  ////////////////////////////////////
}

