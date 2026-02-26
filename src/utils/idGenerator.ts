import type { Reel } from '../types';

export function generateMaterialCode(prefix: string, existingReels: Reel[], supplierId: string): string {
    const supplierReels = existingReels.filter(r => r.supplierId === supplierId);
    const seq = supplierReels.length + 1;
    const paddedSeq = String(seq).padStart(3, '0');
    return `${prefix.toUpperCase()}.F-${paddedSeq}`;
}

export function generateNextMaterialCode(prefix: string, currentCount: number): string {
    const seq = currentCount + 1;
    const paddedSeq = String(seq).padStart(3, '0');
    return `${prefix.toUpperCase()}.F-${paddedSeq}`;
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function formatCNPJ(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

export function generatePrefixFromName(name: string): string {
    const words = name.trim().toUpperCase().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 3);
    return words.map(w => w[0]).join('').slice(0, 4);
}
