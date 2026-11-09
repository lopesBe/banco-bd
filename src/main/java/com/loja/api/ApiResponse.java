package com.loja.api;

/**
 * Resposta simples para mensagens de sucesso ou erro.
 */
public class ApiResponse {

    private final String mensagem;

    public ApiResponse(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getMensagem() {
        return mensagem;
    }
}
