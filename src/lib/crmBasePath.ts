// Modulo foglia senza dipendenze: evita import circolari con routes.tsx
// (Sidebar, nav-items e Login dipendono da questa costante ma sono a loro
// volta importati, direttamente o indirettamente, da routes.tsx).
export const CRM_BASE_PATH = '/gestionale'
