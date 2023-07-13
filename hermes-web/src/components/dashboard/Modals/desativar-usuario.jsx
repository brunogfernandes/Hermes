import {useState} from 'react';

import swal from 'sweetalert';
import api from '../../../api';

function DesativarUsuario(props){

    const [motivo, setMotivo] = useState("");

    if(!props.show) return null;

    function toggleDeactivateModal(id){
        swal({
            title: "Desativar Usuário",
            text: "Deseja realmente desativar esse usuário?",
            buttons: {
                cancel: "Cancelar",
                confirm: "Confirmar Aprovação",
            }
        }).then((value) => {
            if(value){
                api.post('/desativar-usuario/'+id, {
                    motivo: motivo
                }).then(res => {
                    if(res.status === 200){
                        swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){window.location.reload()}});
                    }
                }).catch(err => {
                    swal("Oops!", err.response.data.message_pt, "error").then((value) => {if(value){props.onClose()}});
                });
            }
        });
    }
    
    return (
        <div className="modal">
            <div>
                <button type="button" onClick={props.onClose} title="Fechar" className="fechar">x</button>
                <h2 className="modal-title">Desativar Usuário</h2>
                <form action="" className="main-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="motivo">Especifique o Motivo (Máx. 255 caracteres)</label>
                        <textarea onChange={(e) => {setMotivo(e.target.value)}} name="motivo" id="motivo" cols="30" rows="10"></textarea>
                    </div>
                    <button type="button" className="main-btn" onClick={() => toggleDeactivateModal(props.user.id_usuario)}>Recusar Cadastro</button>
                </form>
            </div>
        </div>
    );
}

export default DesativarUsuario;
    
    