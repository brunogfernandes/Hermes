import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import swal from 'sweetalert';

import api from '../../api';

function InserirAnuncio(){
    const navigate = useNavigate();

    const user_id = window.localStorage.getItem('user_id');

    const [produto, setProduto] = useState("");
    const [tipoAnuncio, setTipoAnuncio] = useState("");
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        api.get('/'+user_id+'/listar-produtos').then(res => {

            setProdutos(res.data);

        });
    }, [user_id]);

    async function handleInsert(e){
        e.preventDefault();

        await api.post(`/${produto}/inserir-anuncio`, {

            tipo_anuncio: tipoAnuncio,
            status_anuncio: "Ativo"

        }).then(res => {

            if(res.status === 200){
                swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){navigate('/anuncios')}});
            }

        }).catch(err => {

            swal("Erro!", err.response.data.message_pt, "error");

        });
    }

    return (
        <>
        <h2 className="page-title profile-title">Inserir Anúncio<br/><i className="profile-icon fa-solid fa-circle-plus"></i></h2>
            
        <section className="profile-container"> 
            <form onSubmit={(e) => {handleInsert(e)}} className="main-form">
                
                <div className="form-group">
                    <label className="form-label" htmlFor="produto">Produto</label>
                    <select onChange={(e) => setProduto(e.target.value)} className="form-input" name="produto" id="produto" required>
                        <option selected>Selecione um produto</option>
                        {produtos.map(p => (
                            <option value={p.id_produto}>{p.nome_produto}</option> 
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="tipo_anuncio">Tipo do Anuncio</label>
                    <select onChange={(e) => setTipoAnuncio(e.target.value)} className="form-input" name="tipo_anuncio" id="tipo_anuncio" required>
                        <option selected>Selecione um tipo de anúncio</option> 
                        <option value="Pesquisa">Pesquisa</option>
                        <option value="Descoberta">Descoberta</option>
                    </select>
                </div>
            
                <button type="submit" className="main-btn">Inserir Anúncio</button>
            </form>
        </section>
        </>
    );
}

export default InserirAnuncio;