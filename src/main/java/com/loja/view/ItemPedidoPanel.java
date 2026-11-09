package com.loja.view;

import com.loja.dao.ItemPedidoDAO;
import com.loja.model.ItemPedido;

/**
 * Tela CRUD da tabela item_pedido.
 */
public class ItemPedidoPanel extends CrudPanel<ItemPedido> {

    public ItemPedidoPanel() {
        super(new String[]{"ID", "ID Pedido", "ID Produto", "Quantidade", "Preço Unitário"},
                new CampoFormulario[]{
                        new CampoFormulario("id", "ID", false),
                        new CampoFormulario("idPedido", "ID Pedido", true),
                        new CampoFormulario("idProduto", "ID Produto", true),
                        new CampoFormulario("quantidade", "Quantidade", true),
                        new CampoFormulario("precoUnitario", "Preço Unitário", true)
                },
                new ItemPedidoDAO(),
                valores -> {
                    ItemPedido itemPedido = new ItemPedido();
                    itemPedido.setId(Conversor.inteiro(valores, "id"));
                    itemPedido.setIdPedido(Conversor.inteiro(valores, "idPedido"));
                    itemPedido.setIdProduto(Conversor.inteiro(valores, "idProduto"));
                    itemPedido.setQuantidade(Conversor.inteiro(valores, "quantidade"));
                    itemPedido.setPrecoUnitario(Conversor.decimal(valores, "precoUnitario"));
                    return itemPedido;
                },
                itemPedido -> new String[]{
                        String.valueOf(itemPedido.getId()),
                        String.valueOf(itemPedido.getIdPedido()),
                        String.valueOf(itemPedido.getIdProduto()),
                        String.valueOf(itemPedido.getQuantidade()),
                        Conversor.str(itemPedido.getPrecoUnitario())
                });
    }
}
