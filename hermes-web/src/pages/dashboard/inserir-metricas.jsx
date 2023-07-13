import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import swal from 'sweetalert';

import api from '../../api';

function InserirProduto(){
    const navigate = useNavigate();

    const { anuncio_id } = useParams();

    const [orcamento, setOrcamento] = useState("");
    const [impressoes, setImpressoes] = useState("");
    const [cliques, setCliques] = useState("");
    const [conversoes, setConversoes] = useState("");
    const [despesas, setDespesas] = useState("");
    const [vendidos, setVendidos] = useState("");
    const [data, setData] = useState("");

    async function handleInsert(e){
        e.preventDefault();

        await api.post(`/${anuncio_id}/inserir-metricas`, {

            orcamento_diario: orcamento,
            impressoes: impressoes,
            cliques: cliques, 
            conversoes: conversoes,
            despesas: despesas, 
            items_vendidos: vendidos, 
            data_metricas: data

        }).then(res => {

            if(res.status === 200){
                swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){navigate('/metricas-anuncio/' + anuncio_id)}});
            }

        }).catch(err => {

            swal("Erro!", err.response.data.message_pt, "error");

        });
    }

    return (
        <>
        <h2 className="page-title profile-title">Inserir Métricas<br/><i className="profile-icon fa-solid fa-circle-plus"></i></h2>
            
        <section className="profile-container"> 
            <form onSubmit={(e) => {handleInsert(e)}} className="main-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="orcamento_diario">Orçamento Diário</label>
                    <input className="form-input" onChange={(e) => {setOrcamento(e.target.value)}} type="text" name="orcamento_diario" id="orcamento_diario"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="impressoes">Impressões</label>
                    <input className="form-input" onChange={(e) => {setImpressoes(e.target.value)}} type="text" name="impressoes" id="impressoes"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="cliques">Cliques</label>
                    <input className="form-input" onChange={(e) => {setCliques(e.target.value)}} type="text" name="cliques" id="cliques"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="conversoes">Conversões</label>
                    <input className="form-input" onChange={(e) => {setConversoes(e.target.value)}} type="text" name="conversoes" id="conversoes"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="despesas">Despesas</label>
                    <input className="form-input" onChange={(e) => {setDespesas(e.target.value)}} type="text" name="despesas" id="despesas"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="itens_vendidos">Itens Vendidos</label>
                    <input className="form-input" onChange={(e) => {setVendidos(e.target.value)}} type="text" name="itens_vendidos" id="itens_vendidos"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="data_metricas">Data das Métricas</label>
                    <input className="form-input" onChange={(e) => {setData(e.target.value)}} type="date" name="data_metricas" id="data_metricas"/>
                </div>
                <button type="submit" className="main-btn">Inserir Métricas</button>
            </form>
        </section>
        </>
    );
}

export default InserirProduto;