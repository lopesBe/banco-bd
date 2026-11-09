package com.loja.view;

import com.loja.dao.FornecedorDAO;
import com.loja.model.Fornecedor;

/**
 * Tela CRUD da tabela fornecedor.
 */
public class FornecedorPanel extends CrudPanel<Fornecedor> {

    public FornecedorPanel() {
        super(new String[]{"ID", "Nome", "CNPJ", "Cidade"},
                new CampoFormulario[]{
                        new CampoFormulario("id", "ID", false),
                        new CampoFormulario("nome", "Nome", true),
                        new CampoFormulario("cnpj", "CNPJ", true),
                        new CampoFormulario("cidade", "Cidade", true)
                },
                new FornecedorDAO(),
                valores -> {
                    Fornecedor fornecedor = new Fornecedor();
                    fornecedor.setId(Conversor.inteiro(valores, "id"));
                    fornecedor.setNome(Conversor.texto(valores, "nome"));
                    fornecedor.setCnpj(Conversor.texto(valores, "cnpj"));
                    fornecedor.setCidade(Conversor.texto(valores, "cidade"));
                    return fornecedor;
                },
                fornecedor -> new String[]{
                        String.valueOf(fornecedor.getId()),
                        Conversor.str(fornecedor.getNome()),
                        Conversor.str(fornecedor.getCnpj()),
                        Conversor.str(fornecedor.getCidade())
                });
    }
}
