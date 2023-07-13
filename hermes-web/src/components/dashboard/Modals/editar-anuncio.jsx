import {useState, useEffect} from 'react';

import swal from 'sweetalert';
import api from '../../../api';

function EditarAnuncio(props){

    const [status, setStatus] = useState("");
    const [tipoAnuncio, setTipoAnuncio] = useState("");

    useEffect(() => {

        setStatus(props.anuncio.anuncio_status);
        setTipoAnuncio(props.anuncio.tipo_anuncio);

    }, [props.anuncio]);

    const [editavel, setEditavel] = useState(false);

    function toggleConfirmModal(e){
        e.preventDefault();

        swal({
            title: "Concluir Edição",
            text: "Deseja realmente editar este anúncio?",
            buttons: {
                cancel: "Cancelar",
                confirm: "Confirmar Edição",
            }
        }).then((value) => {
            if(value){
                api.post(`/${props.anuncio.produto_id}/editar-anuncio/${props.anuncio.id_anuncio}`, {

                    tipo_anuncio: tipoAnuncio,
                    status_anuncio: status

                }).then(res => {

                    if(res.status === 200){
                        swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){window.location.reload()}});
                    }

                }).catch(err => {

                    swal("Erro!", err.response.data.message_pt, "error").then((value) => {if(value){setEditavel(false); props.onClose()}})

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
                <h2 className="modal-title">Editar Anúncio</h2>
                <form onSubmit={(e) => {toggleConfirmModal(e)}} className="main-form">

                    <div className="form-group">
                        <label className="form-label" htmlFor="tipo_anuncio">Tipo do Anuncio</label>
                        <select onChange={(e) => setTipoAnuncio(e.target.value)} className="form-input" name="tipo_anuncio" id="tipo_anuncio" 
                        defaultValue={props.anuncio.tipo_anuncio} required disabled={!editavel}>
                            <option value="Pesquisa">Pesquisa</option>
                            <option value="Descoberta">Descoberta</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="tipo_anuncio">Status</label>
                        <select onChange={(e) => setStatus(e.target.value)} className="form-input" name="tipo_anuncio" id="tipo_anuncio" 
                        defaultValue={props.anuncio.anuncio_status} required disabled={!editavel}>
                            <option value="Ativo">Ativo</option>
                            <option value="Pausado">Pausado</option>
                        </select>
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

export default EditarAnuncio;