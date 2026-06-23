"use server";

const URL = process.env.GATEWAY_URL;

export async function uploadAvatar(model: string, modelId: number, formData: FormData) {
  const response = await fetch(`${URL}/files/upload/${model}/${modelId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error al subir avatar');
  }

  return response.json();
}

export async function getFilesByModelId(model: string, modelId: number) {
  const response = await fetch(`${URL}/files?model=${model}&modelId=${modelId}`, {
    cache: 'no-store',
  });

  if (!response.ok) return [];

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
