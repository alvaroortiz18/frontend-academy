"use client";

import { useState, useEffect } from "react";
import { Estudiante, Sexo, Etnia } from "@/types";
import { createStudent, updateStudent, deleteStudent } from "@/actions";
import { getFilesByModelId } from "@/actions/files";
import Modal from "./Modal";
import StudentForm from "./StudentForm";
import AvatarUpload from "./AvatarUpload";

interface StudentListProps {
  estudiantes: Estudiante[];
  sexos: Sexo[];
  etnias: Etnia[];
  gatewayUrl: string;
}

export default function StudentList({ estudiantes: initial, sexos, etnias, gatewayUrl }: StudentListProps) {
  const [estudiantes, setEstudiantes] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [uploadStudent, setUploadStudent] = useState<Estudiante | null>(null);
  const [avatarFiles, setAvatarFiles] = useState<Record<number, number>>({});
  const [avatarRev, setAvatarRev] = useState(0);

  useEffect(() => {
    const ids = estudiantes.map((e) => e.id);
    Promise.all(
      ids.map((id) =>
        getFilesByModelId("estudiante", id).then((files) =>
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
  }, [estudiantes, avatarRev]);

  function closeAvatarModal() {
    setUploadStudent(null);
    setAvatarRev((v) => v + 1);
  }

  function openCreate() {
    setEditingStudent(null);
    setModalOpen(true);
  }

  function openEdit(student: Estudiante) {
    setEditingStudent(student);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingStudent(null);
  }

  async function handleSubmit(formData: FormData) {
    const input = {
      nombres: formData.get("nombres") as string,
      paterno: formData.get("paterno") as string,
      materno: (formData.get("materno") as string) || null,
      sexo_id: Number(formData.get("sexo_id")),
      direccion: formData.get("direccion") as string,
      etnia_id: Number(formData.get("etnia_id")),
    };

    if (editingStudent) {
      const updated = await updateStudent(editingStudent.id, input);
      setEstudiantes((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? updated : s))
      );
    } else {
      const created = await createStudent(input);
      setEstudiantes((prev) => [...prev, created]);
    }

    closeModal();
  }

  async function handleDelete(id: number) {
    await deleteStudent(id);
    setEstudiantes((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Estudiantes</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Estudiante
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombres</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Paterno</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Materno</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Avatar</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Direcci&oacute;n</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {estudiantes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No hay estudiantes registrados
                  </td>
                </tr>
              ) : (
                estudiantes.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-100">{est.nombres}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{est.paterno}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{est.materno ?? "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      {avatarFiles[est.id] ? (
                        <img
                          src={`${gatewayUrl}/files/${avatarFiles[est.id]}`}
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
                    <td className="px-4 py-3 text-sm text-slate-300 max-w-xs truncate">{est.direccion}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setUploadStudent(est)}
                          className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-900/30 transition-colors"
                          title="Subir avatar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEdit(est)}
                          className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-900/30 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(est.id)}
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

      <Modal open={modalOpen} onClose={closeModal} title={editingStudent ? "Editar Estudiante" : "Nuevo Estudiante"}>
        <StudentForm
          sexos={sexos}
          etnias={etnias}
          student={editingStudent}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <Modal open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminaci&oacute;n">
        <p className="text-slate-300 mb-6">
          &iquest;Est&aacute;s seguro de que deseas eliminar este estudiante? Esta acci&oacute;n no se puede deshacer.
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
        open={uploadStudent !== null}
        onClose={closeAvatarModal}
        title={uploadStudent ? `Avatar de ${uploadStudent.nombres} ${uploadStudent.paterno}` : ""}
      >
        {uploadStudent && (
          <AvatarUpload model="estudiante" studentId={uploadStudent.id} gatewayUrl={gatewayUrl} />
        )}
      </Modal>
    </div>
  );
}
