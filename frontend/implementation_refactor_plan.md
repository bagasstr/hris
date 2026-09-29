# Refactor to Feature-Based Architecture

Refactor repository structure from a flat/mixed structure into a scalable **Feature-Based (Domain-Driven) Architecture**. This separates domain logic (Auth, Employees, Attendance, Payroll, Dashboard) from generic UI components and routing.

## Proposed Architecture

```text
src/
├── app/                          # Routing & Pages layer (Thin Pages)
│   ├── (auth)/                   # Route Group: Auth (tanpa prefix URL)
│   │   ├── login/
│   │   │   └── page.tsx          # Hanya render <LoginForm /> dari features/auth
│   │   └── regist-employee/
│   │       └── page.tsx
│   ├── (dashboard)/              # Route Group: Dashboard & App
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── employees/            # (Mendatang)
│   │   ├── attendance/           # (Mendatang)
│   │   └── layout.tsx            # Dashboard shell (Sidebar + Navbar)
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx                # Root layout
│
├── features/                     # ⭐️ CORE: Domain-specific modules
│   ├── auth/                     # Fitur Autentikasi
│   │   ├── components/           # login-form.tsx, register-employee-form.tsx
│   │   ├── schemas/              # auth-schema.ts (Zod)
│   │   ├── services/             # auth-api.ts (fetch ke Hono BE)
│   │   ├── types/                # index.ts
│   │   └── index.ts              # Public barrel export
│   │
│   ├── dashboard/                # Fitur Dashboard Overview
│   │   ├── components/           # dashboard-stats.tsx, recent-activities.tsx
│   │   └── index.ts
│   │
│   ├── employees/                # Fitur Karyawan (struktur disiapkan)
│   │   ├── components/
│   │   └── index.ts
│   │
│   └── attendance/               # Fitur Presensi (struktur disiapkan)
│       └── index.ts
│
├── components/                   # Generic / Shared Components ONLY
│   ├── ui/                       # Primitive components dari shadcn (button, input, etc.)
│   ├── layout/                   # Layout shell components (app-sidebar, navbar, logo, nav-main)
│   └── shared/                   # Reusable shared components non-domain
│
├── constants/                    # Global constants
│   └── navigation.ts             # Menu sidebar & config navigasi (sebelumnya sidebar.ts)
│
├── hooks/                        # Generic / Global hooks (misal: use-mobile.ts)
├── lib/                          # Utility functions (utils.ts, api-client.ts)
└── proxy.ts                      # Next.js 16 Gateway (Auth redirection)
```

---

## User Review Required

> [!IMPORTANT]
>
> 1. **Route Grouping**: Mengubah `src/app/auth/...` menjadi route group `src/app/(auth)/...` atau tetap `src/app/auth/...`?
>     - Dengan `(auth)`, URL login bisa tetap `/auth/login` (jika folder `auth` dipertahankan) atau langsung `/login` (lebih ringkas & umum di SaaS).
> 2. **Pembersihan File Duplikat**: Saat ini ada dua logo dan dua sidebar (`src/components/shared/appsidebar.tsx` & `src/components/app-sidebar.tsx`, serta `src/components/logo.tsx` & `src/components/shared/logo.tsx`). Kami akan menyatukannya ke `src/components/layout/`.

---

## Proposed Changes

### 1. `src/features/` (New Feature Directory)

#### [NEW] `src/features/auth/`

- `components/login-form.tsx`: Komponen UI login form dengan React Hook Form + Zod.
- `schemas/auth-schema.ts`: Skema validasi login & register karyawan.
- `services/auth-service.ts`: Fungsi komunikasi ke backend Hono.
- `types/index.ts`: Tipe data user & response login.
- `index.ts`: Barrel export untuk module auth.

#### [NEW] `src/features/dashboard/`

- Struktur folder disiapkan untuk komponen analitik & ringkasan dashboard.

---

### 2. `src/components/` (Reorganize & Clean Up)

#### [MODIFY] Pindahkan Layout Components ke `src/components/layout/`

- Pindahkan:
    - `app-sidebar.tsx`
    - `nav-main.tsx`, `nav-user.tsx`, `nav-projects.tsx`, `team-switcher.tsx`
    - `Navbar.tsx`
    - `logo.tsx`
- Hapus file duplikat lama:
    - `src/components/shared/appsidebar.tsx`
    - `src/components/shared/logo.tsx`

---

### 3. `src/app/` (Thin Pages Refactoring)

#### [MODIFY] `src/app/auth/login/page.tsx`

- Mengimpor dan merender `<LoginForm />` dari `@//features/auth`.

#### [MODIFY] `src/app/dashboard/layout.tsx`

- Memperbarui path import `AppSidebar` dari `@/components/layout/app-sidebar`.

---

### 4. `src/constants/`

- Rename atau rapikan `sidebar.ts` -> `navigation.ts` (dengan alias/export tetap terjaga).

---

## Verification Plan

### Automated Verification

1. Jalankan TypeScript type-check untuk memastikan tidak ada import path yang rusak:
    ```bash
    bun x tsc --noEmit
    ```
2. Pastikan dev server berjalan tanpa error:
    ```bash
    bun dev
    ```

### Manual Verification

1. Buka browser di `http://localhost:3000/auth/login` (atau `/login`) dan pastikan halaman login termuat rapi.
2. Buka `http://localhost:3000/dashboard` dan pastikan sidebar + layout tetap berjalan normal.
