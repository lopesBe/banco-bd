package com.loja.view;

import com.loja.dao.PedidoDAO;
import com.loja.model.Pedido;

/**
 * Tela CRUD da tabela pedido.
 */
public class PedidoPanel extends CrudPanel<Pedido> {

    public PedidoPanel() {
        super(new String[]{"ID", "ID Cliente", "Data", "Total"},
                new CampoFormulario[]{
                        new CampoFormulario("id", "ID", false),
                        new CampoFormulario("idCliente", "ID Cliente", true),
                        new CampoFormulario("data", "Data (yyyy-MM-dd)", true),
                        new CampoFormulario("total", "Total", true)
                },
                new PedidoDAO(),
                valores -> {
                    Pedido pedido = new Pedido();
                    pedido.setId(Conversor.inteiro(valores, "id"));
                    pedido.setIdCliente(Conversor.inteiro(valores, "idCliente"));
                    pedido.setData(Conversor.data(valores, "data"));
                    pedido.setTotal(Conversor.decimal(valores, "total"));
                    return pedido;
                },
                pedido -> new String[]{
                        String.valueOf(pedido.getId()),
                        String.valueOf(pedido.getIdCliente()),
                        Conversor.str(pedido.getData()),
                        Conversor.str(pedido.getTotal())
                });
    }
}
