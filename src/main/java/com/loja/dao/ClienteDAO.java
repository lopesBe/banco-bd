package com.loja.dao;

import com.loja.model.Cliente;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO com operações básicas da tabela usuario (papel CLIENTE).
 */
public class ClienteDAO implements CrudDAO<Cliente> {

    @Override
    public void inserir(Cliente cliente) throws SQLException {
        cadastrar(cliente);
    }

    public void cadastrar(Cliente cliente) throws SQLException {
        String sql = "INSERT INTO usuario (nome, email, cidade, papel) VALUES (?, ?, ?, 'CLIENTE')";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, cliente.getNome());
            stmt.setString(2, cliente.getEmail());
            stmt.setString(3, cliente.getCidade());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    cliente.setId(rs.getInt(1));
                }
            }
        }
    }

    @Override
    public List<Cliente> listarTodos() throws SQLException {
        String sql = "SELECT id, nome, email, cidade, created_at::date AS data_cadastro FROM usuario WHERE papel = 'CLIENTE' ORDER BY id";
        List<Cliente> clientes = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Cliente cliente = new Cliente();
                cliente.setId(rs.getInt("id"));
                cliente.setNome(rs.getString("nome"));
                cliente.setEmail(rs.getString("email"));
                cliente.setCidade(rs.getString("cidade"));
                Date data = rs.getDate("data_cadastro");
                if (data != null) {
                    cliente.setDataCadastro(data.toLocalDate());
                }
                clientes.add(cliente);
            }
        }

        return clientes;
    }

    @Override
    public Cliente buscarPorId(int id) throws SQLException {
        String sql = "SELECT id, nome, email, cidade, created_at::date AS data_cadastro FROM usuario WHERE id = ? AND papel = 'CLIENTE'";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return montarCliente(rs);
                }
            }
        }

        return null;
    }

    @Override
    public boolean atualizar(Cliente cliente) throws SQLException {
        String sql = "UPDATE usuario SET nome = ?, email = ?, cidade = ?, updated_at = NOW() WHERE id = ? AND papel = 'CLIENTE'";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cliente.getNome());
            stmt.setString(2, cliente.getEmail());
            stmt.setString(3, cliente.getCidade());
            stmt.setInt(4, cliente.getId());
            return stmt.executeUpdate() > 0;
        }
    }

    @Override
    public boolean deletar(int id) throws SQLException {
        String sql = "DELETE FROM usuario WHERE id = ? AND papel = 'CLIENTE'";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    public boolean existePorId(int id) throws SQLException {
        String sql = "SELECT id FROM usuario WHERE id = ? AND papel = 'CLIENTE'";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    private Cliente montarCliente(ResultSet rs) throws SQLException {
        Cliente cliente = new Cliente();
        cliente.setId(rs.getInt("id"));
        cliente.setNome(rs.getString("nome"));
        cliente.setEmail(rs.getString("email"));
        cliente.setCidade(rs.getString("cidade"));
        Date data = rs.getDate("data_cadastro");
        if (data != null) {
            cliente.setDataCadastro(data.toLocalDate());
        }
        return cliente;
    }
}
