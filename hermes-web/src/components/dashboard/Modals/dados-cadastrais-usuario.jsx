function ModalSolicitacao(props){

    if(!props.show) return null;
    
    return (
        <>
        <div className="modal">
            <div>
                <button type="button" onClick={props.onClose} title="Fechar" className="fechar">x</button>
                <h2 className="modal-title">Dados Cadastrais do Usuário</h2>
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
                        <input value={props.user.perfil_analista || props.user.perfil_vendedor} className="form-input" type="text" name="perfil" id="perfil" disabled/>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}

export default ModalSolicitacao;
    
    