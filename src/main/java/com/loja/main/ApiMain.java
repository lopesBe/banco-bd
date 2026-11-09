package com.loja.main;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.loja.api.CheckoutController;
import com.loja.api.LocalDateAdapter;
import com.loja.api.ResourceController;
import com.loja.dao.ClienteDAO;
import com.loja.dao.CustoProdutoDAO;
import com.loja.dao.FornecedorDAO;
import com.loja.dao.ItemPedidoDAO;
import com.loja.dao.PedidoDAO;
import com.loja.dao.ProdutoDAO;
import com.loja.model.Cliente;
import com.loja.model.CustoProduto;
import com.loja.model.Fornecedor;
import com.loja.model.ItemPedido;
import com.loja.model.Pedido;
import com.loja.model.Produto;

import java.time.LocalDate;

import static spark.Spark.after;
import static spark.Spark.before;
import static spark.Spark.options;
import static spark.Spark.port;
import static spark.Spark.staticFiles;

/**
 * Ponto de entrada da API REST do Gestão Loja.
 */
public class ApiMain {

    public static void main(String[] args) {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
                .create();

        port(7000);
        staticFiles.externalLocation("frontend");
        configurarCors();

        new ResourceController<>("/api/cliente", new ClienteDAO(), Cliente.class, gson, Cliente::setId).registrarRotas();
        new ResourceController<>("/api/produto", new ProdutoDAO(), Produto.class, gson, Produto::setId).registrarRotas();
        new ResourceController<>("/api/fornecedor", new FornecedorDAO(), Fornecedor.class, gson, Fornecedor::setId).registrarRotas();
        new ResourceController<>("/api/custo_produto", new CustoProdutoDAO(), CustoProduto.class, gson, CustoProduto::setId).registrarRotas();
        new ResourceController<>("/api/item_pedido", new ItemPedidoDAO(), ItemPedido.class, gson, ItemPedido::setId).registrarRotas();
        new ResourceController<>("/api/pedido", new PedidoDAO(), Pedido.class, gson, Pedido::setId).registrarRotas();
        new CheckoutController(gson).registrarRotas();

        System.out.println("API do Gestão Loja iniciada em http://localhost:7000");
    }

    private static void configurarCors() {
        options("/*", (req, res) -> {
            String headers = req.headers("Access-Control-Request-Headers");
            if (headers != null) {
                res.header("Access-Control-Allow-Headers", headers);
            }

            String method = req.headers("Access-Control-Request-Method");
            if (method != null) {
                res.header("Access-Control-Allow-Methods", method);
            }
            return "OK";
        });

        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type");
        });

        after((req, res) -> res.type("application/json"));
    }
}
