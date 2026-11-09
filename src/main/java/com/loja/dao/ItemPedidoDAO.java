package com.loja.dao;

import com.loja.model.ItemPedido;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO com CRUD da tabela item_pedido.
 */
public class ItemPedidoDAO implements CrudDAO<ItemPedido> {

    @Override
    public void inserir(ItemPedido itemPedido) throws SQLException {
        String sql = "INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemPedido.getIdPedido());
            stmt.setInt(2, itemPedido.getIdProduto());
            stmt.setInt(3, itemPedido.getQuantidade());
            stmt.setBigDecimal(4, itemPedido.getPrecoUnitario());
            stmt.executeUpdate();
        }
    }

    @Override
    public ItemPedido buscarPorId(int id) throws SQLException {
        String sql = "SELECT id, id_pedido, id_produto, quantidade, preco_unitario FROM item_pedido WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return montarItemPedido(rs);
                }
            }
        }

        return null;
    }

    @Override
    public List<ItemPedido> listarTodos() throws SQLException {
        String sql = "SELECT id, id_pedido, id_produto, quantidade, preco_unitario FROM item_pedido ORDER BY id";
        List<ItemPedido> itens = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                itens.add(montarItemPedido(rs));
            }
        }

        return itens;
    }

    @Override
    public boolean atualizar(ItemPedido itemPedido) throws SQLException {
        String sql = "UPDATE item_pedido SET id_pedido = ?, id_produto = ?, quantidade = ?, preco_unitario = ? WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemPedido.getIdPedido());
            stmt.setInt(2, itemPedido.getIdProduto());
            stmt.setInt(3, itemPedido.getQuantidade());
            stmt.setBigDecimal(4, itemPedido.getPrecoUnitario());
            stmt.setInt(5, itemPedido.getId());
            return stmt.executeUpdate() > 0;
        }
    }

    @Override
    public boolean deletar(int id) throws SQLException {
        String sql = "DELETE FROM item_pedido WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    private ItemPedido montarItemPedido(ResultSet rs) throws SQLException {
        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setId(rs.getInt("id"));
        itemPedido.setIdPedido(rs.getInt("id_pedido"));
        itemPedido.setIdProduto(rs.getInt("id_produto"));
        itemPedido.setQuantidade(rs.getInt("quantidade"));
        itemPedido.setPrecoUnitario(rs.getBigDecimal("preco_unitario"));
        return itemPedido;
    }
}
