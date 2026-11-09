package com.loja.dao;

import com.loja.model.CustoProduto;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO com CRUD da tabela custo_produto.
 */
public class CustoProdutoDAO implements CrudDAO<CustoProduto> {

    @Override
    public void inserir(CustoProduto custoProduto) throws SQLException {
        String sql = "INSERT INTO custo_produto (id_produto, custo, data_atualizacao) VALUES (?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, custoProduto.getIdProduto());
            stmt.setBigDecimal(2, custoProduto.getCusto());
            stmt.setDate(3, custoProduto.getDataAtualizacao() == null ? null : Date.valueOf(custoProduto.getDataAtualizacao()));
            stmt.executeUpdate();
        }
    }

    @Override
    public CustoProduto buscarPorId(int id) throws SQLException {
        String sql = "SELECT id, id_produto, custo, data_atualizacao FROM custo_produto WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return montarCustoProduto(rs);
                }
            }
        }

        return null;
    }

    @Override
    public List<CustoProduto> listarTodos() throws SQLException {
        String sql = "SELECT id, id_produto, custo, data_atualizacao FROM custo_produto ORDER BY id";
        List<CustoProduto> custos = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                custos.add(montarCustoProduto(rs));
            }
        }

        return custos;
    }

    @Override
    public boolean atualizar(CustoProduto custoProduto) throws SQLException {
        String sql = "UPDATE custo_produto SET id_produto = ?, custo = ?, data_atualizacao = ? WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, custoProduto.getIdProduto());
            stmt.setBigDecimal(2, custoProduto.getCusto());
            stmt.setDate(3, custoProduto.getDataAtualizacao() == null ? null : Date.valueOf(custoProduto.getDataAtualizacao()));
            stmt.setInt(4, custoProduto.getId());
            return stmt.executeUpdate() > 0;
        }
    }

    @Override
    public boolean deletar(int id) throws SQLException {
        String sql = "DELETE FROM custo_produto WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    private CustoProduto montarCustoProduto(ResultSet rs) throws SQLException {
        CustoProduto custoProduto = new CustoProduto();
        custoProduto.setId(rs.getInt("id"));
        custoProduto.setIdProduto(rs.getInt("id_produto"));
        custoProduto.setCusto(rs.getBigDecimal("custo"));
        Date data = rs.getDate("data_atualizacao");
        if (data != null) {
            custoProduto.setDataAtualizacao(data.toLocalDate());
        }
        return custoProduto;
    }
}
