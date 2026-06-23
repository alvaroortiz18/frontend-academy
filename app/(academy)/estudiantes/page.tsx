import { getAllStudents, getSexos, getEtnias } from "@/actions";
import StudentList from "@/components/StudentList";

export default async function EstudiantesPage() {
  const [estudiantes, sexos, etnias] = await Promise.all([
    getAllStudents(),
    getSexos(),
    getEtnias(),
  ]);

  const gatewayUrl = process.env.GATEWAY_URL ?? "http://localhost:3005";

  return <StudentList estudiantes={estudiantes} sexos={sexos} etnias={etnias} gatewayUrl={gatewayUrl} />;
}
