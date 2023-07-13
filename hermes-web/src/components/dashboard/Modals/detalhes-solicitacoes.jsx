import {useState} from 'react';

import swal from 'sweetalert';
import api from '../../../api';

import ModalRecusarCadastro from './recusar-cadastro';

function ModalSolicitacao(props){

    const [show, setShow] = useState(false);

    if(!props.show) return null;

    function toggleApproveModal(id){
        swal({
            title: "Aprovar Solicitação",
            text: "Deseja realmente aprovar essa solicitação de cadastro?",
            buttons: {
                cancel: "Cancelar",
                confirm: "Confirmar Aprovação",
            }
        }).then((value) => {
            if(value){
                api.get('/aprovar-cadastro/'+id).then(res => {
                    if(res.status === 200){
                        swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){window.location.reload()}});
                    }
                });
            }
        });
    }
    
    return (
        <>
        <div className="modal">
            <div>
                <button type="button" onClick={props.onClose} title="Fechar" className="fechar">x</button>
                <h2 className="modal-title">Detalhes da Solicitação</h2>
                <form className="main-form">   
                    <div className="form-group">
                        <label className="form-label" htmlFor="nome">Nome/Razão Social</label>
                        <input value={props.user.nome_usuario} className="form-input" type="text" name="nome" id="nome" disabled/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="cpf_cnpj">CPF/CNPJ</label>
                        <input value={props.user.cpf_cnpj_usuario} className="form-input" type="text" name="cpf_cnpj" id="cpf_cnpj" disabled/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Endereço de Email</label>
                        <input value={props.user.email_usuario} className="form-input" type="email" name="email" id="email" disabled/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="telefone">Telefone de Contato</label>
                        <input value={props.user.celular_usuario} className="form-input" type="text" name="telefone" id="telefone" disabled/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="endereco">Endereço</label>
                        <input value={props.user.endereco_usuario} className="form-input" type="text" name="endereco" id="endereco" disabled/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="perfil">Perfil Shopee/Linkedin</label>
                        <input value={props.user.vendedorPerfilRede || props.user.analistaPerfilRede} className="form-input" type="text" name="perfil" id="perfil" disabled/>
                    </div>
                    
                    <button type="button" className="main-btn" onClick={() => toggleApproveModal(props.user.id_usuario)}> Aprovar Cadastro</button>
                    <button type="button" className="main-btn" onClick={() => setShow(true)}> Recusar Cadastro</button>
                </form>
            </div>
        </div>

        <ModalRecusarCadastro onClose={() => setShow(false)} user={props.user} show={show}/>
        </>
    );
}

export default ModalSolicitacao;
    
    