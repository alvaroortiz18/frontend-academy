"use server";

import { revalidatePath } from "next/cache";
import { Estudiante, Sexo, Etnia, CreateEstudianteInput, UpdateEstudianteInput } from "@/types";

const URL = process.env.GATEWAY_URL;

export async function getEstudiantes(): Promise<Estudiante[]> {
  return getAllStudents();
}

export async function getAllStudents(): Promise<Estudiante[]> {
  const response = await fetch(`${URL}/estudiantes`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Error al obtener estudiantes");
  }

  const data = await response.json();

  if (Array.isArray(data?.data)) return data.data;

  console.error("Error al obtener la data:", data);

  return [];
}

export async function getStudent(id: number): Promise<Estudiante | null> {
  const response = await fetch(`${URL}/estudiantes/${id}`, { cache: "no-store" });

  if (!response.ok) return null;

  const data = await response.json();

  if (data?.data) return data.data;

  return data ?? null;
}

export async function createStudent(input: CreateEstudianteInput): Promise<Estudiante> {
  const response = await fetch(`${URL}/estudiantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al crear estudiante");
  }

  revalidatePath("/estudiantes");
  revalidatePath("/");

  const data = await response.json();
  return data?.data ?? data;
}

export async function updateStudent(id: number, input: UpdateEstudianteInput): Promise<Estudiante> {
  const response = await fetch(`${URL}/estudiantes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al actualizar estudiante");
  }

  revalidatePath("/estudiantes");
  revalidatePath("/");

  const data = await response.json();
  return data?.data ?? data;
}

export async function deleteStudent(id: number): Promise<void> {
  const response = await fetch(`${URL}/estudiantes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al eliminar estudiante");
  }

  revalidatePath("/estudiantes");
  revalidatePath("/");
}

export async function getSexos(): Promise<Sexo[]> {
  const response = await fetch(`${URL}/sexos`, { cache: "no-store" });

  if (!response.ok) return [];

  const data = await response.json();

  if (Array.isArray(data?.data)) return data.data;

  return Array.isArray(data) ? data : [];
}

export async function getEtnias(): Promise<Etnia[]> {
  const response = await fetch(`${URL}/etnias`, { cache: "no-store" });

  if (!response.ok) return [];

  const data = await response.json();

  if (Array.isArray(data?.data)) return data.data;

  return Array.isArray(data) ? data : [];
}
