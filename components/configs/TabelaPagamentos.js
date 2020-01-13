import React from 'react'
import { Table, Button } from 'react-bootstrap'
const TabelaPagamentos = () => {
    return (
        <>
            <h1>Empresa</h1>
            <Button>Editar</Button>
            <Table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Valor</th>
                        <th>Opção</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>5 GB de armazenamento</td>
                        <td>R$ 5,00</td>
                        <td>
                            <div class="radio">
                                <input type="radio" id='regular' name="opcaoradio" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>10 GB de armazenamento</td>
                        <td>R$ 9,00</td>
                        <td>
                            <div class="radio">
                                <input type="radio" id='regular' name="opcaoradio" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>20 GB de armazenamento</td>
                        <td>R$ 15,00</td>
                        <td>
                            <div class="radio">
                                <input type="radio" id='regular' name="opcaoradio" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <h1>Usuários</h1>
            <Button>Editar</Button>
            <Table>
                <thead>
                    <tr>
                        <th>Usuário</th>
                        <th>Valor</th>
                        <th>Dashboard</th>
                        <th>API</th>
                        <th>Automatizações</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Lucas Leal de Melo</td>
                        <td>R$ 55,00</td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Patrícia do Santos Bená</td>
                        <td>R$ 42,00</td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Nicolas Leal de Melo</td>
                        <td>R$ 60,00</td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" id="customCheck3" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}


export default TabelaPagamentos;