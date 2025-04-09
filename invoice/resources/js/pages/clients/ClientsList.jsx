import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../../services/api';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { toast } from 'react-toastify';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    return (
        <div className="mb-4">
            <input
                value={globalFilter || ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Caută client..."
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
        </div>
    );
};

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await clientService.getAll();
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Eroare la încărcarea clienților!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Ești sigur că vrei să ștergi acest client?')) {
            try {
                await clientService.delete(id);
                toast.success('Client șters cu succes!');
                fetchClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                toast.error('Eroare la ștergerea clientului!');
            }
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: 'Nume',
                accessor: 'nume',
            },
            {
                Header: 'CUI',
                accessor: 'cui',
            },
            {
                Header: 'Nr. ONRC',
                accessor: 'nr_onrc',
            },
            {
                Header: 'Sediul',
                accessor: 'sediul',
            },
            {
                Header: 'Acțiuni',
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Link
                            to={`/clients/edit/${row.original.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            Editează
                        </Link>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                            Șterge
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data: clients,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    if (loading) {
        return <div className="text-center py-10">Încărcare...</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Lista Clienților</h2>
                <Link
                    to="/clients/create"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Adaugă Client
                </Link>
            </div>

            <GlobalFilter
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />

            <div className="overflow-x-auto">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.render('Header')}
                                    <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        Pagina{' '}
                        <span className="font-medium">{pageIndex + 1}</span>{' '}
                        din{' '}
                        <span className="font-medium">{pageOptions.length}</span>
                    </span>
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Arată {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className={`px-3 py-1 rounded ${!canPreviousPage ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {'<<'}
                    </button>
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className={`px-3 py-1 rounded ${!canPreviousPage ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {'<'}
                    </button>
                    <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className={`px-3 py-1 rounded ${!canNextPage ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {'>'}
                    </button>
                    <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        className={`px-3 py-1 rounded ${!canNextPage ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientsList;
