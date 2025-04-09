import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { facturaService } from '../../services/api';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    return (
        <div className="mb-4">
            <input
                value={globalFilter || ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Caută factură..."
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
        </div>
    );
};

const InvoiceList = () => {
    const [facturi, setFacturi] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFacturi = async () => {
        setLoading(true);
        try {
            const response = await facturaService.getAll();
            setFacturi(response.data);
        } catch (error) {
            console.error('Error fetching facturi:', error);
            toast.error('Eroare la încărcarea facturilor!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacturi();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Ești sigur că vrei să ștergi această factură?')) {
            try {
                await facturaService.delete(id);
                toast.success('Factură ștearsă cu succes!');
                fetchFacturi();
            } catch (error) {
                console.error('Error deleting factura:', error);
                toast.error('Eroare la ștergerea facturii!');
            }
        }
    };

    const handleGeneratePDF = async (id) => {
        try {
            const response = await axios.get(`/api/facturi/${id}/pdf`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            });

            if (response.headers['content-type'] === 'application/pdf') {
                const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', `factura_${id}.pdf`);
                document.body.appendChild(link);

                link.click();

                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);

                toast.success('PDF generat cu succes!');
            } else {
                console.error('Răspunsul nu este PDF:', response);
                toast.error('Eroare la generarea PDF-ului!');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Eroare la generarea PDF-ului!');
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: 'Nr. Factură',
                accessor: 'numar_factura',
            },
            {
                Header: 'Data',
                accessor: 'data_factura',
                Cell: ({ value }) => format(new Date(value), 'dd.MM.yyyy', { locale: ro }),
            },
            {
                Header: 'Client',
                accessor: 'client.nume',
            },
            {
                Header: 'Total (RON)',
                accessor: 'total_cu_tva',
                Cell: ({ value }) => `${Number(value).toFixed(2)} RON`,
            },
            {
                Header: 'Acțiuni',
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Link
                            to={`/facturi/edit/${row.original.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            Editează
                        </Link>
                        <button
                            onClick={() => handleGeneratePDF(row.original.id)}
                            className="text-green-600 hover:text-green-900"
                        >
                            PDF
                        </button>
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
            data: facturi,
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
                <h2 className="text-xl font-semibold text-gray-800">Lista Facturilor</h2>
                <Link
                    to="/facturi/create"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Adaugă Factură
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

export default InvoiceList;
