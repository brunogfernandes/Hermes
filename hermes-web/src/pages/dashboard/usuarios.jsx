import {useState, useEffect} from 'react';

import api from '../../api'

import TableUsuarios from '../../components/dashboard/Tables/usuarios';

function Usuarios(){

    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        api.get('/listar-usuarios-cadastrados').then(res => {

            setUsuarios(res.data);

        });
    }, []);

    return(
        <>
        <h2 className="page-title"><i className="title-icon fa-solid fa-users-gear"></i>Gerenciamento de Usuários</h2>
        <section className="crud-container"> 
            <div className="table-controls">
                <div className="table-search">
                    <input onChange={(e) => {setFiltro(e.target.value)}} placeholder="Pesquisar..." className="form-input" type="text"/>
                    <button className="main-btn"><i className="fa-solid fa-search"></i></button>
                </div>
            </div>

            <TableUsuarios filtro={filtro} data={usuarios}/>
        </section>
        </>
    );
}

export default Usuarios;