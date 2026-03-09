import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AppData, Supplier, NotaFiscal, Reel } from '../types';
import { fetchAllData, storage } from '../db/storage';

interface AppContextType {
    data: AppData;
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
    addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Promise<void>;
    updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string, cascade?: boolean) => Promise<void>;
    deleteReel: (id: string) => Promise<void>;
    deleteNotaFiscal: (id: string, deleteReels?: boolean) => Promise<void>;
    addReceiving: (nf: Omit<NotaFiscal, 'id' | 'createdAt' | 'reelIds'>, reels: Omit<Reel, 'id' | 'createdAt' | 'supplierId' | 'nfId' | 'nfNumber' | 'uvpacId'>[]) => Promise<void>;
    updateReelStatus: (id: string, status: Reel['status'], remainingMeters?: number) => Promise<void>;
    updateNotaFiscal: (id: string, updates: Partial<NotaFiscal>) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AppData>({ suppliers: [], reels: [], notasFiscais: [], uvpacSequence: 1000 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const newData = await fetchAllData();
            setData(newData);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Falha ao carregar dados do Supabase');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
        try {
            await storage.suppliers.add(supplier);
            await refreshData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
        try {
            await storage.suppliers.update(id, updates);
            await refreshData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteSupplier = async (id: string, _cascade: boolean = false) => {
        try {
            // Note: DB handles cascade delete via ON DELETE CASCADE in schema
            await storage.suppliers.delete(id);
            await refreshData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteReel = async (id: string) => {
        try {
            await storage.reels.delete(id);
            await refreshData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteNotaFiscal = async (id: string, _deleteReels: boolean = true) => {
        try {
            // DB handles cascade reel deletion
            await storage.notasFiscais.delete(id);
            await refreshData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const addReceiving = async (
        nf: Omit<NotaFiscal, 'id' | 'createdAt' | 'reelIds'>,
        reelsData: Omit<Reel, 'id' | 'createdAt' | 'supplierId' | 'nfId' | 'nfNumber' | 'uvpacId'>[]
    ) => {
        try {
            setLoading(true);
            // 1. Create NF
            const insertedNf = await storage.notasFiscais.add({ ...nf, reelIds: [] });

            // 2. Create Reels linked to NF
            let currentSequence = data.uvpacSequence;
            const reelsToInsert = reelsData.map(r => {
                currentSequence += 1;
                return {
                    ...r,
                    uvpacId: currentSequence,
                    supplierId: nf.supplierId,
                    nfId: insertedNf.id,
                    nfNumber: nf.number
                };
            });
            const insertedReels = await storage.reels.addMany(reelsToInsert);

            // 3. Update NF with the list of reel IDs (if required by UI, though redundant due to FK)
            await storage.notasFiscais.update(insertedNf.id, {
                reelIds: insertedReels.map((r: any) => r.id)
            });

            await refreshData();
        } catch (err: any) {
            console.error('Add receiving error:', err);
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const updateReelStatus = async (id: string, status: Reel['status'], remainingMeters?: number) => {
        try {
            await storage.reels.update(id, { status, remainingMeters });
            await refreshData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateNotaFiscal = async (id: string, updates: Partial<NotaFiscal>) => {
        try {
            await storage.notasFiscais.update(id, updates);
            await refreshData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <AppContext.Provider value={{
            data,
            loading,
            error,
            refreshData,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            deleteReel,
            deleteNotaFiscal,
            addReceiving,
            updateReelStatus,
            updateNotaFiscal
        }}>
            {children}
        </AppContext.Provider>
    );
}
