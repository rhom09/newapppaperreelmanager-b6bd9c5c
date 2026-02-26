/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppData, Supplier, NotaFiscal, Reel } from '../types';
import { loadData, saveData } from '../db/storage';
import { generateUUID } from '../utils/idGenerator';

interface AppContextType {
    data: AppData;
    addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
    updateSupplier: (id: string, updates: Partial<Supplier>) => void;
    deleteSupplier: (id: string, cascade?: boolean) => void;
    deleteReel: (id: string) => void;
    deleteNotaFiscal: (id: string, deleteReels?: boolean) => void;
    addReceiving: (nf: Omit<NotaFiscal, 'id' | 'createdAt' | 'reelIds'>, reels: Omit<Reel, 'id' | 'createdAt' | 'supplierId' | 'nfId' | 'nfNumber' | 'uvpacId'>[]) => void;
    updateReelStatus: (id: string, status: Reel['status'], remainingMeters?: number) => void;
    updateNotaFiscal: (id: string, updates: Partial<NotaFiscal>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AppData>(loadData());

    useEffect(() => {
        saveData(data);
    }, [data]);

    const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
        const newSupplier: Supplier = {
            ...supplier,
            id: generateUUID(),
            createdAt: new Date().toISOString()
        };
        setData(prev => ({
            ...prev,
            suppliers: [...prev.suppliers, newSupplier]
        }));
    };

    const updateSupplier = (id: string, updates: Partial<Supplier>) => {
        setData(prev => ({
            ...prev,
            suppliers: prev.suppliers.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
    };

    const deleteSupplier = (id: string, cascade: boolean = false) => {
        setData(prev => {
            let nextReels = prev.reels;
            let nextNfs = prev.notasFiscais;

            if (cascade) {
                nextReels = prev.reels.filter(r => r.supplierId !== id);
                nextNfs = prev.notasFiscais.filter(nf => nf.supplierId !== id);
            }

            return {
                ...prev,
                suppliers: prev.suppliers.filter(s => s.id !== id),
                reels: nextReels,
                notasFiscais: nextNfs
            };
        });
    };

    const deleteReel = (id: string) => {
        setData(prev => {
            const reelToDelete = prev.reels.find(r => r.id === id);
            if (!reelToDelete) return prev;

            const nextReels = prev.reels.filter(r => r.id !== id);

            // Update associated NF to remove the reel ID
            const nextNfs = prev.notasFiscais.map(nf => {
                if (nf.id === reelToDelete.nfId) {
                    return {
                        ...nf,
                        reelIds: nf.reelIds.filter(rid => rid !== id)
                    };
                }
                return nf;
            });

            return {
                ...prev,
                reels: nextReels,
                notasFiscais: nextNfs
            };
        });
    };

    const deleteNotaFiscal = (id: string, deleteReels: boolean = true) => {
        setData(prev => {
            const nfToDelete = prev.notasFiscais.find(nf => nf.id === id);
            if (!nfToDelete) return prev;

            const nextNfs = prev.notasFiscais.filter(nf => nf.id !== id);
            let nextReels = prev.reels;

            if (deleteReels) {
                nextReels = prev.reels.filter(r => r.nfId !== id);
            } else {
                // Keep reels but detach them from NF? 
                // In this app, reels are tied to NFs, so keeping them might be weird.
                // But for safety, let's just detach or mark them.
                nextReels = prev.reels.map(r => r.nfId === id ? { ...r, nfId: '', nfNumber: 'N/A' } : r);
            }

            return {
                ...prev,
                notasFiscais: nextNfs,
                reels: nextReels
            };
        });
    };

    const addReceiving = (
        nf: Omit<NotaFiscal, 'id' | 'createdAt' | 'reelIds'>,
        reelsData: Omit<Reel, 'id' | 'createdAt' | 'supplierId' | 'nfId' | 'nfNumber' | 'uvpacId'>[]
    ) => {
        const nfId = generateUUID();
        const createdAt = new Date().toISOString();

        let currentUvpac = data.uvpacSequence;

        const newReels: Reel[] = reelsData.map(r => {
            currentUvpac += 1;
            return {
                ...r,
                id: generateUUID(),
                uvpacId: currentUvpac,
                supplierId: nf.supplierId,
                nfId,
                nfNumber: nf.number,
                createdAt
            };
        });

        const newNf: NotaFiscal = {
            ...nf,
            id: nfId,
            reelIds: newReels.map(r => r.id),
            createdAt
        };

        setData(prev => ({
            ...prev,
            notasFiscais: [...prev.notasFiscais, newNf],
            reels: [...prev.reels, ...newReels],
            uvpacSequence: currentUvpac
        }));
    };

    const updateReelStatus = (id: string, status: Reel['status'], remainingMeters?: number) => {
        setData(prev => ({
            ...prev,
            reels: prev.reels.map(r => {
                if (r.id === id) {
                    return { ...r, status, remainingMeters: remainingMeters !== undefined ? remainingMeters : r.remainingMeters };
                }
                return r;
            })
        }));
    };

    const updateNotaFiscal = (id: string, updates: Partial<NotaFiscal>) => {
        setData(prev => ({
            ...prev,
            notasFiscais: prev.notasFiscais.map(nf => nf.id === id ? { ...nf, ...updates } : nf)
        }));
    };

    return (
        <AppContext.Provider value={{
            data,
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
