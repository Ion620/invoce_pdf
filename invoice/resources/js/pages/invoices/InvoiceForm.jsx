import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { clientService, facturaService, productService } from '../../services/api';
import { toast } from 'react-toastify';

const InvoiceForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    const { control, register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        defaultValues: {
            client_id: '',
            numar_factura: '',
            data_factura: new Date(),
            are_aviz: false,
            numar_aviz: '',
            cota_tva: 19,
            delegat: '',
            seria_bi: '',
            numar_bi: '',
            cnp: '',
            mijloc_transport: '',
            numar_auto: '',
            produse: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "produse"
    });

    const watchProduse = watch("produse");
    const watchCotaTva = watch("cota_tva");

    const calculateTotals = () => {
        let totalFaraTva = 0;

        if (watchProduse && watchProduse.length > 0) {
            watchProduse.forEach(produs => {
                if (produs.cantitate && produs.pret_unitar) {
                    totalFaraTva += parseFloat(produs.cantitate) * parseFloat(produs.pret_unitar);
                }
            });
        }

        const totalTva = totalFaraTva * (parseFloat(watchCotaTva) / 100);
        const totalCuTva = totalFaraTva + totalTva;

        return {
            totalFaraTva: totalFaraTva.toFixed(2),
            totalTva: totalTva.toFixed(2),
            totalCuTva: totalCuTva.toFixed(2)
        };
    };

    const totals = calculateTotals();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientsResponse = await clientService.getAll();
                setClients(clientsResponse.data);

                const productsResponse = await productService.getAll();
                setProducts(productsResponse);

                if (isEditMode) {
                    const facturaResponse = await facturaService.getById(id);
                    const factura = facturaResponse.data;

                    factura.data_factura = new Date(factura.data_factura);

                    const produse = factura.detalii.map(item => ({
                        id_produs: item.id_produs,
                        denumire: item.denumire,
                        unitate_masura: item.unitate_masura,
                        cantitate: item.cantitate,
                        pret_unitar: item.pret_unitar
                    }));

                    reset({
                        ...factura,
                        produse
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Eroare la încărcarea datelor!');
                if (isEditMode) {
                    navigate('/facturi');
                }
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode, reset, navigate]);

    const handleAddProduct = () => {
        append({ id_produs: '', denumire: '', unitate_masura: '', cantitate: 1, pret_unitar: 0 });
    };

    const handleProductChange = (index, productId) => {
        if (productId) {
            const product = products.find(p => p.id_produs == productId);
            if (product) {
                setValue(`produse.${index}.denumire`, product.denumire_produs);
                setValue(`produse.${index}.unitate_masura`, product.unitate_masura);
                setValue(`produse.${index}.pret_unitar`, product.pret);
            }
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                await facturaService.update(id, data);
                toast.success('Factură actualizată cu succes!');
            } else {
                await facturaService.create(data);
                toast.success('Factură adăugată cu succes!');
            }
            navigate('/facturi');
        } catch (error) {
            console.error('Error saving factura:', error);
            toast.error('Eroare la salvarea facturii!');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="text-center py-10">Încărcare...</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditMode ? 'Editare Factură' : 'Factură Nouă'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">Client</label>
                        <select
                            id="client_id"
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.client_id ? 'border-red-500' : ''}`}
                            {...register('client_id', { required: 'Clientul este obligatoriu' })}
                        >
                            <option value="">Selectează client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.nume}</option>
                            ))}
                        </select>
                        {errors.client_id && <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="numar_factura" className="block text-sm font-medium text-gray-700">Număr Factură</label>
                        <input
                            type="text"
                            id="numar_factura"
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.numar_factura ? 'border-red-500' : ''}`}
                            {...register('numar_factura', { required: 'Numărul facturii este obligatoriu' })}
                        />
                        {errors.numar_factura && <p className="mt-1 text-sm text-red-600">{errors.numar_factura.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="data_factura" className="block text-sm font-medium text-gray-700">Data Facturii</label>
                        <Controller
                            control={control}
                            name="data_factura"
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    dateFormat="dd/MM/yyyy"
                                />
                            )}
                            rules={{ required: 'Data facturii este obligatorie' }}
                        />
                        {errors.data_factura && <p className="mt-1 text-sm text-red-600">{errors.data_factura.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="cota_tva" className="block text-sm font-medium text-gray-700">Cota TVA (%)</label>
                        <input
                            type="number"
                            id="cota_tva"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('cota_tva', { required: 'Cota TVA este obligatorie', min: 0 })}
                        />
                        {errors.cota_tva && <p className="mt-1 text-sm text-red-600">{errors.cota_tva.message}</p>}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="are_aviz"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        {...register('are_aviz')}
                    />
                    <label htmlFor="are_aviz" className="text-sm font-medium text-gray-700">Are aviz de însoțire?</label>
                </div>

                {watch('are_aviz') && (
                    <div>
                        <label htmlFor="numar_aviz" className="block text-sm font-medium text-gray-700">Număr Aviz</label>
                        <input
                            type="text"
                            id="numar_aviz"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('numar_aviz')}
                        />
                    </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Informații delegat</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <label htmlFor="delegat" className="block text-sm font-medium text-gray-700">Nume Delegat</label>
                            <input
                                type="text"
                                id="delegat"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                {...register('delegat')}
                            />
                        </div>

                        <div>
                            <label htmlFor="seria_bi" className="block text-sm font-medium text-gray-700">Seria B.I.</label>
                            <input
                                type="text"
                                id="seria_bi"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                {...register('seria_bi')}
                            />
                        </div>

                        <div>
                            <label htmlFor="numar_bi" className="block text-sm font-medium text-gray-700">Număr B.I.</label>
                            <input
                                type="text"
                                id="numar_bi"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                {...register('numar_bi')}
                            />
                        </div>

                        <div>
                            <label htmlFor="cnp" className="block text-sm font-medium text-gray-700">CNP</label>
                            <input
                                type="text"
                                id="cnp"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                {...register('cnp')}
                            />
                        </div>

                        <div>
                            <label htmlFor="mijloc_transport" className="block text-sm font-medium text-gray-700">Mijloc de Transport</label>
                            <input
                                type="text"
                                id="mijloc_transport"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                {...register('mijloc_transport')}
                            />
                        </div>

                        <div>
                            <label htmlFor="numar_auto" className="block text-sm font-medium text-gray-700">Număr Auto</label>
                            <input
                                type="text"
                                id="numar_auto"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                {...register('numar_auto')}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">Produse</h3>
                        <button
                            type="button"
                            onClick={handleAddProduct}
                            className="px-4 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Adaugă Produs
                        </button>
                    </div>

                    {fields.length === 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Nu există produse adăugate. Apasă pe butonul "Adaugă Produs" pentru a adăuga produse pe factură.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-12 gap-4 mb-4 items-end">
                            <div className="col-span-3">
                                <label htmlFor={`produse.${index}.id_produs`} className="block text-sm font-medium text-gray-700">Produs</label>
                                <select
                                    id={`produse.${index}.id_produs`}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.produse?.[index]?.id_produs ? 'border-red-500' : ''}`}
                                    {...register(`produse.${index}.id_produs`, { required: 'Produsul este obligatoriu' })}
                                    onChange={(e) => handleProductChange(index, e.target.value)}
                                >
                                    <option value="">Selectează produs</option>
                                    {products.map(product => (
                                        <option key={product.id_produs} value={product.id_produs}>
                                            {product.denumire_produs} ({product.unitate_masura}) - {product.pret} RON
                                        </option>
                                    ))}
                                </select>
                                {errors.produse?.[index]?.id_produs && (
                                    <p className="mt-1 text-sm text-red-600">{errors.produse[index].id_produs.message}</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label htmlFor={`produse.${index}.denumire`} className="block text-sm font-medium text-gray-700">Denumire</label>
                                <input
                                    type="text"
                                    id={`produse.${index}.denumire`}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    {...register(`produse.${index}.denumire`, { required: 'Denumirea este obligatorie' })}
                                    readOnly
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor={`produse.${index}.unitate_masura`} className="block text-sm font-medium text-gray-700">U.M.</label>
                                <input
                                    type="text"
                                    id={`produse.${index}.unitate_masura`}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    {...register(`produse.${index}.unitate_masura`, { required: 'U.M. este obligatorie' })}
                                    readOnly
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor={`produse.${index}.cantitate`} className="block text-sm font-medium text-gray-700">Cantitate</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id={`produse.${index}.cantitate`}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.produse?.[index]?.cantitate ? 'border-red-500' : ''}`}
                                    {...register(`produse.${index}.cantitate`, {
                                        required: 'Cantitatea este obligatorie',
                                        min: { value: 0.01, message: 'Cantitatea trebuie să fie pozitivă' },
                                        valueAsNumber: true
                                    })}
                                />
                                {errors.produse?.[index]?.cantitate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.produse[index].cantitate.message}</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label htmlFor={`produse.${index}.pret_unitar`} className="block text-sm font-medium text-gray-700">Preț Unitar</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id={`produse.${index}.pret_unitar`}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    {...register(`produse.${index}.pret_unitar`, {
                                        required: 'Prețul este obligatoriu',
                                        min: { value: 0, message: 'Prețul nu poate fi negativ' },
                                        valueAsNumber: true
                                    })}
                                    readOnly
                                />
                            </div>

                            <div className="col-span-1">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Total</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Total fără TVA</div>
                            <div className="text-xl font-bold">{totals.totalFaraTva} RON</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Total TVA ({watchCotaTva}%)</div>
                            <div className="text-xl font-bold">{totals.totalTva} RON</div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="text-sm text-indigo-500">Total cu TVA</div>
                            <div className="text-xl font-bold text-indigo-600">{totals.totalCuTva} RON</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/facturi')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Anulează
                    </button>
                    <button
                        type="submit"
                        disabled={loading || fields.length === 0}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${fields.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                    >
                        {loading ? 'Se salvează...' : 'Salvează'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;
