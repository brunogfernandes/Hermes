import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../api'

function Login(){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin(e){
        e.preventDefault();

        await api.post('/login', {
    
            email: email,
            senha: senha

        }).then((response) => {
            
            if(response.status === 200) {

                swal({
                    title: 'Login efetuado com sucesso',
                    text: 'Você será redirecionado em instantes.',
                    timer: 2000,
                    buttons: false,
                    icon: 'success'
                }).then(() => {

                    window.localStorage.setItem("user_id", response.data[0].id_usuario);

                    api.post('/tipo-usuario', {

                        usuarioId: response.data[0].id_usuario,
            
                    }).then((res) => {
            
                        window.localStorage.setItem("tipo_usuario", res.data.tipo_usuario);
                        
                        res.data.tipo_usuario === "Administrador" ? navigate('/solicitacoes-cadastro')
                        : res.data.tipo_usuario === "Vendedor" ? navigate('/produtos') : navigate('/home-analista')
            
                    });        

                })

            }
            
        }).catch((err) => {        
            
            const message = err.response.data.message_pt;
            swal("Oops!", message, "error");

        });   
        
    }

    return (
        <>
        <section className="login-form-container">
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Endereço de Email</label>
                    <input className="form-input" onChange={(e) => {setEmail(e.target.value)}} type="email" name="email" id="email"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="senha">Senha</label>
                    <input className="form-input" onChange={(e) => {setSenha(e.target.value)}} type="password" name="senha" id="senha"/>
                </div>
                <h5 className="forgot-password-message">Esqueceu sua senha? <a href="/recuperar-senha">Podemos ajudá-lo.</a></h5>
                <button className="login-button" type="submit">Fazer Login</button>
            </form>
        </section>
        <section className="signup-info-container">
            <h5 className="signup-info-message">Novo na plataforma? <a href="/cadastro">Cadastre-se aqui.</a></h5>
        </section>      
        </>
    );
}

export default Login;