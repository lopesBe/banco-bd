package com.loja.api;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.loja.dao.ConnectionFactory;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static spark.Spark.post;

/**
 * Endpoint de checkout da loja pública.
 */
public class CheckoutController {

    private final Gson gson;

    public CheckoutController(Gson gson) {
        this.gson = gson;
    }

    public void registrarRotas() {
        post("/api/checkout", (req, res) -> {
            res.type("application/json");
            try {
                CheckoutRequest checkout = gson.fromJson(req.body(), CheckoutRequest.class);
                CheckoutResponse resposta = finalizarCheckout(checkout);
                System.out.println("Checkout criado com sucesso. Pedido ID: " + resposta.idPedido);
                return gson.toJson(resposta);
            } catch (JsonSyntaxException | IllegalArgumentException e) {
                res.status(400);
                return gson.toJson(new ApiResponse("Dados inválidos: " + e.getMessage()));
            } catch (SQLException e) {
                res.status(e.getSQLState() != null && e.getSQLState().startsWith("23") ? 400 : 500);
                return gson.toJson(new ApiResponse("Erro ao finalizar compra: " + e.getMessage()));
            }
        });
    }

    private CheckoutResponse finalizarCheckout(CheckoutRequest checkout) throws SQLException {
        validar(checkout);

        try (Connection conn = ConnectionFactory.getConnection()) {
            try {
                conn.setAutoCommit(false);
                int idCliente = obterOuCriarCliente(conn, checkout.cliente);
                List<ItemCalculado> itens = calcularItens(conn, checkout.itens);
                BigDecimal total = itens.stream()
                        .map(ItemCalculado::subtotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                int idPedido = criarPedido(conn, idCliente, total);
                criarItensPedido(conn, idPedido, itens);
                conn.commit();
                return new CheckoutResponse(idPedido, idCliente, total);
            } catch (SQLException | RuntimeException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    private void validar(CheckoutRequest checkout) {
        if (checkout == null || checkout.cliente == null) {
            throw new IllegalArgumentException("Cliente não informado.");
        }
        if (vazio(checkout.cliente.nome) || vazio(checkout.cliente.email) || vazio(checkout.cliente.cidade)) {
            throw new IllegalArgumentException("Informe nome, email e cidade.");
        }
        if (checkout.itens == null || checkout.itens.isEmpty()) {
            throw new IllegalArgumentException("Carrinho vazio.");
        }
    }

    private int obterOuCriarCliente(Connection conn, ClienteCheckout cliente) throws SQLException {
        String sqlBusca = "SELECT id, cidade FROM usuario WHERE LOWER(email) = LOWER(?) LIMIT 1";
        try (PreparedStatement stmt = conn.prepareStatement(sqlBusca)) {
            stmt.setString(1, cliente.email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    int idCliente = rs.getInt("id");
                    String cidadeAtual = rs.getString("cidade");
                    if (vazio(cidadeAtual)) {
                        atualizarCidadeCliente(conn, idCliente, cliente.cidade);
                    }
                    return idCliente;
                }
            }
        }

        String sqlInsert = "INSERT INTO usuario (nome, email, cidade, papel) VALUES (?, ?, ?, 'CLIENTE')";
        try (PreparedStatement stmt = conn.prepareStatement(sqlInsert, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, cliente.nome);
            stmt.setString(2, cliente.email);
            stmt.setString(3, cliente.cidade);
            stmt.executeUpdate();
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        throw new SQLException("Não foi possível obter o ID do cliente.");
    }

    private void atualizarCidadeCliente(Connection conn, int idCliente, String cidade) throws SQLException {
        String sql = "UPDATE usuario SET cidade = ? WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cidade);
            stmt.setInt(2, idCliente);
            stmt.executeUpdate();
        }
    }

    private List<ItemCalculado> calcularItens(Connection conn, List<ItemCheckout> itens) throws SQLException {
        List<ItemCalculado> calculados = new ArrayList<>();
        String sql = "SELECT id, nome, preco FROM produto WHERE id = ?";
        for (ItemCheckout item : itens) {
            if (item.quantidade <= 0) {
                throw new IllegalArgumentException("Quantidade inválida.");
            }
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, item.idProduto);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (!rs.next()) {
                        throw new IllegalArgumentException("Produto não encontrado: " + item.idProduto);
                    }
                    calculados.add(new ItemCalculado(
                            rs.getInt("id"),
                            item.quantidade,
                            rs.getBigDecimal("preco")));
                }
            }
        }
        return calculados;
    }

    private int criarPedido(Connection conn, int idCliente, BigDecimal total) throws SQLException {
        String sql = "INSERT INTO pedido (id_usuario, data, total) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, idCliente);
            stmt.setDate(2, Date.valueOf(LocalDate.now()));
            stmt.setBigDecimal(3, total);
            stmt.executeUpdate();
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        throw new SQLException("Não foi possível obter o ID do pedido.");
    }

    private void criarItensPedido(Connection conn, int idPedido, List<ItemCalculado> itens) throws SQLException {
        String sql = "INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (ItemCalculado item : itens) {
                stmt.setInt(1, idPedido);
                stmt.setInt(2, item.idProduto);
                stmt.setInt(3, item.quantidade);
                stmt.setBigDecimal(4, item.precoUnitario);
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private boolean vazio(String texto) {
        return texto == null || texto.trim().isEmpty();
    }

    private static class CheckoutRequest {
        ClienteCheckout cliente;
        List<ItemCheckout> itens;
    }

    private static class ClienteCheckout {
        String nome;
        String email;
        String cidade;
    }

    private static class ItemCheckout {
        int idProduto;
        int quantidade;
    }

    private static class ItemCalculado {
        int idProduto;
        int quantidade;
        BigDecimal precoUnitario;

        ItemCalculado(int idProduto, int quantidade, BigDecimal precoUnitario) {
            this.idProduto = idProduto;
            this.quantidade = quantidade;
            this.precoUnitario = precoUnitario;
        }

        BigDecimal subtotal() {
            return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
        }
    }

    private static class CheckoutResponse {
        int idPedido;
        int idCliente;
        BigDecimal total;
        String mensagem = "Pedido realizado com sucesso!";

        CheckoutResponse(int idPedido, int idCliente, BigDecimal total) {
            this.idPedido = idPedido;
            this.idCliente = idCliente;
            this.total = total;
        }
    }
}
