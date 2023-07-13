import {useState, useEffect} from 'react';

import api from '../../api'

import TableProdutos from '../../components/dashboard/Tables/produtos';

function Produtos(){

    const user_id = window.localStorage.getItem('user_id');

    const [produtos, setProdutos] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        api.get('/'+user_id+'/listar-produtos').then(res => {

            setProdutos(res.data);

        });
    }, [user_id]);

    return(
        <>
        <h2 className="page-title"><i className="title-icon fa-solid fa-bag-shopping"></i>Gerenciamento de Produtos</h2>
        <section className="crud-container"> 
            <div className="table-controls">
                <div className="table-search">
                    <input onChange={(e) => {setFiltro(e.target.value)}} placeholder="Pesquisar..." className="form-input" type="text"/>
                    <button className="main-btn"><i className="fa-solid fa-search"></i></button>
                </div>
                <div className="table-insert">
                    <a href="/inserir-produto" className="main-btn"><i className="fa-solid fa-plus"></i>Inserir Produto</a>
                </div>
            </div>

            <TableProdutos filtro={filtro} data={produtos}/>
        </section>
        </>
    );
}

export default Produtos;