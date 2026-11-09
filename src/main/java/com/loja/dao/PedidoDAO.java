package com.loja.dao;

import com.loja.model.ItemPedido;
import com.loja.model.Pedido;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * DAO responsável por salvar e listar pedidos.
 */
public class PedidoDAO implements CrudDAO<Pedido> {

    @Override
    public void inserir(Pedido pedido) throws SQLException {
        String sql = "INSERT INTO pedido (id_usuario, data, total) VALUES (?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, pedido.getIdCliente());
            stmt.setDate(2, pedido.getData() == null ? null : Date.valueOf(pedido.getData()));
            stmt.setBigDecimal(3, pedido.getTotal());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    pedido.setId(rs.getInt(1));
                }
            }
        }
    }

    public void salvar(Pedido pedido) throws SQLException {
        String sqlPedido = "INSERT INTO pedido (id_usuario, data, total) VALUES (?, ?, ?)";
        String sqlItem = "INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection()) {
            try {
                conn.setAutoCommit(false);

                int idPedido = inserirPedido(conn, sqlPedido, pedido);
                inserirItens(conn, sqlItem, idPedido, pedido);

                conn.commit();
                pedido.setId(idPedido);
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    @Override
    public Pedido buscarPorId(int id) throws SQLException {
        String sql = "SELECT id, id_usuario, data, total FROM pedido WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return montarPedido(rs);
                }
            }
        }

        return null;
    }

    @Override
    public java.util.List<Pedido> listarTodos() throws SQLException {
        String sql = "SELECT id, id_usuario, data, total FROM pedido ORDER BY id";
        java.util.List<Pedido> pedidos = new java.util.ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                pedidos.add(montarPedido(rs));
            }
        }

        return pedidos;
    }

    @Override
    public boolean atualizar(Pedido pedido) throws SQLException {
        String sql = "UPDATE pedido SET id_usuario = ?, data = ?, total = ? WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, pedido.getIdCliente());
            stmt.setDate(2, pedido.getData() == null ? null : Date.valueOf(pedido.getData()));
            stmt.setBigDecimal(3, pedido.getTotal());
            stmt.setInt(4, pedido.getId());
            return stmt.executeUpdate() > 0;
        }
    }

    @Override
    public boolean deletar(int id) throws SQLException {
        String sqlItens = "DELETE FROM item_pedido WHERE id_pedido = ?";
        String sqlPedido = "DELETE FROM pedido WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection()) {
            try {
                conn.setAutoCommit(false);
                try (PreparedStatement stmtItens = conn.prepareStatement(sqlItens);
                     PreparedStatement stmtPedido = conn.prepareStatement(sqlPedido)) {
                    stmtItens.setInt(1, id);
                    stmtItens.executeUpdate();

                    stmtPedido.setInt(1, id);
                    boolean deletou = stmtPedido.executeUpdate() > 0;
                    conn.commit();
                    return deletou;
                }
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    public void listarPedidos() throws SQLException {
        String sql = """
                SELECT p.id, p.data, p.total, c.nome AS cliente
                FROM pedido p
                LEFT JOIN usuario c ON c.id = p.id_usuario
                ORDER BY p.id DESC
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            boolean encontrou = false;
            while (rs.next()) {
                encontrou = true;
                System.out.println("Pedido #" + rs.getInt("id")
                        + " | Cliente: " + rs.getString("cliente")
                        + " | Data: " + rs.getDate("data")
                        + " | Total: R$ " + rs.getBigDecimal("total"));
                listarItensDoPedido(conn, rs.getInt("id"));
                System.out.println();
            }

            if (!encontrou) {
                System.out.println("Nenhum pedido cadastrado.");
            }
        }
    }

    private int inserirPedido(Connection conn, String sql, Pedido pedido) throws SQLException {
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, pedido.getIdCliente());
            stmt.setDate(2, Date.valueOf(pedido.getData()));
            stmt.setBigDecimal(3, pedido.getTotal());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }

        throw new SQLException("Não foi possível obter o ID do pedido criado.");
    }

    private void inserirItens(Connection conn, String sql, int idPedido, Pedido pedido) throws SQLException {
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (ItemPedido item : pedido.getItens()) {
                stmt.setInt(1, idPedido);
                stmt.setInt(2, item.getProduto().getId());
                stmt.setInt(3, item.getQuantidade());
                stmt.setBigDecimal(4, item.getPrecoUnitario());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void listarItensDoPedido(Connection conn, int idPedido) throws SQLException {
        String sql = """
                SELECT ip.quantidade, ip.preco_unitario, pr.nome
                FROM item_pedido ip
                INNER JOIN produto pr ON pr.id = ip.id_produto
                WHERE ip.id_pedido = ?
                """;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idPedido);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    System.out.println("  - " + rs.getString("nome")
                            + " | qtd: " + rs.getInt("quantidade")
                            + " | unitário: R$ " + rs.getBigDecimal("preco_unitario"));
                }
            }
        }
    }

    private Pedido montarPedido(ResultSet rs) throws SQLException {
        Pedido pedido = new Pedido();
        pedido.setId(rs.getInt("id"));
        pedido.setIdCliente(rs.getInt("id_usuario"));
        Date data = rs.getDate("data");
        if (data != null) {
            pedido.setData(data.toLocalDate());
        }
        pedido.setTotal(rs.getBigDecimal("total"));
        return pedido;
    }
}
