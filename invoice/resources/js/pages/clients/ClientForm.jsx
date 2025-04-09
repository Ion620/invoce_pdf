import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { clientService } from '../../services/api';
import { toast } from 'react-toastify';

const ClientForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        const fetchClient = async () => {
            if (isEditMode) {
                try {
                    const response = await clientService.getById(id);
                    reset(response.data);
                } catch (error) {
                    console.error('Error fetching client:', error);
                    toast.error('Eroare la încărcarea datelor clientului!');
                    navigate('/clients');
                } finally {
                    setInitialLoading(false);
                }
            }
        };

        fetchClient();
    }, [id, isEditMode, reset, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                await clientService.update(id, data);
                toast.success('Client actualizat cu succes!');
            } else {
                await clientService.create(data);
                toast.success('Client adăugat cu succes!');
            }
            navigate('/clients');
        } catch (error) {
            console.error('Error saving client:', error);
            toast.error('Eroare la salvarea clientului!');
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
                {isEditMode ? 'Editare Client' : 'Client Nou'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="nume" className="block text-sm font-medium text-gray-700">Nume</label>
                        <input
                            type="text"
                            id="nume"
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nume ? 'border-red-500' : ''}`}
                            {...register('nume', { required: 'Numele este obligatoriu' })}
                        />
                        {errors.nume && <p className="mt-1 text-sm text-red-600">{errors.nume.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="cui" className="block text-sm font-medium text-gray-700">CUI</label>
                        <input
                            type="text"
                            id="cui"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('cui')}
                        />
                    </div>

                    <div>
                        <label htmlFor="nr_onrc" className="block text-sm font-medium text-gray-700">Nr. ONRC</label>
                        <input
                            type="text"
                            id="nr_onrc"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('nr_onrc')}
                        />
                    </div>

                    <div>
                        <label htmlFor="sediul" className="block text-sm font-medium text-gray-700">Sediul</label>
                        <input
                            type="text"
                            id="sediul"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('sediul')}
                        />
                    </div>

                    <div>
                        <label htmlFor="judetul" className="block text-sm font-medium text-gray-700">Județul</label>
                        <input
                            type="text"
                            id="judetul"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('judetul')}
                        />
                    </div>

                    <div>
                        <label htmlFor="cod_iban" className="block text-sm font-medium text-gray-700">Cod IBAN</label>
                        <input
                            type="text"
                            id="cod_iban"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('cod_iban')}
                        />
                    </div>

                    <div>
                        <label htmlFor="banca" className="block text-sm font-medium text-gray-700">Banca</label>
                        <input
                            type="text"
                            id="banca"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...register('banca')}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/clients')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Anulează
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Se salvează...' : 'Salvează'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientForm;
