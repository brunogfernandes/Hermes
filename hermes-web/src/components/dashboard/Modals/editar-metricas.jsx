import {useState, useEffect} from 'react';

import swal from 'sweetalert';
import api from '../../../api';

function EditarMetricas(props){

    const [orcamento, setOrcamento] = useState("");
    const [impressoes, setImpressoes] = useState("");
    const [cliques, setCliques] = useState("");
    const [conversoes, setConversoes] = useState("");
    const [despesas, setDespesas] = useState("");
    const [vendidos, setVendidos] = useState("");
    const [data, setData] = useState("");

    useEffect(() => {

        setOrcamento(props.metricas.orcamento_diario);
        setImpressoes(props.metricas.impressoes);
        setCliques(props.metricas.cliques);
        setConversoes(props.metricas.conversoes);
        setDespesas(props.metricas.despesas);
        setVendidos(props.metricas.vendidos);
        setData(props.metricas.data_metricas);


    }, [props.metricas]);

    const [editavel, setEditavel] = useState(false);

    function toggleConfirmModal(e){
        e.preventDefault();

        swal({
            title: "Concluir Edição",
            text: "Deseja realmente editar essas métricas?",
            buttons: {
                cancel: "Cancelar",
                confirm: "Confirmar Edição",
            }
        }).then((value) => {
            if(value){
                api.post(`/editar-metrica/${props.metricas.id_metricas}`, {

                    orcamento_diario: orcamento, 
                    impressoes: impressoes, 
                    cliques: cliques, 
                    conversoes: conversoes, 
                    despesas: despesas, 
                    items_vendidos: vendidos, 
                    data_metricas: data

                }).then(res => {

                    if(res.status === 200){
                        swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){window.location.reload()}});
                    }

                }).catch(err => {

                    swal("Erro!", err.response.data.message_pt, "error")

                });
            }
        });
    }

    if(!props.show) return null;

    return (
        <>
        <div className="modal">
            <div>
                <button type="button" onClick={props.onClose} title="Fechar" className="fechar">x</button>
                <h2 className="modal-title">Editar Métricas do Anúncio</h2>
                <form onSubmit={(e) => {toggleConfirmModal(e)}} className="main-form">

                    <div className="form-group">
                        <label className="form-label" htmlFor="orcamento_diario">Orçamento Diário</label>
                        <input className="form-input" onChange={(e) => {setOrcamento(e.target.value)}} value={orcamento}
                        type="text" name="orcamento_diario" id="orcamento_diario" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="impressoes">Impressões</label>
                        <input className="form-input" onChange={(e) => {setImpressoes(e.target.value)}} value={impressoes}
                        type="text" name="impressoes" id="impressoes" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="cliques">Cliques</label>
                        <input className="form-input" onChange={(e) => {setCliques(e.target.value)}} value={cliques}
                        type="text" name="cliques" id="cliques" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="conversoes">Conversões</label>
                        <input className="form-input" onChange={(e) => {setConversoes(e.target.value)}} value={conversoes}
                        type="text" name="conversoes" id="conversoes" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="despesas">Despesas</label>
                        <input className="form-input" onChange={(e) => {setDespesas(e.target.value)}} value={despesas}
                        type="text" name="despesas" id="despesas" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="itens_vendidos">Itens Vendidos</label>
                        <input className="form-input" onChange={(e) => {setVendidos(e.target.value)}} value={vendidos}
                        type="text" name="itens_vendidos" id="itens_vendidos" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="data_metricas">Data das Métricas</label>
                        <input className="form-input" onChange={(e) => {setData(e.target.value)}} value={data}
                        type="date" name="data_metricas" id="data_metricas" disabled={!editavel}/>
                    </div>

                    {
                        !editavel
                        ?
                        <button type="button" onClick={() => {setEditavel(true)}} className="main-btn">Editar</button>
                        :
                        null
                    }
                
                    {   
                        editavel 
                        ?
                        <button type="submit" className="main-btn">Salvar</button>
                        :
                        null
                    }
                    

                    <button type="button" onClick={() => {setEditavel(false); props.onClose()}} className="main-btn">Cancelar</button>
                </form>
            </div>
        </div>
        </>
    );
}

export default EditarMetricas;