import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../api'

function CadastrarSenha(){

    const navigate = useNavigate();
    
    const usu_id = useParams().id;

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    async function handlePasswordForm(e){
        e.preventDefault();

        await api.post('/cadastrar-nova-senha/'+usu_id, {
        
            senha: senha,
            confirmar_senha: confirmarSenha

        }).then((response) => {

            if(response.status === 200){
                    
                swal({
                    title: 'Sucesso!',
                    text: response.data.message_pt,
                    timer: 2000,
                    buttons: false,
                    icon: 'success'
                }).then(() => {
                    navigate("/login")
                })
    
            }

        }).catch((err) => {

            const message = err.response.data.message_pt;
            swal("Oops!", message, "error");

        });

    }

    return(
        <>
        <section className="login-form-container">
            <form onSubmit={handlePasswordForm} className="login-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="senha">Nova Senha</label>
                    <input className="form-input" type="password" name="senha" id="senha" onChange={(e) => {setSenha(e.target.value)}}/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="confirmarSenha">Confirmar Senha</label>
                    <input className="form-input" type="password" name="confirmarSenha" id="confirmarSenha" onChange={(e) => {setConfirmarSenha(e.target.value)}}/>
                </div>
                <button className="login-button" type="submit">Cadastrar Nova Senha</button>
            </form>
        </section>  
        </>
    )
}

export default CadastrarSenha;