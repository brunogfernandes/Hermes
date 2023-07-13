import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../api'

function Cadastro(){

    const navigate = useNavigate();

    const [tipoUsuario, setTipoUsuario] = useState(null);
    const [tipoPessoa, setTipoPessoa] = useState(null);
    const [nome, setNome] = useState("");
    const [CPF, setCPF] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [perfil, setPerfil] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    
    async function handleSignup(e){
        e.preventDefault();

        await api.post('/cadastro-usuario', {

            tipo_usuario: tipoUsuario,
            nome_usuario: nome,
            tipo_pessoa_usuario: tipoPessoa,
            cpf_cnpj_usuario: CPF,
            email_usuario: email,
            celular_usuario: telefone,
            endereco_usuario: endereco,
            perfil_redes_usuario: perfil,
            senha_usuario: senha,
            confimar_senha_usuario: confirmarSenha

        }).then((response) => {
            
            if(response.status === 200) {

                swal('Usuário registrado com sucesso!',
                    'Aguarde a aprovação de seu cadastro.',
                    'success'
                ).then(() => {
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
            <form onSubmit={handleSignup} className="login-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="tipo_usuario">Desejo cadastrar-me como um</label>
                    <div className="radio-items">
                        <input type="radio" name="tipo_usuario" id="vendedor" value="Vendedor" onClick={() => setTipoUsuario('Vendedor')} required/>
                        <label className="form-label radio-label" htmlFor="vendedor">Vendedor</label>

                        <input type="radio" name="tipo_usuario" id="analista" value="Analista" onClick={() => setTipoUsuario('Analista')} required/>
                        <label className="form-label radio-label" htmlFor="analista">Analista de Marketing</label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="tipo_pessoa">Sou uma</label>
                    <div className="radio-items">
                        <input type="radio" name="tipo_pessoa" id="pessoa_fisica" value="Pessoa Física" onClick={() => setTipoPessoa('Pessoa Física')} required/>
                        <label className="form-label radio-label" htmlFor="pessoa_fisica">Pessoa Física</label>

                        <input type="radio" name="tipo_pessoa" id="pessoa_juridica" value="Pessoa Jurídica" onClick={() => setTipoPessoa('Pessoa Jurídica')} required/>
                        <label className="form-label radio-label" htmlFor="pessoa_juridica">Pessoa Jurídica</label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="nome">Nome/Razão Social</label>
                    <input placeholder="Seu Nome ou a Razão Social de sua empresa" className="form-input" type="text" name="nome" id="nome" 
                    onChange={(e) => {setNome(e.target.value)}} required/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="cpf_cnpj">CPF/CNPJ</label>
                    <input placeholder="XXX.XXX.XXX-XX ou XX.XXX.XXX/0001-XX" className="form-input" type="text" name="cpf_cnpj" id="cpf_cnpj" 
                    onChange={(e) => {setCPF(e.target.value)}} required/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Endereço de Email</label>
                    <input placeholder="usuario@gmail.com" className="form-input" type="email" name="email" id="email" required
                    onChange={(e) => {setEmail(e.target.value)}} />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="telefone">Telefone de Contato</label>
                    <input placeholder="(00) 00000-0000" className="form-input" type="text" name="telefone" id="telefone" required 
                    onChange={(e) => {setTelefone(e.target.value)}} />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="endereco">Endereço</label>
                    <input placeholder="Rua X, Bairro Y, Cidade Z" className="form-input" type="text" name="endereco" id="endereco" required
                    onChange={(e) => {setEndereco(e.target.value)}}/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="perfil">Perfil Shopee/Linkedin</label>
                    <input placeholder="Link para seu perfil em uma das duas plataformas" className="form-input" type="text" name="perfil" id="perfil" required
                    onChange={(e) => {setPerfil(e.target.value)}} />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="senha">Senha</label>
                    <input placeholder="********" className="form-input" type="password" name="senha" id="senha" required 
                    onChange={(e) => {setSenha(e.target.value)}}/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="confirmarSenha">Confirmar Senha</label>
                    <input placeholder="********" className="form-input" type="password" name="confirmarSenha" id="confirmarSenha" required 
                    onChange={(e) => {setConfirmarSenha(e.target.value)}}/>
                </div>
                <button className="login-button" type="submit">Solicitar Cadastro</button>
            </form>
        </section>
        </>
    )
}

export default Cadastro;