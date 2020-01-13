import React from 'react'

const NotaFiscal = () => {
    return (
        <>
            <div class="reciept-container" style={{ margin: 0, left: 0, maxWidth: "300px", height: "100%", background: "#fff", boxShadow: "5px 5px 19px #ccc", fontFamily: "VT323, monospace", padding: "10px", }}>
                <h1 class="company-name" style={{ textAlign: "center", fontWeight: "bold" }}>reflow</h1>
                <div class="address" style={{ textAlign: "center", marginBottom: "10px" }}>Rua Frei Caneca</div>
                <div class="header-info" style={{ borderBottom: "1px black dashed", borderTop: "1px black dashed" }}>
                    <div class="header-date" style={{ display: "inline-block" }}>08/01/2020</div>
                    <div class="header-hour" style={{ display: "inline-block" }}>15:27</div>
                </div>
                <div class="invoice-container">
                    <div class="invoice-header">
                        <p style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>Descrição da compra</p>
                    </div>
                    <div class="table-container" style={{ borderBottom: "1px black dashed", overflowX: "auto" }}>
                        <table class="table table-hover invoice-products-container" style={{ margin: 0 }}>
                            <thead>
                                <tr>
                                    <th>Qtd.</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>3</td><td>Por Usuário</td><td>R$120</td></tr><tr><td>5</td><td>GBs de Armazenamento</td><td>R$0</td></tr></tbody>
                        </table>
                    </div>
                    <div class="discount-container" style={{ borderBottom: "1px black dashed", display: "none" }}>
                        <div class="discount-header">
                            <p style={{ textAlign: "center", fontWeight: "bold", padding: "10px", margin: "0" }}>Descontos</p>
                        </div>
                        <div class="discount-content">
                            <p class="discount-total-value" style={{ textAlign: "center", margin: "0 0 10px 0" }}></p>
                        </div>
                    </div>
                    <h3 class="invoice-total-label" style={{ textAlign: "center", margin: "10px 0 0 0" }}>Total</h3>
                    <h1 class="invoice-total-value" style={{ textAlign: "center", margin: "0" }}>R$120</h1>
                </div>
            </div>
        </>
    )
}

export default NotaFiscal;