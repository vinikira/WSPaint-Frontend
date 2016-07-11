(function () {
	angular
	    .module("wspaint")
		.factory("telaService", telaService);

	function telaService(){
		var tela	    = {};
		tela.quadro     = document.getElementById("quadro");
		tela.ctx        = quadro.getContext("2d");
		tela.desenhando = false;
		tela.rect       = quadro.getBoundingClientRect();
		
		return tela;

	}
})();