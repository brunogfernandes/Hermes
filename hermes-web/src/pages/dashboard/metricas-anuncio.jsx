import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import api from '../../api'

import TableMetricas from '../../components/dashboard/Tables/metricas-anuncio';

function MetricasAnuncio(){

    const { anuncio_id } = useParams();

    const [listaMetricas, setListaMetricas] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        api.get(`/${anuncio_id}/listar-metricas`).then(res => {

            setListaMetricas(res.data);

        });
    }, [anuncio_id]);

    const [tableHeader, setTableHeader] = useState([
        {
            Header: "Data das Métricas",
            accessor: "data"
        },
        {
            Header: "Orçamento",
            accessor: "orcamento_diario"
        },
        {
            Header: "Impressões",
            accessor: "impressoes"
        },
        {
            Header: "Cliques",
            accessor: "cliques"
        },
        {
            Header: "Conversões",
            accessor: "conversoes"
        },
        {
            Header: "Despesas",
            accessor: "despesas"
        },
        {
            Header: "Vendidos",
            accessor: "vendidos"
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
        <h2 className="page-title"><i className="title-icon fa-solid fa-table"></i>Métricas do Anúncio</h2>
        <section className="crud-container"> 
            <div className="metrics-form">
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Orçamento", "orcamento_diario")} type="checkbox" name="orcamento" id="orcamento" checked/>
                    <label className="form-label" htmlFor="orcamento">Orçamento Diário</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Impressões", "impressoes")} type="checkbox" name="impressoes" id="impressoes" checked/>
                    <label className="form-label" htmlFor="impressoes">Impressões</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Cliques", "cliques")} type="checkbox" name="cliques" id="cliques" checked/>
                    <label className="form-label" htmlFor="cliques">Cliques</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Conversões", "Conversões")} type="checkbox" name="conversoes" id="conversoes" checked/>
                    <label className="form-label" htmlFor="conversoes">Conversões</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Despesas", "despesas")} type="checkbox" name="despesas" id="despesas" checked/>
                    <label className="form-label" htmlFor="despesas">Despesas</label>
                </div>
                <div className="checkbox-group">
                    <input className="form-input" onChange={(e) => handleCheckboxFilter(e, "Vendidos", "vendidos")} type="checkbox" name="itensVendidos" id="itensVendidos" checked/>
                    <label className="form-label" htmlFor="itensVendidos">Itens Vendidos</label>
                </div>
            </div>
            <div className="table-controls">
                <div className="table-search">
                    <input onChange={(e) => {setFiltro(e.target.value)}} placeholder="Pesquisar..." className="form-input" type="text"/>
                    <button className="main-btn"><i className="fa-solid fa-search"></i></button>
                </div>
                <div className="table-insert">
                    <button className="main-btn"><i className="fa-solid fa-chart-area"></i>Plotar Gráfico</button>
                    <a href={"/inserir-metricas/"+anuncio_id} className="main-btn"><i className="fa-solid fa-plus"></i>Inserir Métricas</a>
                </div>
            </div>

            <TableMetricas filtro={filtro} data={listaMetricas} table_header={tableHeader}/>
        </section>
        </>
    );
}

export default MetricasAnuncio;