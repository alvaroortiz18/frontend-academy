"use server";

import { revalidatePath } from "next/cache";
import { Docente, Cargo, CreateDocenteInput, UpdateDocenteInput } from "@/types";

const URL = process.env.GATEWAY_URL;

export async function getAllDocentes(): Promise<Docente[]> {
  const response = await fetch(`${URL}/docentes`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Error al obtener docentes");
  }

  const data = await response.json();

  if (Array.isArray(data?.data)) return data.data;

  console.error("Error al obtener la data:", data);

  return [];
}

export async function getDocente(id: number): Promise<Docente | null> {
  const response = await fetch(`${URL}/docentes/${id}`, { cache: "no-store" });

  if (!response.ok) return null;

  const data = await response.json();

  if (data?.data) return data.data;

  return data ?? null;
}

export async function createDocente(input: CreateDocenteInput): Promise<Docente> {
  const response = await fetch(`${URL}/docentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al crear docente");
  }

  revalidatePath("/docentes");

  const data = await response.json();
  return data?.data ?? data;
}

export async function updateDocente(id: number, input: UpdateDocenteInput): Promise<Docente> {
  const response = await fetch(`${URL}/docentes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al actualizar docente");
  }

  revalidatePath("/docentes");

  const data = await response.json();
  return data?.data ?? data;
}

export async function deleteDocente(id: number): Promise<void> {
  const response = await fetch(`${URL}/docentes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al eliminar docente");
  }

  revalidatePath("/docentes");
}

export async function getCargos(): Promise<Cargo[]> {
  const response = await fetch(`${URL}/docentes/cargos`, { cache: "no-store" });

  if (!response.ok) return [];

  const data = await response.json();

  if (Array.isArray(data?.data)) return data.data;

  return Array.isArray(data) ? data : [];
}
