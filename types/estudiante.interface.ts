export interface Estudiante {
  id: number;
  nombres: string;
  paterno: string;
  materno?: string | null;
  sexo_id: number;
  direccion: string;
  etnia_id: number;
  created_at: string;
  updated_at: string;
}

export interface Sexo {
  id: number;
  nombre: string;
}

export interface Etnia {
  id: number;
  nombre: string;
}

export interface EstudianteDashboard {
  id: number;
  nombre: string;
  apellido: string;
  sexo: "M" | "F";
  etnia: string;
}

export interface CreateEstudianteInput {
  nombres: string;
  paterno: string;
  materno?: string | null;
  sexo_id: number;
  direccion: string;
  etnia_id: number;
}

export type UpdateEstudianteInput = CreateEstudianteInput;
