-- Create Suppliers Table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    email TEXT,
    prefix TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Notas Fiscais Table
CREATE TABLE notas_fiscais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number TEXT NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    total_gross_weight FLOAT8,
    total_linear_meters FLOAT8,
    total_volumes INTEGER,
    reel_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Reels Table
CREATE TABLE reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uvpac_id INTEGER NOT NULL,
    material_code TEXT NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    nf_id UUID REFERENCES notas_fiscais(id) ON DELETE CASCADE,
    nf_number TEXT,
    width FLOAT8,
    linear_meters FLOAT8,
    remaining_meters FLOAT8,
    grammage FLOAT8,
    net_weight FLOAT8,
    gross_weight FLOAT8,
    client_code TEXT,
    status TEXT NOT NULL CHECK (status IN ('disponivel', 'em_uso', 'esgotado')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequence for uvpac_id if needed, but app manages it
-- Re-enable this if you want DB to handle uvpac_id:
-- CREATE SEQUENCE uvpac_sequence START WITH 1000;

-- Disable RLS for now as requested
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais DISABLE ROW LEVEL SECURITY;
ALTER TABLE reels DISABLE ROW LEVEL SECURITY;
