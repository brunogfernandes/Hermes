import React, {useState, useEffect} from 'react';
import swal from 'sweetalert';

import api from '../../api'

function Perfil(){

    const id_user = window.localStorage.getItem("user_id");

    const [nome, setNome] = useState("");
    const [CPF, setCPF] = useState("");
    const [email, setEmail] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [perfilRede, setPerfilRede] = useState("");

    const [editavel, setEditavel] = useState(false);

    useEffect(() => {

        api.get(`/gerenciar-perfil/${id_user}`).then((response) => {

            setNome(response.data[0].nome_usuario);
            setCPF(response.data[0].cpf_cnpj_usuario);
            setEmail(response.data[0].email_usuario);
            setNovoEmail(response.data[0].email_usuario);
            setTelefone(response.data[0].celular_usuario);
            setEndereco(response.data[0].endereco_usuario);
            setPerfilRede(response.data[0].perfil_analista || response.data[0].perfil_vendedor);
            
        })

    }, [id_user]);

    async function handleToggleEdicao(){
        swal("Atenção!", editavel ? "Edição dos Campos Desabilitada!" : "Edição dos Campos Habilitada!", "info");
        setEditavel(!editavel);
    }

    async function handleEdicao(e){
        e.preventDefault();

        swal({
            title: "Atenção!", 
            text: "Deseja realmente confirmar a edição do perfil?", 
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
        }).then((value) => {
            if(value){
                
                api.post(`/editar-cadastro/${id_user}`, {

                    nome_usuario: nome,
                    email_usuario: email,
                    email_usuario_novo: novoEmail,
                    celular_usuario: telefone,
                    endereco_usuario: endereco,
                    perfil_redes_usuario: perfilRede

                }).then((response) => {
        
                    if(response.status === 200){
                        swal("Sucesso!", response.data.message_pt, "success").then((value) => {if(value){window.location.reload()}});
                    }
        
                }).catch((err) => {
                    
                    swal("Oops!", err.response.data.message_pt, "error");
        
                });
            }
        });

        
    }

    return (
        <>
        <h2 className="page-title profile-title">Perfil do Usuário<br/><i className="profile-icon fa-solid fa-circle-user"></i></h2>
            
        <section className="profile-container"> 
            <form onSubmit={handleEdicao} className="main-form">   
                <div className="form-group">
                    <label className="form-label" htmlFor="nome">Nome/Razão Social</label>
                    <input value={nome} onChange={(e) => {setNome(e.target.value)}} className="form-input" type="text" name="nome" id="nome" disabled={!editavel}/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="cpf_cnpj">CPF/CNPJ</label>
                    <input value={CPF} className="form-input" type="text" name="cpf_cnpj" id="cpf_cnpj" disabled/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Endereço de Email</label>
                    <input value={novoEmail} onChange={(e) => {setNovoEmail(e.target.value)}} className="form-input" type="email" name="email" id="email" disabled={!editavel}/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="telefone">Telefone de Contato</label>
                    <input value={telefone} onChange={(e) => {setTelefone(e.target.value)}} className="form-input" type="text" name="telefone" id="telefone" disabled={!editavel}/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="endereco">Endereço</label>
                    <input value={endereco} onChange={(e) => {setEndereco(e.target.value)}} className="form-input" type="text" name="endereco" id="endereco" disabled={!editavel}/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="perfil">Perfil Shopee/Linkedin</label>
                    <input value={perfilRede} onChange={(e) => {setPerfilRede(e.target.value)}} className="form-input" type="text" name="perfil" id="perfil" disabled={!editavel}/>
                </div>
                
                <button type="button" onClick={handleToggleEdicao} className="main-btn">{editavel ? "Desabilitar Edição" : "Habilitar Edição"}</button>
                
                { editavel ? <button className="main-btn">Salvar Alterações</button> : null }

                <a className="main-btn" href={"/cadastrar-senha/"+id_user}>Requisitar Mudança de Senha</a>
            </form>
        </section>
        </>
    );

}

export default Perfil;