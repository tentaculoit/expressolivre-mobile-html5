define(["jquery"], function($) {

  var FlashMessage = {
    serverErrors: {
      32700: "Erro ao fazer o parse",
      32600: "Requisição Invalida",
      32601: "Ação não encontrada",
      32602: "Parametros Invalidos",
      32603: "Erro Interno",
      404: "Está serviço não existe",
      500: "Erro ao rodar esse serviço, por favor tente mais tarde",
      1: "Você foi deslogado com sucesso",
      2: "Desculpa, sua sessão expirou devido ao tempo inativo",
      3: "Você não está logado",
      4: "É preciso habilitar os Cookies para acessar o Expresso Mobile",
      5: "Login ou senha inválidos",
      6: "Sua senha expirou, favor acessar o Expresso Web para modificar sua senha",
      7: "Sua sessão está inválida, favor logar novamente",
      10: "Não foi possível verificar sua sessão",
      98: "Sua conta está expirada",
      99: "Sua conta está bloqueada devido a quantidade elevada de tentativas de login",
      200: "Login ou senha inválidos",
      1001: "É preciso informar no minimo 3 caracteres para realizar a pesquisa",
      1002: "Não foi possível enviar o email",
      1003: "Não foi possível esvaziar a lixeira",
      1004: "A mensagem não foi encontrada na pasta especificada",
      1005: "Nome de pasta inválido",
      1006: "Pasta anterior inválida",
      1007: "Pasta inválida",
      1008: "Não é possível apagar um pasta padrão",
      1009: "A pasta não está vazia",
      1010: "A pasta não pode ser renomeada",
      1011: "Não foi possível adicionar essa pasta"
    },

    serverError: function(code) {
      this.show("error", this.serverErrors[Math.abs(code)]);
    },

    success: function(message) {
      this.show("success", message);
    },

    error: function(message) {
      this.show("error", message);
    },

    info: function(message) {
      this.show("info", message);
    },

    warning: function(message) {
      this.show("warning", message);
    },

    show: function (type, message) {
      $('<div><p>'+message+'</p></div>')
        .addClass(type + " flash-message")
        .css({ "display": "block", "top": $(window).scrollTop() })
        .appendTo( "body" )
        .delay( 1500 )
        .fadeOut( 400, function() {
          $(this).remove();
        })
    }
  }

  return FlashMessage;
});
