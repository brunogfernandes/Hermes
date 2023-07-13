import {useState, useMemo, useEffect} from 'react';
import {useTable, useSortBy, useGlobalFilter, usePagination} from 'react-table';

import swal from 'sweetalert';
import api from '../../../api';

import EditarMetricas from '../Modals/editar-metricas';

function TableMetricas(props){

    const [show, setShow] = useState(false);
    const [metricas, setMetricas] = useState({});

    const columns = useMemo(() => props.table_header, [props.table_header]);
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

    async function toggleModalExclusao(idMetricas){
        swal({
            title: "Excluir Métricas",
            text: "Deseja realmente excluir essas métricas?",
            buttons: {
                cancel: "Cancelar",
                confirm: "Confirmar Exclusão",
            }
        }).then((value) => {
            if(value){
                api.delete(`/excluir-metrica/${idMetricas}`)
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
                                        <button onClick={() => {setMetricas(row.original); setShow(true)}} className="main-btn"><i className="fa-solid fa-pen"></i></button>
                                        &nbsp;<button onClick={() => {toggleModalExclusao(row.original.id_metricas)}} className="main-btn"><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            )
                        })
                        :
                        <tr>
                            <td colSpan={props.table_header.length + 1}>Não existem métricas cadastrados</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
        <div className="table-pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="main-btn">Voltar</button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="main-btn">Próxima</button>
        </div>

        <EditarMetricas onClose={() => setShow(false)} metricas={metricas} show={show}/>
        </>
    );
}

export default TableMetricas;