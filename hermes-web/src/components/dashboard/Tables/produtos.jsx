import {useState, useMemo, useEffect} from 'react';
import {useTable, useSortBy, useGlobalFilter, usePagination} from 'react-table';

import swal from 'sweetalert';
import api from '../../../api';

import EditarProduto from '../Modals/editar-produto';

function TableProdutos(props){

    const user_id = window.localStorage.getItem('user_id');

    const [show, setShow] = useState(false);
    const [produto, setProduto] = useState({});

    const table_header = [
        {
            Header: "Nome do Produto",
            accessor: "nome_produto"
        },
        {
            Header: "Estoque",
            accessor: "qtd_estoque"
        },
        {
            Header: "Preço",
            accessor: "custo_produto"
        },
        {
            Header: "Custo Embalagem",
            accessor: "custo_embalagem"
        }
        
    ]

    const columns = useMemo(() => table_header, []);
    const data = useMemo(() => props.data, [props.data]); 

    const {getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, canNextPage, canPreviousPage, prepareRow, setGlobalFilter} 
        = useTable({    
            columns,
            data,
            initialState: {pageSize: 8}
        }, useGlobalFilter, useSortBy, usePagination);

    useEffect(() => {

        setGlobalFilter(props.filtro);

    }, [setGlobalFilter, props.filtro]);

    async function toggleModalExclusao(id){
        swal({
            title: "Excluir Produto",
            text: "Deseja realmente excluir este produto?",
            buttons: {
                cancel: "Cancelar",
                confirm: "Confirmar Exclusão",
            }
        }).then((value) => {
            if(value){
                api.delete(`/${user_id}/excluir-produto/${id}`)
                .then(res => {

                    if(res.status === 200){
                        swal("Sucesso!", res.data.message_pt, "success").then((value) => {if(value){window.location.reload()}});
                    }

                }).catch(err => {

                    swal("Oops!", err.response.data.message_pt, "error").then((value) => {if(value){props.onClose()}});

                });
            }
        });
    }

    return (
        <>
        <div className="table-container">
            <table {...getTableProps()} className="main-table">
                <thead>
                    {headerGroups.map((hg) => (
                        <tr {...hg.getHeaderGroupProps()}> 
                            {hg.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? <i className="fa-solid fa-arrow-down"></i> : <i className="fa-solid fa-arrow-up"></i>) : ''}
                                    </span>
                                </th>
                            ))}
                            <th>Ações</th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.length > 0 ?
                        page.map(row => {
                            prepareRow(row);
                            return(
                                <tr {...row.getRowProps()}>

                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                    
                                    <td>
                                        <button onClick={() => {setProduto(row.original); setShow(true)}} className="main-btn"><i className="fa-solid fa-pen"></i></button>
                                        &nbsp;<button onClick={() => {toggleModalExclusao(row.original.id_produto)}} className="main-btn"><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            )
                        })
                        :
                        <tr>
                            <td colSpan="5">Não existem produtos cadastrados</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
        <div className="table-pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="main-btn">Voltar</button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="main-btn">Próxima</button>
        </div>

        <EditarProduto onClose={() => setShow(false)} produto={produto} show={show}/>
        </>
    );
}

export default TableProdutos;