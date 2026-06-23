"use client";

import { useState } from "react";
import { Sexo, Etnia, Cargo, Docente } from "@/types";

interface DocenteFormProps {
  sexos: Sexo[];
  etnias: Etnia[];
  cargos: Cargo[];
  docente?: Docente | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function DocenteForm({ sexos, etnias, cargos, docente, onSubmit, onCancel }: DocenteFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded-lg border border-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombres" className="block text-sm font-medium text-slate-300 mb-1">
            Nombres
          </label>
          <input
            id="nombres"
            name="nombres"
            type="text"
            required
            defaultValue={docente?.nombres ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-slate-300 mb-1">
            Apellidos
          </label>
          <input
            id="apellidos"
            name="apellidos"
            type="text"
            required
            defaultValue={docente?.apellidos ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={docente?.email ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="cedula" className="block text-sm font-medium text-slate-300 mb-1">
            C&eacute;dula
          </label>
          <input
            id="cedula"
            name="cedula"
            type="text"
            defaultValue={docente?.cedula ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-slate-300 mb-1">
            Tel&eacute;fono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="text"
            defaultValue={docente?.telefono ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sexo_id" className="block text-sm font-medium text-slate-300 mb-1">
            Sexo
          </label>
          <select
            id="sexo_id"
            name="sexo_id"
            required
            defaultValue={docente?.sexo_id ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="" disabled>Seleccionar...</option>
            {sexos.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="etnia_id" className="block text-sm font-medium text-slate-300 mb-1">
            Etnia
          </label>
          <select
            id="etnia_id"
            name="etnia_id"
            required
            defaultValue={docente?.etnia_id ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="" disabled>Seleccionar...</option>
            {etnias.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cargo_id" className="block text-sm font-medium text-slate-300 mb-1">
            Cargo
          </label>
          <select
            id="cargo_id"
            name="cargo_id"
            required
            defaultValue={docente?.cargo_id ?? ""}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="" disabled>Seleccionar...</option>
            {cargos.map((c) => (
              <option key={c.id} value={c.id}>{c.descripcion}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-slate-300 mb-1">
          Direcci&oacute;n
        </label>
        <textarea
          id="direccion"
          name="direccion"
          rows={2}
          defaultValue={docente?.direccion ?? ""}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Guardando..." : docente ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
