package com.loja.view;

import com.loja.dao.CustoProdutoDAO;
import com.loja.model.CustoProduto;

/**
 * Tela CRUD da tabela custo_produto.
 */
public class CustoProdutoPanel extends CrudPanel<CustoProduto> {

    public CustoProdutoPanel() {
        super(new String[]{"ID", "ID Produto", "Custo", "Data Atualização"},
                new CampoFormulario[]{
                        new CampoFormulario("id", "ID", false),
                        new CampoFormulario("idProduto", "ID Produto", true),
                        new CampoFormulario("custo", "Custo", true),
                        new CampoFormulario("dataAtualizacao", "Data Atualização (yyyy-MM-dd)", true)
                },
                new CustoProdutoDAO(),
                valores -> {
                    CustoProduto custoProduto = new CustoProduto();
                    custoProduto.setId(Conversor.inteiro(valores, "id"));
                    custoProduto.setIdProduto(Conversor.inteiro(valores, "idProduto"));
                    custoProduto.setCusto(Conversor.decimal(valores, "custo"));
                    custoProduto.setDataAtualizacao(Conversor.data(valores, "dataAtualizacao"));
                    return custoProduto;
                },
                custoProduto -> new String[]{
                        String.valueOf(custoProduto.getId()),
                        String.valueOf(custoProduto.getIdProduto()),
                        Conversor.str(custoProduto.getCusto()),
                        Conversor.str(custoProduto.getDataAtualizacao())
                });
    }
}
