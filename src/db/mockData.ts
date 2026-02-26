import type { AppData } from '../types';

export const mockData: AppData = {
  suppliers: [
    {
      id: "sup-001",
      name: "Klabin S.A.",
      cnpj: "89.637.490/0001-45",
      email: "vendas@klabin.com.br",
      prefix: "KLAB",
      createdAt: "2024-01-15T10:00:00.000Z"
    },
    {
      id: "sup-002",
      name: "Sylvamo do Brasil",
      cnpj: "42.012.345/0001-99",
      email: "contato@sylvamo.com",
      prefix: "SYLV",
      createdAt: "2024-02-10T14:30:00.000Z"
    },
    {
      id: "sup-003",
      name: "Suzano Papel e Celulose",
      cnpj: "16.404.287/0001-55",
      email: "pedidos@suzano.com.br",
      prefix: "SUZA",
      createdAt: "2024-03-05T09:15:00.000Z"
    }
  ],
  notasFiscais: [
    {
      id: "nf-1001",
      number: "000.123.456",
      supplierId: "sup-001",
      totalGrossWeight: 3150.5,
      totalLinearMeters: 14000,
      totalVolumes: 3,
      reelIds: ["reel-001", "reel-002", "reel-003"],
      createdAt: "2024-04-10T08:00:00.000Z"
    },
    {
      id: "nf-1002",
      number: "000.987.654",
      supplierId: "sup-002",
      totalGrossWeight: 2050.0,
      totalLinearMeters: 8000,
      totalVolumes: 2,
      reelIds: ["reel-004", "reel-005"],
      createdAt: "2024-04-12T13:45:00.000Z"
    }
  ],
  reels: [
    {
      id: "reel-001",
      uvpacId: 1401,
      materialCode: "KLAB.F-001",
      supplierId: "sup-001",
      nfId: "nf-1001",
      nfNumber: "000.123.456",
      width: 1200,
      linearMeters: 5000,
      remainingMeters: 5000,
      grammage: 115,
      netWeight: 1035,
      grossWeight: 1050,
      clientCode: "KLAB-115G-1200",
      status: "disponivel",
      createdAt: "2024-04-10T08:10:00.000Z"
    },
    {
      id: "reel-002",
      uvpacId: 1402,
      materialCode: "KLAB.F-002",
      supplierId: "sup-001",
      nfId: "nf-1001",
      nfNumber: "000.123.456",
      width: 1200,
      linearMeters: 5000,
      remainingMeters: 2300,
      grammage: 115,
      netWeight: 1035,
      grossWeight: 1050,
      clientCode: "KLAB-115G-1200",
      status: "em_uso",
      createdAt: "2024-04-10T08:15:00.000Z"
    },
    {
      id: "reel-003",
      uvpacId: 1403,
      materialCode: "KLAB.F-003",
      supplierId: "sup-001",
      nfId: "nf-1001",
      nfNumber: "000.123.456",
      width: 1000,
      linearMeters: 4000,
      remainingMeters: 0,
      grammage: 90,
      netWeight: 1035,
      grossWeight: 1050.5,
      clientCode: "KLAB-90G-1000",
      status: "esgotado",
      createdAt: "2024-04-10T08:20:00.000Z"
    },
    {
      id: "reel-004",
      uvpacId: 1404,
      materialCode: "SYLV.F-001",
      supplierId: "sup-002",
      nfId: "nf-1002",
      nfNumber: "000.987.654",
      width: 800,
      linearMeters: 4000,
      remainingMeters: 4000,
      grammage: 75,
      netWeight: 1010,
      grossWeight: 1025,
      clientCode: "SYLV-75G-800",
      status: "disponivel",
      createdAt: "2024-04-12T14:00:00.000Z"
    },
    {
      id: "reel-005",
      uvpacId: 1405,
      materialCode: "SYLV.F-002",
      supplierId: "sup-002",
      nfId: "nf-1002",
      nfNumber: "000.987.654",
      width: 800,
      linearMeters: 4000,
      remainingMeters: 4000,
      grammage: 75,
      netWeight: 1010,
      grossWeight: 1025,
      clientCode: "SYLV-75G-800",
      status: "disponivel",
      createdAt: "2024-04-12T14:05:00.000Z"
    }
  ],
  uvpacSequence: 1405
};
