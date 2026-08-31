# Design System: StudyGen AI (Clean & Soft Modern UI)

## 1. Visual Theme & Atmosphere
The StudyGen AI platform follows a **Clean, Soft & Human-Centered Design System** inspired by modern educational platforms (such as NextIQ). The design prioritizes readability, generous whitespace, soft neutral tones, and elegant pill-shaped controls without aggressive dark themes or noisy gradients.

* **Mood:** Calm, clean, approachable, professional, and readable.
* **Theme:** Soft Light Mode with high contrast typography and clean charcoal CTAs.
* **Elevation & Depth:** 
  * Primary Canvas: Pure White (`#FFFFFF`) and Soft Off-White (`#F9FAFB`)
  * Cards & Containers: White (`#FFFFFF`) with 1px soft border (`#E5E7EB` / `border-gray-200`) and subtle drop shadows (`shadow-sm`)
  * Input Fields & Search Pills: Off-White (`#F3F4F6` / `#FFFFFF`) with pill-rounded borders (`rounded-full` / `rounded-2xl`)

---

## 2. Color Palette & Roles

| Color Name | Hex Code / Class | Functional Role |
| :--- | :--- | :--- |
| **Pure White Canvas** | `#FFFFFF` (`bg-white`) | Main page canvas, hero container backgrounds, and primary cards |
| **Soft Off-White** | `#F9FAFB` (`bg-gray-50`) | Section background contrast, table headers, and pill container backgrounds |
| **Border Neutral** | `#E5E7EB` (`border-gray-200`) | Clean card borders, section dividers, and input outlines |
| **Solid Dark Charcoal** | `#18181B` (`bg-zinc-900`) | **Primary Action Buttons** (`rounded-full`), active pill states, and main headings |
| **Soft Secondary Pill** | `#FFFFFF` (`bg-white border-gray-200`) | Secondary action buttons, filter options, and search pill tags |
| **Soft Mint Accent** | `#059669` (`bg-emerald-50 text-emerald-700`) | Status badges, progress bars, and positive indicators |
| **Text Primary (Charcoal)** | `#18181B` (`text-zinc-900`) | Main headlines, title text, and active navigation links |
| **Text Secondary (Muted)** | `#64748B` (`text-slate-500`) | Body text, subheadings, helper hints, and timestamps |

---

## 3. Button & Pill Guidelines

* **Primary CTAs:** Solid Dark Charcoal pill buttons (`bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-semibold px-6 py-3 shadow-sm transition-all`).
* **Secondary CTAs:** Soft outline pill buttons (`bg-white hover:bg-gray-50 border border-gray-200 text-zinc-800 rounded-full font-semibold px-5 py-2.5 transition-all`).
* **Input Search Bars:** Fully rounded pill input search containers (`rounded-full border border-gray-200 px-5 py-3 bg-white`).
* **No Artificial AI Gradients:** Avoid heavy background gradients, neon blurs, or glow effects. Keep fills flat, clean, and soft.

---

## 4. Page Architecture & Routing

* **`/` (Landing Page):** Clean white Hero header with pill search bar, trusted company proof strip, 6-feature grid, 3-step workflow, interactive demo container, and soft footer.
* **`/studio` (Studio Workspace):** Dual-column study creator with soft white cards, pill difficulty selectors, and structured output tabs.
