package com.loja.view;

import javax.swing.JFrame;
import javax.swing.JTabbedPane;
import java.awt.BorderLayout;

/**
 * Janela principal com uma aba para cada tabela do banco.
 */
public class MainFrame extends JFrame {

    public MainFrame() {
        setTitle("Gestão Loja");
        setSize(900, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        JTabbedPane abas = new JTabbedPane();
        abas.addTab("Cliente", new ClientePanel());
        abas.addTab("Produto", new ProdutoPanel());
        abas.addTab("Fornecedor", new FornecedorPanel());
        abas.addTab("Custo Produto", new CustoProdutoPanel());
        abas.addTab("Item Pedido", new ItemPedidoPanel());
        abas.addTab("Pedido", new PedidoPanel());

        add(abas, BorderLayout.CENTER);
    }
}
