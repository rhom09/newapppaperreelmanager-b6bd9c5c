import { supabase } from '../lib/supabase';
import type { AppData, Supplier, Reel, NotaFiscal } from '../types';

// Helper to convert snake_case (DB) to camelCase (App) if necessary, 
// though I designed the migration to match mostly.
// But some fields like created_at vs createdAt need handling.

export const fetchAllData = async (): Promise<AppData> => {
    const [suppliersRes, reelsRes, nfsRes] = await Promise.all([
        supabase.from('suppliers').select('*').order('created_at', { ascending: true }),
        supabase.from('reels').select('*').order('created_at', { ascending: true }),
        supabase.from('notas_fiscais').select('*').order('created_at', { ascending: true })
    ]);

    if (suppliersRes.error) throw suppliersRes.error;
    if (reelsRes.error) throw reelsRes.error;
    if (nfsRes.error) throw nfsRes.error;

    // Map snake_case to camelCase for the app
    const suppliers: Supplier[] = (suppliersRes.data || []).map(s => ({
        id: s.id,
        name: s.name,
        cnpj: s.cnpj,
        email: s.email || '',
        prefix: s.prefix || '',
        createdAt: s.created_at
    }));

    const reels: Reel[] = (reelsRes.data || []).map(r => ({
        id: r.id,
        uvpacId: r.uvpac_id,
        materialCode: r.material_code,
        supplierId: r.supplier_id,
        nfId: r.nf_id,
        nfNumber: r.nf_number || '',
        width: r.width,
        linearMeters: r.linear_meters,
        remainingMeters: r.remaining_meters,
        grammage: r.grammage,
        netWeight: r.net_weight,
        grossWeight: r.gross_weight,
        clientCode: r.client_code || '',
        status: r.status as any,
        createdAt: r.created_at
    }));

    const notasFiscais: NotaFiscal[] = (nfsRes.data || []).map(nf => ({
        id: nf.id,
        number: nf.number,
        supplierId: nf.supplier_id,
        totalGrossWeight: nf.total_gross_weight,
        totalLinearMeters: nf.total_linear_meters,
        totalVolumes: nf.total_volumes,
        reelIds: nf.reel_ids || [],
        createdAt: nf.created_at
    }));

    // Detect next uvpacSequence
    const maxUvpac = reels.length > 0 ? Math.max(...reels.map(r => r.uvpacId)) : 1000;

    return {
        suppliers,
        reels,
        notasFiscais,
        uvpacSequence: maxUvpac
    };
};

export const storage = {
    suppliers: {
        async add(supplier: Omit<Supplier, 'id' | 'createdAt'>) {
            const { data, error } = await supabase.from('suppliers').insert([{
                name: supplier.name,
                cnpj: supplier.cnpj,
                email: supplier.email,
                prefix: supplier.prefix
            }]).select().single();
            if (error) throw error;
            return data;
        },
        async update(id: string, updates: Partial<Supplier>) {
            const { error } = await supabase.from('suppliers').update(updates).eq('id', id);
            if (error) throw error;
        },
        async delete(id: string) {
            const { error } = await supabase.from('suppliers').delete().eq('id', id);
            if (error) throw error;
        }
    },
    reels: {
        async addMany(reels: Omit<Reel, 'id' | 'createdAt'>[]) {
            const { data, error } = await supabase.from('reels').insert(
                reels.map(r => ({
                    uvpac_id: r.uvpacId,
                    material_code: r.materialCode,
                    supplier_id: r.supplierId,
                    nf_id: r.nfId,
                    nf_number: r.nfNumber,
                    width: r.width,
                    linear_meters: r.linearMeters,
                    remaining_meters: r.remainingMeters,
                    grammage: r.grammage,
                    net_weight: r.netWeight,
                    gross_weight: r.grossWeight,
                    client_code: r.clientCode,
                    status: r.status
                }))
            ).select();
            if (error) throw error;
            return data;
        },
        async update(id: string, updates: Partial<Reel>) {
            // Map camelCase to snake_case if necessary for updates
            const dbUpdates: any = {};
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.remainingMeters !== undefined) dbUpdates.remaining_meters = updates.remainingMeters;

            const { error } = await supabase.from('reels').update(dbUpdates).eq('id', id);
            if (error) throw error;
        },
        async delete(id: string) {
            const { error } = await supabase.from('reels').delete().eq('id', id);
            if (error) throw error;
        }
    },
    notasFiscais: {
        async add(nf: Omit<NotaFiscal, 'id' | 'createdAt'>) {
            const { data, error } = await supabase.from('notas_fiscais').insert([{
                number: nf.number,
                supplier_id: nf.supplierId,
                total_gross_weight: nf.totalGrossWeight,
                total_linear_meters: nf.totalLinearMeters,
                total_volumes: nf.totalVolumes,
                reel_ids: nf.reelIds
            }]).select().single();
            if (error) throw error;
            return data;
        },
        async update(id: string, updates: Partial<NotaFiscal>) {
            const dbUpdates: any = {};
            if (updates.number) dbUpdates.number = updates.number;
            if (updates.totalGrossWeight !== undefined) dbUpdates.total_gross_weight = updates.totalGrossWeight;
            if (updates.totalLinearMeters !== undefined) dbUpdates.total_linear_meters = updates.totalLinearMeters;
            if (updates.totalVolumes !== undefined) dbUpdates.total_volumes = updates.totalVolumes;
            if (updates.reelIds) dbUpdates.reel_ids = updates.reelIds;

            const { error } = await supabase.from('notas_fiscais').update(dbUpdates).eq('id', id);
            if (error) throw error;
        },
        async delete(id: string) {
            const { error } = await supabase.from('notas_fiscais').delete().eq('id', id);
            if (error) throw error;
        }
    }
};

// Compatibility export (will be handled by Context updates)
export const loadData = () => ({ suppliers: [], reels: [], notasFiscais: [], uvpacSequence: 1000 });
export const saveData = () => { };
