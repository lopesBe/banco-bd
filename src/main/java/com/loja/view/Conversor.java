package com.loja.view;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

/**
 * Conversões simples usadas pelos formulários.
 */
public class Conversor {

    private Conversor() {
    }

    public static int inteiro(Map<String, String> valores, String chave) {
        String valor = valores.get(chave);
        if (valor == null || valor.isBlank()) {
            return 0;
        }
        return Integer.parseInt(valor);
    }

    public static BigDecimal decimal(Map<String, String> valores, String chave) {
        String valor = valores.get(chave);
        if (valor == null || valor.isBlank()) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal(valor.replace(",", "."));
    }

    public static LocalDate data(Map<String, String> valores, String chave) {
        String valor = valores.get(chave);
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return LocalDate.parse(valor);
    }

    public static String texto(Map<String, String> valores, String chave) {
        return valores.getOrDefault(chave, "");
    }

    public static String str(Object valor) {
        return valor == null ? "" : valor.toString();
    }
}
