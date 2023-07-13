import {useState, useEffect} from 'react';

import api from '../../api'

import TableAnuncios from '../../components/dashboard/Tables/anuncios';

function Anuncios(){

    const user_id = window.localStorage.getItem('user_id');

    const [anuncios, setAnuncios] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        api.get('/'+user_id+'/listar-anuncios').then(res => {

            setAnuncios(res.data);

        });
    }, [user_id]);

    const [tableHeader, setTableHeader] = useState([
        {
            Header: "Nome do Produto",
            accessor: "produto_nome"
        },
        {
            Header: "Tipo do Anúncio",
            accessor: "tipo_anuncio"
        },
        {
            Header: "Status",
            accessor: "anuncio_status"
        }
    ]);

    async function handleCheckboxFilter(e, header, accessor){

        if(e.target.checked)
            setTableHeader(old => [...old, {Header: header, accessor: accessor}]);
        else
            setTableHeader(tableHeader.filter((item) => item.Header !== header));

    }

    return(
        <>
        <h2 className="page-title"><i className="title-icon fa-solid fa-bullhorn"></i>Gerenciamento de Anúncios</h2>
        <section className="crud-container"> 
            <div className="metrics-form">
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Orçamento", "orcamento")} type="checkbox" name="orcamento" id="orcamento"/>
                    <label className="form-label" htmlFor="orcamento">Orçamento Diário</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Impressões", "impressoes")} type="checkbox" name="impressoes" id="impressoes"/>
                    <label className="form-label" htmlFor="impressoes">Impressões</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Cliques", "cliques")} type="checkbox" name="cliques" id="cliques"/>
                    <label className="form-label" htmlFor="cliques">Cliques</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Conversões", "conversoes")} type="checkbox" name="conversoes" id="conversoes"/>
                    <label className="form-label" htmlFor="conversoes">Conversões</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Despesas", "despesas")} type="checkbox" name="despesas" id="despesas"/>
                    <label className="form-label" htmlFor="despesas">Despesas</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Vendidos", "vendidos")} type="checkbox" name="itensVendidos" id="itensVendidos"/>
                    <label className="form-label" htmlFor="itensVendidos">Itens Vendidos</label>
                </div>
            </div>
            <div className="table-controls">
                <div className="table-search">
                    <input onChange={(e) => {setFiltro(e.target.value)}} placeholder="Pesquisar..." className="form-input" type="text"/>
                    <button className="main-btn"><i className="fa-solid fa-search"></i></button>
                </div>
                <div className="table-insert">
                    <a href="/inserir-anuncio" className="main-btn"><i className="fa-solid fa-plus"></i>Inserir Anúncio</a>
                </div>
            </div>

            <TableAnuncios filtro={filtro} data={anuncios} table_header={tableHeader}/>
        </section>
        </>
    );
}

export default Anuncios;