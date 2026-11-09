package com.loja.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa um pedido com cliente, data, total e itens.
 */
public class Pedido {

    private int id;
    private int idCliente;
    private LocalDate data;
    private BigDecimal total = BigDecimal.ZERO;
    private List<ItemPedido> itens = new ArrayList<>();

    public Pedido() {
    }

    public Pedido(int idCliente) {
        this.idCliente = idCliente;
        this.data = LocalDate.now();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }

    public void adicionarItem(ItemPedido item) {
        itens.add(item);
        total = total.add(item.getSubtotal());
    }
}
