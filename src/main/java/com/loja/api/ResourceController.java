package com.loja.api;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.loja.dao.CrudDAO;

import java.sql.SQLException;
import java.util.function.BiConsumer;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

/**
 * Controller REST genérico para entidades com CRUD básico.
 */
public class ResourceController<T> {

    private final String rota;
    private final CrudDAO<T> dao;
    private final Class<T> classe;
    private final Gson gson;
    private final BiConsumer<T, Integer> definirId;

    public ResourceController(String rota, CrudDAO<T> dao, Class<T> classe,
                              Gson gson, BiConsumer<T, Integer> definirId) {
        this.rota = rota;
        this.dao = dao;
        this.classe = classe;
        this.gson = gson;
        this.definirId = definirId;
    }

    public void registrarRotas() {
        get(rota, (req, res) -> {
            res.type("application/json");
            try {
                return gson.toJson(dao.listarTodos());
            } catch (SQLException e) {
                res.status(500);
                return erro("Erro ao listar registros: " + e.getMessage());
            }
        });

        get(rota + "/:id", (req, res) -> {
            res.type("application/json");
            try {
                T entidade = dao.buscarPorId(id(req.params(":id")));
                if (entidade == null) {
                    res.status(404);
                    return erro("Registro não encontrado.");
                }
                return gson.toJson(entidade);
            } catch (NumberFormatException e) {
                res.status(400);
                return erro("ID inválido.");
            } catch (SQLException e) {
                res.status(500);
                return erro("Erro ao buscar registro: " + e.getMessage());
            }
        });

        post(rota, (req, res) -> {
            res.type("application/json");
            try {
                T entidade = gson.fromJson(req.body(), classe);
                dao.inserir(entidade);
                res.status(201);
                return gson.toJson(entidade);
            } catch (JsonSyntaxException | IllegalArgumentException e) {
                res.status(400);
                return erro("JSON inválido: " + e.getMessage());
            } catch (SQLException e) {
                res.status(statusSql(e));
                return erro("Erro ao criar registro: " + e.getMessage());
            }
        });

        put(rota + "/:id", (req, res) -> {
            res.type("application/json");
            try {
                int id = id(req.params(":id"));
                T entidade = gson.fromJson(req.body(), classe);
                definirId.accept(entidade, id);
                boolean atualizou = dao.atualizar(entidade);
                if (!atualizou) {
                    res.status(404);
                    return erro("Registro não encontrado para edição.");
                }
                return gson.toJson(new ApiResponse("Registro atualizado com sucesso."));
            } catch (NumberFormatException e) {
                res.status(400);
                return erro("ID inválido.");
            } catch (JsonSyntaxException | IllegalArgumentException e) {
                res.status(400);
                return erro("JSON inválido: " + e.getMessage());
            } catch (SQLException e) {
                res.status(statusSql(e));
                return erro("Erro ao editar registro: " + e.getMessage());
            }
        });

        delete(rota + "/:id", (req, res) -> {
            res.type("application/json");
            try {
                boolean deletou = dao.deletar(id(req.params(":id")));
                if (!deletou) {
                    res.status(404);
                    return erro("Registro não encontrado para exclusão.");
                }
                return gson.toJson(new ApiResponse("Registro deletado com sucesso."));
            } catch (NumberFormatException e) {
                res.status(400);
                return erro("ID inválido.");
            } catch (SQLException e) {
                res.status(statusSql(e));
                return erro("Erro ao deletar registro: " + e.getMessage());
            }
        });
    }

    private int id(String valor) {
        return Integer.parseInt(valor);
    }

    private int statusSql(SQLException e) {
        return "23000".equals(e.getSQLState()) ? 400 : 500;
    }

    private String erro(String mensagem) {
        return gson.toJson(new ApiResponse(mensagem));
    }
}
