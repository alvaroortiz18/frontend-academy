import { getEstudiantes, getSexos, getEtnias } from "@/actions";
import { EstudianteDashboard } from "@/types";
import KpiCard from "@/components/dashboard/KpiCard";
import GraficoBarras from "@/components/dashboard/GraficoBarras";
import GraficoPastel from "@/components/dashboard/GraficoPastel";
import TablaEstudiantes from "@/components/dashboard/TablaEstudiantes";
import {
  faUsers,
  faMars,
  faVenus,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

function mapSexo(sexoId: number, sexos: { id: number; nombre: string }[]): "M" | "F" {
  const s = sexos.find((x) => x.id === sexoId);
  if (!s) return "M";
  const name = s.nombre.toLowerCase();
  if (name.includes("femenino") || name.includes("femenina") || name === "f") return "F";
  return "M";
}

function mapEtnia(etniaId: number, etnias: { id: number; nombre: string }[]): string {
  const e = etnias.find((x) => x.id === etniaId);
  return e?.nombre ?? "Desconocido";
}

export default async function DashboardPage() {
  const [estudiantes, sexos, etnias] = await Promise.all([
    getEstudiantes(),
    getSexos(),
    getEtnias(),
  ]);

  const display: EstudianteDashboard[] = estudiantes.map((est) => ({
    id: est.id,
    nombre: est.nombres,
    apellido: [est.paterno, est.materno].filter(Boolean).join(" "),
    sexo: mapSexo(est.sexo_id, sexos),
    etnia: mapEtnia(est.etnia_id, etnias),
  }));

  const total = display.length;
  const hombres = display.filter((e) => e.sexo === "M").length;
  const mujeres = display.filter((e) => e.sexo === "F").length;

  const sexoDist = [
    { name: "Hombres", value: hombres },
    { name: "Mujeres", value: mujeres },
  ].filter((d) => d.value > 0);

  const etniaGroups: Record<string, number> = {};
  for (const e of display) {
    etniaGroups[e.etnia] = (etniaGroups[e.etnia] || 0) + 1;
  }
  const etniaData = Object.entries(etniaGroups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard
          title="Total Estudiantes"
          value={total}
          icon={faUsers}
          bgColor="bg-blue-900/40"
          borderColor="border-blue-700"
        />
        <KpiCard
          title="Hombres"
          value={hombres}
          icon={faMars}
          bgColor="bg-sky-900/40"
          borderColor="border-sky-700"
        />
        <KpiCard
          title="Mujeres"
          value={mujeres}
          icon={faVenus}
          bgColor="bg-pink-900/40"
          borderColor="border-pink-700"
        />
        <KpiCard
          title="Con Avatar"
          value={0}
          icon={faUserCheck}
          bgColor="bg-amber-900/40"
          borderColor="border-amber-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-100 mb-4">
            Estudiantes por Etnia
          </h2>
          <GraficoBarras data={etniaData} />
        </div>
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-100 mb-4">
            Distribuci&oacute;n por Sexo
          </h2>
          <GraficoPastel data={sexoDist} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          &Uacute;ltimos Estudiantes
        </h2>
        <TablaEstudiantes estudiantes={display} />
      </div>
    </div>
  );
}
