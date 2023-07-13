import {useState, useEffect} from 'react';

import api from '../../api'

import TableSolicitacoes from '../../components/dashboard/Tables/solicitacoes-cadastro';

function SolicitacoesCadastro(){

    const [solicitacoes, setSolicitacoes] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        api.get('/listar-solicitacoes-cadastro').then(res => {

            setSolicitacoes(res.data);

        });
    }, []);

    return(
        <>
        <h2 className="page-title"><i className="title-icon fa-solid fa-list-check"></i>Solicitações de Cadastro</h2>
        <section className="crud-container"> 
            <div className="table-controls">
                <div className="table-search">
                    <input onChange={(e) => {setFiltro(e.target.value)}} placeholder="Pesquisar..." className="form-input" type="text"/>
                    <button className="main-btn"><i className="fa-solid fa-search"></i></button>
                </div>
            </div>

            <TableSolicitacoes filtro={filtro} data={solicitacoes}/>
        </section>
        </>
    );
}

export default SolicitacoesCadastro;