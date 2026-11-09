package com.loja.dao;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Classe responsável por abrir conexões JDBC com o banco PostgreSQL (Smart-Base).
 *
 * URL, usuário e senha são lidos das variáveis de ambiente DB_URL, DB_USER e DB_PASSWORD.
 * Se não existirem, o arquivo .env da raiz do projeto é usado como alternativa
 * (útil ao executar pela IDE ou por "mvn exec:java").
 */
public class ConnectionFactory {

    private static final Map<String, String> ARQUIVO_ENV = carregarArquivoEnv();

    private static final String URL = config("DB_URL", "jdbc:postgresql://localhost:5433/smartbase");
    private static final String USUARIO = config("DB_USER", "smartbase");
    private static final String SENHA = config("DB_PASSWORD", "smartbase_dev_123");

    private ConnectionFactory() {
        // Evita criar objetos desta classe, pois ela só fornece conexão.
    }

    public static Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(URL, USUARIO, SENHA);
        } catch (SQLException e) {
            System.out.println("Erro ao conectar no PostgreSQL: " + URL);
            System.out.println("Confira se o container está ligado (docker-compose up -d) e se DB_URL/DB_USER/DB_PASSWORD estão corretos.");
            throw e;
        }
    }

    private static String config(String chave, String padrao) {
        String valor = System.getenv(chave);
        if (valor == null || valor.isBlank()) {
            valor = ARQUIVO_ENV.get(chave);
        }
        return (valor == null || valor.isBlank()) ? padrao : valor.trim();
    }

    private static Map<String, String> carregarArquivoEnv() {
        Map<String, String> valores = new HashMap<>();
        Path arquivo = Path.of(".env");
        if (!Files.isRegularFile(arquivo)) {
            return valores;
        }
        try {
            List<String> linhas = Files.readAllLines(arquivo, StandardCharsets.UTF_8);
            for (String linha : linhas) {
                String texto = linha.trim();
                int igual = texto.indexOf('=');
                if (texto.isEmpty() || texto.startsWith("#") || igual < 1) {
                    continue;
                }
                valores.put(texto.substring(0, igual).trim(), texto.substring(igual + 1).trim());
            }
        } catch (IOException e) {
            System.out.println("Não foi possível ler o arquivo .env: " + e.getMessage());
        }
        return valores;
    }
}
