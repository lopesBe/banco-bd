package com.loja.view;

import com.loja.dao.CrudDAO;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.table.DefaultTableModel;
import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Painel genérico para CRUD simples com JTable e formulário.
 */
public class CrudPanel<T> extends JPanel {

    @FunctionalInterface
    public interface MontadorEntidade<T> {
        T montar(Map<String, String> valores) throws Exception;
    }

    @FunctionalInterface
    public interface ExtratorValores<T> {
        String[] extrair(T entidade);
    }

    private final CrudDAO<T> dao;
    private final CampoFormulario[] campos;
    private final MontadorEntidade<T> montador;
    private final ExtratorValores<T> extrator;
    private final JTable tabela;
    private final DefaultTableModel modeloTabela;
    private final Map<String, JTextField> camposTexto = new HashMap<>();
    private final JTextField campoPesquisa = new JTextField(8);

    public CrudPanel(String[] colunas, CampoFormulario[] campos, CrudDAO<T> dao,
                     MontadorEntidade<T> montador, ExtratorValores<T> extrator) {
        this.campos = campos;
        this.dao = dao;
        this.montador = montador;
        this.extrator = extrator;

        setLayout(new BorderLayout(8, 8));
        modeloTabela = new DefaultTableModel(colunas, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        tabela = new JTable(modeloTabela);
        tabela.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tabela.getSelectionModel().addListSelectionListener(e -> preencherFormularioSelecionado());

        add(criarPainelPesquisa(), BorderLayout.NORTH);
        add(new JScrollPane(tabela), BorderLayout.CENTER);
        add(criarPainelFormulario(), BorderLayout.SOUTH);

        atualizarLista();
    }

    private JPanel criarPainelPesquisa() {
        JPanel painel = new JPanel();
        JButton btnPesquisar = new JButton("Pesquisar por ID");
        JButton btnAtualizar = new JButton("Atualizar Lista");

        btnPesquisar.addActionListener(e -> pesquisarPorId());
        btnAtualizar.addActionListener(e -> atualizarLista());

        painel.add(new JLabel("ID:"));
        painel.add(campoPesquisa);
        painel.add(btnPesquisar);
        painel.add(btnAtualizar);
        return painel;
    }

    private JPanel criarPainelFormulario() {
        JPanel container = new JPanel(new BorderLayout(8, 8));
        JPanel formulario = new JPanel(new GridLayout(0, 2, 6, 6));
        JPanel botoes = new JPanel();

        for (CampoFormulario campo : campos) {
            JTextField textField = new JTextField();
            textField.setEditable(campo.isEditavel());
            camposTexto.put(campo.getChave(), textField);
            formulario.add(new JLabel(campo.getRotulo()));
            formulario.add(textField);
        }

        JButton btnAdicionar = new JButton("Adicionar");
        JButton btnEditar = new JButton("Editar");
        JButton btnDeletar = new JButton("Deletar");
        JButton btnLimpar = new JButton("Limpar");

        btnAdicionar.addActionListener(e -> adicionar());
        btnEditar.addActionListener(e -> editar());
        btnDeletar.addActionListener(e -> deletar());
        btnLimpar.addActionListener(e -> limparFormulario());

        botoes.add(btnAdicionar);
        botoes.add(btnEditar);
        botoes.add(btnDeletar);
        botoes.add(btnLimpar);

        container.add(formulario, BorderLayout.CENTER);
        container.add(botoes, BorderLayout.SOUTH);
        return container;
    }

    private void adicionar() {
        try {
            dao.inserir(montarEntidade());
            mostrarInfo("Registro adicionado com sucesso.");
            limparFormulario();
            atualizarLista();
        } catch (Exception e) {
            mostrarErro("Erro ao adicionar: " + e.getMessage());
        }
    }

    private void editar() {
        try {
            if (campoVazio("id")) {
                mostrarErro("Selecione ou pesquise um registro antes de editar.");
                return;
            }
            boolean alterou = dao.atualizar(montarEntidade());
            if (!alterou) {
                mostrarErro("Registro não encontrado para edição.");
                return;
            }
            mostrarInfo("Registro editado com sucesso.");
            atualizarLista();
        } catch (Exception e) {
            mostrarErro("Erro ao editar: " + e.getMessage());
        }
    }

    private void deletar() {
        try {
            if (campoVazio("id")) {
                mostrarErro("Selecione ou pesquise um registro antes de deletar.");
                return;
            }

            int confirmacao = JOptionPane.showConfirmDialog(this,
                    "Deseja realmente deletar este registro?",
                    "Confirmar exclusão",
                    JOptionPane.YES_NO_OPTION);
            if (confirmacao != JOptionPane.YES_OPTION) {
                return;
            }

            int id = Integer.parseInt(camposTexto.get("id").getText());
            boolean deletou = dao.deletar(id);
            if (!deletou) {
                mostrarErro("Registro não encontrado para exclusão.");
                return;
            }
            mostrarInfo("Registro deletado com sucesso.");
            limparFormulario();
            atualizarLista();
        } catch (Exception e) {
            mostrarErro("Erro ao deletar: " + e.getMessage());
        }
    }

    private void pesquisarPorId() {
        try {
            if (campoPesquisa.getText().trim().isEmpty()) {
                mostrarErro("Digite um ID para pesquisar.");
                return;
            }

            int id = Integer.parseInt(campoPesquisa.getText().trim());
            T entidade = dao.buscarPorId(id);
            modeloTabela.setRowCount(0);
            if (entidade == null) {
                mostrarErro("Registro não encontrado.");
                return;
            }
            modeloTabela.addRow(extrator.extrair(entidade));
            tabela.setRowSelectionInterval(0, 0);
        } catch (NumberFormatException e) {
            mostrarErro("ID precisa ser um número inteiro.");
        } catch (SQLException e) {
            mostrarErro("Erro ao pesquisar: " + e.getMessage());
        }
    }

    private void atualizarLista() {
        try {
            modeloTabela.setRowCount(0);
            List<T> registros = dao.listarTodos();
            for (T registro : registros) {
                modeloTabela.addRow(extrator.extrair(registro));
            }
        } catch (SQLException e) {
            mostrarErro("Erro ao carregar lista: " + e.getMessage());
        }
    }

    private void preencherFormularioSelecionado() {
        int linha = tabela.getSelectedRow();
        if (linha < 0) {
            return;
        }

        for (int i = 0; i < campos.length; i++) {
            Object valor = modeloTabela.getValueAt(linha, i);
            camposTexto.get(campos[i].getChave()).setText(valor == null ? "" : valor.toString());
        }
    }

    private T montarEntidade() throws Exception {
        Map<String, String> valores = new HashMap<>();
        for (CampoFormulario campo : campos) {
            JTextField textField = camposTexto.get(campo.getChave());
            valores.put(campo.getChave(), textField.getText().trim());
        }
        return montador.montar(valores);
    }

    private boolean campoVazio(String chave) {
        JTextField campo = camposTexto.get(chave);
        return campo == null || campo.getText().trim().isEmpty();
    }

    private void limparFormulario() {
        camposTexto.values().forEach(campo -> campo.setText(""));
        tabela.clearSelection();
        campoPesquisa.setText("");
    }

    private void mostrarInfo(String mensagem) {
        JOptionPane.showMessageDialog(this, mensagem, "Informação", JOptionPane.INFORMATION_MESSAGE);
    }

    private void mostrarErro(String mensagem) {
        JOptionPane.showMessageDialog(this, mensagem, "Erro", JOptionPane.ERROR_MESSAGE);
    }
}
