export type ReelStatus = 'disponivel' | 'em_uso' | 'esgotado';

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  prefix: string;
  createdAt: string;
}

export interface Reel {
  id: string;
  uvpacId: number;
  materialCode: string;
  supplierId: string;
  nfId: string;
  nfNumber: string;
  width: number;
  linearMeters: number;
  remainingMeters: number;
  grammage: number;
  netWeight: number;
  grossWeight: number;
  clientCode: string;
  status: ReelStatus;
  createdAt: string;
}

export interface NotaFiscal {
  id: string;
  number: string;
  supplierId: string;
  totalGrossWeight: number;
  totalLinearMeters: number;
  totalVolumes: number;
  reelIds: string[];
  createdAt: string;
}

export interface AppData {
  suppliers: Supplier[];
  reels: Reel[];
  notasFiscais: NotaFiscal[];
  uvpacSequence: number;
}
