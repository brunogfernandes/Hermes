import {useState, useMemo, useEffect} from 'react';
import {useTable, useSortBy, useGlobalFilter, usePagination} from 'react-table';

import ModalDetalhes from '../Modals/detalhes-solicitacoes';

function TableSolicitacoes(props){

    const [show, setShow] = useState(false);
    const [user, setUser] = useState({})

    const table_header = [
        {
            Header: "Nome/Razão Social",
            accessor: "nome_usuario"
        },
        {
            Header: "CPF/CNPJ",
            accessor: "cpf_cnpj_usuario"
        },
        {
            Header: "Email",
            accessor: "email_usuario"
        },
        {
            Header: "Data do Cadastro",
            accessor: "data_cadastro"
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
                                    
                                    <td><button onClick={() => {setUser(row.original); setShow(true)}} className="main-btn"><i className="fa-solid fa-eye"></i></button></td>
                                </tr>
                            )
                        })
                        :
                        <tr>
                            <td colSpan="5">Não existem solicitações de cadastro.</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
        <div className="table-pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="main-btn">Voltar</button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="main-btn">Próxima</button>
        </div>

        <ModalDetalhes onClose={() => setShow(false)} user={user} show={show}/>
        </>
    );
}

export default TableSolicitacoes;