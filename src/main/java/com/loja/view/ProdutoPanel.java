package com.loja.view;

import com.loja.dao.ProdutoDAO;
import com.loja.model.Produto;

/**
 * Tela CRUD da tabela produto.
 */
public class ProdutoPanel extends CrudPanel<Produto> {

    public ProdutoPanel() {
        super(new String[]{"ID", "Nome", "Preço", "ID Fornecedor"},
                new CampoFormulario[]{
                        new CampoFormulario("id", "ID", false),
                        new CampoFormulario("nome", "Nome", true),
                        new CampoFormulario("preco", "Preço", true),
                        new CampoFormulario("idFornecedor", "ID Fornecedor", true)
                },
                new ProdutoDAO(),
                valores -> {
                    Produto produto = new Produto();
                    produto.setId(Conversor.inteiro(valores, "id"));
                    produto.setNome(Conversor.texto(valores, "nome"));
                    produto.setPreco(Conversor.decimal(valores, "preco"));
                    produto.setIdFornecedor(Conversor.inteiro(valores, "idFornecedor"));
                    return produto;
                },
                produto -> new String[]{
                        String.valueOf(produto.getId()),
                        Conversor.str(produto.getNome()),
                        Conversor.str(produto.getPreco()),
                        String.valueOf(produto.getIdFornecedor())
                });
    }
}
