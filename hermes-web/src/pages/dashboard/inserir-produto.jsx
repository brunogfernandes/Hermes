import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import swal from 'sweetalert';

import api from '../../api';

function InserirProduto(){
    const navigate = useNavigate();

    const user_id = window.localStorage.getItem('user_id');

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [variacao, setVariacao] = useState("");
    const [estoque, setEstoque] = useState("");
    const [preco, setPreco] = useState("");
    const [embalagem, setEmbalagem] = useState("");
    const [taxaGov, setTaxaGov] = useState("");
    // const [taxaPlataforma, setTaxaPlataforma] = useState("");

    async function handleInsert(e){
        e.preventDefault();

        await api.post(`/${user_id}/inserir-produto`, {

            nome_produto: nome,
            descricao_produto: descricao,
            variacao_produto: variacao,
            qtd_estoque: estoque,
            custo_produto: preco,
            custo_embalagem: embalagem,
            taxas_gov: taxaGov

        }).then(res => {

            if(res.status === 200){
                swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){navigate('/produtos')}});
            }

        }).catch(err => {

            swal("Erro!", err.response.data.message_pt, "error");

        });
    }

    return (
        <>
        <h2 className="page-title profile-title">Inserir Produto<br/><i className="profile-icon fa-solid fa-circle-plus"></i></h2>
            
        <section className="profile-container"> 
            <form onSubmit={(e) => {handleInsert(e)}} className="main-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="nome_produto">Nome do Produto</label>
                    <input className="form-input" onChange={(e) => {setNome(e.target.value)}} type="text" name="nome_produto" id="nome_produto"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="descricao_produto">Descrição do Produto</label>
                    <input className="form-input" onChange={(e) => {setDescricao(e.target.value)}} type="text" name="descricao_produto" id="descricao_produto"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="variacao_produto">Variação do Produto</label>
                    <input className="form-input" onChange={(e) => {setVariacao(e.target.value)}} type="text" name="variacao_produto" id="variacao_produto"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="quantidade_produto">Quantidade do Produto</label>
                    <input className="form-input" onChange={(e) => {setEstoque(e.target.value)}} type="number" name="quantidade_produto" id="quantidade_produto"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="custo_produto">Custo do Produto</label>
                    <input className="form-input" pattern="[0-9]{1,8}.[0-9]{0,2}" onChange={(e) => {setPreco(e.target.value)}} type="text" name="custo_produto" id="custo_produto"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="custo_embalagem">Custo da Embalagem</label>
                    <input className="form-input" pattern="[0-9]{1,8}.[0-9]{0,2}" onChange={(e) => {setEmbalagem(e.target.value)}} type="text" name="custo_embalagem" id="custo_embalagem"/>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="taxas_governo">Taxas do Governo</label>
                    <input className="form-input" pattern="[0-9]{1,3}.[0-9]{0,2}" onChange={(e) => {setTaxaGov(e.target.value)}} type="text" name="taxas_governo" id="taxas_governo"/>
                </div>

                {/* <div className="form-group">
                    <label className="form-label" htmlFor="taxas_plataforma">Taxas da Plataforma</label>
                    <input className="form-input" onChange={(e) => {setTaxaPlataforma(e.target.value)}} type="number" name="taxas_plataforma" id="taxas_plataforma"/>
                </div> */}
            
                <button type="submit" className="main-btn">Inserir Produto</button>
            </form>
        </section>
        </>
    );
}

export default InserirProduto;