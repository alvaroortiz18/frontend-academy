export interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email?: string | null;
  direccion?: string | null;
  cedula?: string | null;
  telefono?: string | null;
  etnia_id: number;
  cargo_id: number;
  sexo_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDocenteInput {
  nombres: string;
  apellidos: string;
  email?: string | null;
  direccion?: string | null;
  cedula?: string | null;
  telefono?: string | null;
  etnia_id: number;
  cargo_id: number;
  sexo_id: number;
}

export type UpdateDocenteInput = Partial<CreateDocenteInput>;

export interface Cargo {
  id: number;
  descripcion: string;
}
