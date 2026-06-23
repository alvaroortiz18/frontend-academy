"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { EstudianteDashboard } from "@/types";

interface Props {
  estudiantes: EstudianteDashboard[];
}

function AvatarInicial({ nombre, apellido }: { nombre: string; apellido: string }) {
  const inicial = (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-blue-900/50 text-blue-300 flex items-center justify-center text-sm font-semibold shrink-0">
      {inicial}
    </div>
  );
}

export default function TablaEstudiantes({ estudiantes }: Props) {
  const router = useRouter();

  const sorted = [...estudiantes].sort((a, b) => b.id - a.id);

  return (
    <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Avatar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre Completo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sexo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Etnia</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acci&oacute;n</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                  No hay estudiantes registrados
                </td>
              </tr>
            ) : (
              sorted.map((est) => (
                <tr key={est.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <AvatarInicial nombre={est.nombre} apellido={est.apellido} />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-100">
                    {est.nombre} {est.apellido}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{est.sexo}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{est.etnia}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => router.push("/estudiantes")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
