"use client";

import { useState, useEffect } from "react";
import { Docente, Sexo, Etnia, Cargo } from "@/types";
import { createDocente, updateDocente, deleteDocente } from "@/actions";
import { getFilesByModelId } from "@/actions/files";
import Modal from "./Modal";
import AvatarUpload from "./AvatarUpload";
import DocenteForm from "./DocenteForm";

interface DocenteListProps {
  docentes: Docente[];
  sexos: Sexo[];
  etnias: Etnia[];
  cargos: Cargo[];
  gatewayUrl: string;
}

export default function DocenteList({ docentes: initial, sexos, etnias, cargos, gatewayUrl }: DocenteListProps) {
  const [docentes, setDocentes] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocente, setEditingDocente] = useState<Docente | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [uploadDocente, setUploadDocente] = useState<Docente | null>(null);
  const [avatarFiles, setAvatarFiles] = useState<Record<number, number>>({});
  const [avatarRev, setAvatarRev] = useState(0);

  useEffect(() => {
    const ids = docentes.map((d) => d.id);
    Promise.all(
      ids.map((id) =>
        getFilesByModelId("docente", id).then((files) =>
          files.length > 0 ? { id, fileId: files[0].id } : null
        )
      )
    ).then((results) => {
      const map: Record<number, number> = {};
      for (const r of results) {
        if (r) map[r.id] = r.fileId;
      }
      setAvatarFiles(map);
    });
  }, [docentes, avatarRev]);

  function closeAvatarModal() {
    setUploadDocente(null);
    setAvatarRev((v) => v + 1);
  }

  function openCreate() {
    setEditingDocente(null);
    setModalOpen(true);
  }

  function openEdit(docente: Docente) {
    setEditingDocente(docente);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingDocente(null);
  }

  async function handleSubmit(formData: FormData) {
    const input = {
      nombres: formData.get("nombres") as string,
      apellidos: formData.get("apellidos") as string,
      email: (formData.get("email") as string) || null,
      direccion: (formData.get("direccion") as string) || null,
      cedula: (formData.get("cedula") as string) || null,
      telefono: (formData.get("telefono") as string) || null,
      etnia_id: Number(formData.get("etnia_id")),
      cargo_id: Number(formData.get("cargo_id")),
      sexo_id: Number(formData.get("sexo_id")),
    };

    if (editingDocente) {
      const updated = await updateDocente(editingDocente.id, input);
      setDocentes((prev) =>
        prev.map((d) => (d.id === editingDocente.id ? updated : d))
      );
    } else {
      const created = await createDocente(input);
      setDocentes((prev) => [...prev, created]);
    }

    closeModal();
  }

  async function handleDelete(id: number) {
    await deleteDocente(id);
    setDocentes((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Docentes</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Docente
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombres</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Apellidos</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tel&eacute;fono</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Avatar</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {docentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No hay docentes registrados
                  </td>
                </tr>
              ) : (
                docentes.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-100">{doc.nombres}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{doc.apellidos}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{doc.email ?? "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{doc.telefono ?? "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      {avatarFiles[doc.id] ? (
                        <img
                          src={`${gatewayUrl}/files/${avatarFiles[doc.id]}`}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover border border-slate-600"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setUploadDocente(doc)}
                          className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-900/30 transition-colors"
                          title="Subir avatar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEdit(doc)}
                          className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-900/30 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(doc.id)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-900/30 transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={closeModal} title={editingDocente ? "Editar Docente" : "Nuevo Docente"}>
        <DocenteForm
          sexos={sexos}
          etnias={etnias}
          cargos={cargos}
          docente={editingDocente}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <Modal open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminaci&oacute;n">
        <p className="text-slate-300 mb-6">
          &iquest;Est&aacute;s seguro de que deseas eliminar este docente? Esta acci&oacute;n no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </Modal>

      <Modal
        open={uploadDocente !== null}
        onClose={closeAvatarModal}
        title={uploadDocente ? "Avatar de " + uploadDocente.nombres + " " + uploadDocente.apellidos : ""}
      >
        {uploadDocente && (
          <AvatarUpload model="docente" studentId={uploadDocente.id} key={uploadDocente.id} gatewayUrl={gatewayUrl} />
        )}
      </Modal>
    </div>
  );
}
