package com.loja.model;

import java.math.BigDecimal;

/**
 * Representa um registro da tabela produto.
 */
public class Produto {

    private int id;
    private String nome;
    private BigDecimal preco;
    private int idFornecedor;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public int getIdFornecedor() {
        return idFornecedor;
    }

    public void setIdFornecedor(int idFornecedor) {
        this.idFornecedor = idFornecedor;
    }

    @Override
    public String toString() {
        return id + " - " + nome + " | R$ " + preco;
    }
}
