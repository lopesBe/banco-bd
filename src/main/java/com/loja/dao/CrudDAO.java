package com.loja.dao;

import java.sql.SQLException;
import java.util.List;

/**
 * Contrato básico de CRUD usado pelas telas Swing.
 */
public interface CrudDAO<T> {

    void inserir(T entidade) throws SQLException;

    T buscarPorId(int id) throws SQLException;

    List<T> listarTodos() throws SQLException;

    boolean atualizar(T entidade) throws SQLException;

    boolean deletar(int id) throws SQLException;
}
