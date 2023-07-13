import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../api'

function RecuperarSenha(){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    async function handleForgotPassword(e){
        e.preventDefault();

        await api.post('/recuperar-senha', {
        
            email: email

        }).then((response) => {

            if(response.status === 200){
                    
                swal({
                    title: 'Sucesso!',
                    text: 'Um email foi enviado para você com as instruções para recuperar sua senha.',
                    timer: 2000,
                    buttons: false,
                    icon: 'success'
                }).then(() => {

                    const usu_id = response.data[0].id_usuario;
                    navigate("/cadastrar-senha/"+usu_id)
                    
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
            <form onSubmit={handleForgotPassword} action="cadastrar-senha.html" className="login-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Endereço de Email</label>
                    <input className="form-input" type="email" name="email" id="email" onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                <button className="login-button" type="submit">Requisitar nova senha</button>
            </form>
        </section>     
        </>
    )
}

export default RecuperarSenha;