package com.loja.view;

import com.loja.dao.ClienteDAO;
import com.loja.model.Cliente;

/**
 * Tela CRUD da tabela cliente.
 */
public class ClientePanel extends CrudPanel<Cliente> {

    public ClientePanel() {
        super(new String[]{"ID", "Nome", "Email", "Cidade", "Data Cadastro"},
                new CampoFormulario[]{
                        new CampoFormulario("id", "ID", false),
                        new CampoFormulario("nome", "Nome", true),
                        new CampoFormulario("email", "Email", true),
                        new CampoFormulario("cidade", "Cidade", true),
                        new CampoFormulario("dataCadastro", "Data Cadastro (yyyy-MM-dd)", true)
                },
                new ClienteDAO(),
                valores -> {
                    Cliente cliente = new Cliente();
                    cliente.setId(Conversor.inteiro(valores, "id"));
                    cliente.setNome(Conversor.texto(valores, "nome"));
                    cliente.setEmail(Conversor.texto(valores, "email"));
                    cliente.setCidade(Conversor.texto(valores, "cidade"));
                    cliente.setDataCadastro(Conversor.data(valores, "dataCadastro"));
                    return cliente;
                },
                cliente -> new String[]{
                        String.valueOf(cliente.getId()),
                        Conversor.str(cliente.getNome()),
                        Conversor.str(cliente.getEmail()),
                        Conversor.str(cliente.getCidade()),
                        Conversor.str(cliente.getDataCadastro())
                });
    }
}
