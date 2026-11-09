package com.loja.main;

import com.loja.view.MainFrame;

import javax.swing.SwingUtilities;

/**
 * Classe principal que abre a interface gráfica Swing.
 */
public class Main {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MainFrame().setVisible(true));
    }
}
