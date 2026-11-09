package com.loja.dao;

import com.loja.model.Produto;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO com consultas da tabela produto.
 */
public class ProdutoDAO implements CrudDAO<Produto> {

    @Override
    public void inserir(Produto produto) throws SQLException {
        String sql = "INSERT INTO produto (nome, preco, id_fornecedor, sku) VALUES (?, ?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, produto.getNome());
            stmt.setBigDecimal(2, produto.getPreco());
            definirFornecedor(stmt, 3, produto.getIdFornecedor());
            stmt.setString(4, "SKU-" + java.util.UUID.randomUUID().toString().substring(0, 12).toUpperCase());
            stmt.executeUpdate();
        }
    }

    @Override
    public List<Produto> listarTodos() throws SQLException {
        String sql = "SELECT id, nome, preco, id_fornecedor FROM produto ORDER BY id";
        List<Produto> produtos = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                produtos.add(montarProduto(rs));
            }
        }

        return produtos;
    }

    @Override
    public Produto buscarPorId(int id) throws SQLException {
        String sql = "SELECT id, nome, preco, id_fornecedor FROM produto WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return montarProduto(rs);
                }
            }
        }

        return null;
    }

    @Override
    public boolean atualizar(Produto produto) throws SQLException {
        String sql = "UPDATE produto SET nome = ?, preco = ?, id_fornecedor = ? WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, produto.getNome());
            stmt.setBigDecimal(2, produto.getPreco());
            definirFornecedor(stmt, 3, produto.getIdFornecedor());
            stmt.setInt(4, produto.getId());
            return stmt.executeUpdate() > 0;
        }
    }

    @Override
    public boolean deletar(int id) throws SQLException {
        String sql = "DELETE FROM produto WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    /**
     * No novo schema o fornecedor é opcional (FK anulável): id 0 significa "sem fornecedor".
     */
    private void definirFornecedor(PreparedStatement stmt, int indice, int idFornecedor) throws SQLException {
        if (idFornecedor > 0) {
            stmt.setInt(indice, idFornecedor);
        } else {
            stmt.setNull(indice, java.sql.Types.INTEGER);
        }
    }

    private Produto montarProduto(ResultSet rs) throws SQLException {
        Produto produto = new Produto();
        produto.setId(rs.getInt("id"));
        produto.setNome(rs.getString("nome"));
        produto.setPreco(rs.getBigDecimal("preco"));
        produto.setIdFornecedor(rs.getInt("id_fornecedor"));
        return produto;
    }
}
