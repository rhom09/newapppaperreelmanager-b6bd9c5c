# Product Requirements Document (PRD) - UVPack Paper Reel Manager

## 1. Product Overview
UVPack is a responsive web application designed for managing paper reel inventory and receiving processes in an industrial environment. The goal is to replace manual spreadsheet tracking with an automated, traceable, and user-friendly system.

## 2. Target Audience
Warehouse operators and production managers responsible for receiving material and maintaining stock accuracy.

## 3. Core Features

### 3.1. Dashboard (Analytics)
- **Goal**: Provide a quick overview of inventory status.
- **Requirements**:
  - KPI cards for "Total de Bobinas", "Bobinas Disponíveis", and "Metragem Estimada em Estoque".
  - Interactive charts showing "Estoque por Fornecedor".
  - Advanced filtering by status, supplier, date range, and NF number.

### 3.2. Supplier Management
- **Goal**: Maintain a registry of paper suppliers.
- **Requirements**:
  - Ability to add, edit, and delete suppliers.
  - Fields: Name, CNPJ, Email, and a unique 4-character Prefix (used for reel codes).

### 3.3. Receiving Process (Novo Lote)
- **Goal**: Register new incoming material from fiscal invoices (NF).
- **Requirements**:
  - Entry form for NF Number and Supplier selection.
  - Multi-reel registration within a single lot.
  - Automatic generation of UVPACK IDs and Material Codes (Prefix + Sequence).

### 3.4. Inventory Management
- **Goal**: Real-time tracking of individual paper reels.
- **Requirements**:
  - Searchable list of all reels.
  - Status management: "Disponível", "Em Uso", "Esgotado".
  - Adjustment of remaining linear meters.
  - Visual progress bars for material consumption.

### 3.5. NF History
- **Goal**: Audit and manage historical receiving records.
- **Requirements**:
  - List of all processed invoices.
  - Ability to edit invoice totals or delete a lot (which removes associated reels).

## 4. Technical Constraints & UI/UX
- **Tech Stack**: React, TypeScript, Vite, Tailwind CSS (or Vanilla CSS with industrial theme).
- **Persistence**: Data is saved to Browser Local Storage.
- **Design**: "Industrial Dark" theme with high contrast and legible typography.
- **Responsiveness**: Full support for Desktop, Tablets, and Mobile devices (using specialized views/cards).

## 5. Known Limitations
- No backend integration; data is local to the device/browser.
- No authentication system (public access within the local environment).
