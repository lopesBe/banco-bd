package com.loja.view;

/**
 * Define um campo exibido no formulário do CRUD.
 */
public class CampoFormulario {

    private final String chave;
    private final String rotulo;
    private final boolean editavel;

    public CampoFormulario(String chave, String rotulo, boolean editavel) {
        this.chave = chave;
        this.rotulo = rotulo;
        this.editavel = editavel;
    }

    public String getChave() {
        return chave;
    }

    public String getRotulo() {
        return rotulo;
    }

    public boolean isEditavel() {
        return editavel;
    }
}
