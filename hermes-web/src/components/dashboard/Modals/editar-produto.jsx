import {useState, useEffect} from 'react';

import swal from 'sweetalert';
import api from '../../../api';

function EditarProduto(props){
    const user_id = window.localStorage.getItem('user_id');

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [variacao, setVariacao] = useState("");
    const [estoque, setEstoque] = useState("");
    const [preco, setPreco] = useState("");
    const [embalagem, setEmbalagem] = useState("");
    const [taxaGov, setTaxaGov] = useState("");
    // const [taxaPlataforma, setTaxaPlataforma] = useState("");

    useEffect(() => {
        setNome(props.produto.nome_produto);
        setDescricao(props.produto.descricao_produto);
        setVariacao(props.produto.variacao_produto);
        setEstoque(props.produto.qtd_estoque);
        setPreco(props.produto.custo_produto);
        setEmbalagem(props.produto.custo_embalagem);
        setTaxaGov(props.produto.taxas_gov);
        // setTaxaPlataforma(props.produto.taxas_plataforma);
    }, [props.produto]);

    const [editavel, setEditavel] = useState(false);

    function toggleConfirmModal(e){
        e.preventDefault();

        swal({
            title: "Concluir Edição",
            text: "Deseja realmente editar este produto?",
            buttons: {
                cancel: "Cancelar",
                confirm: "Confirmar Edição",
            }
        }).then((value) => {
            if(value){
                api.post(`/${user_id}/atualizar-produto/${props.produto.id_produto}`, {

                    nome_produto: nome,
                    descricao_produto: descricao,
                    variacao_produto: variacao,
                    qtd_estoque: estoque,
                    custo_produto: preco,
                    custo_embalagem: embalagem,
                    taxas_gov: taxaGov,

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
                <h2 className="modal-title">Editar Produto</h2>
                <form onSubmit={(e) => {toggleConfirmModal(e)}} className="main-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="nome_produto">Nome do Produto</label>
                        <input value={nome} onChange={(e) => {setNome(e.target.value)}} 
                        className="form-input" type="text" name="nome_produto" id="nome_produto" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="descricao_produto">Descrição do Produto</label>
                        <input value={descricao} onChange={(e) => {setDescricao(e.target.value)}} 
                        className="form-input" type="text" name="descricao_produto" id="descricao_produto" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="variacao_produto">Variação do Produto</label>
                        <input value={variacao} onChange={(e) => {setVariacao(e.target.value)}} 
                        className="form-input" type="text" name="variacao_produto" id="variacao_produto" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="quantidade_produto">Quantidade do Produto</label>
                        <input value={estoque} onChange={(e) => {setEstoque(e.target.value)}} 
                        className="form-input" type="number" name="quantidade_produto" id="quantidade_produto" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="custo_produto">Custo do Produto</label>
                        <input value={preco} onChange={(e) => {setPreco(e.target.value)}} 
                        className="form-input" pattern="[0-9]{1,8}.[0-9]{0,2}" type="text" name="custo_produto" id="custo_produto" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="custo_embalagem">Custo da Embalagem</label>
                        <input value={embalagem} onChange={(e) => {setEmbalagem(e.target.value)}} 
                        className="form-input" pattern="[0-9]{1,8}.[0-9]{0,2}" type="text" name="custo_embalagem" id="custo_embalagem" disabled={!editavel}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="taxas_governo">Taxas do Governo</label>
                        <input value={taxaGov} onChange={(e) => {setTaxaGov(e.target.value)}} 
                        className="form-input" pattern="[0-9]{1,3}.[0-9]{0,2}" type="text" name="taxas_governo" id="taxas_governo" disabled={!editavel}/>
                    </div>

                    {/* <div className="form-group">
                        <label className="form-label" htmlFor="taxas_plataforma">Taxas da Plataforma</label>
                        <input value={props.produto.taxas_plataforma} className="form-input" type="number" name="taxas_plataforma" id="taxas_plataforma" disabled/>
                    </div> */}

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

export default EditarProduto;