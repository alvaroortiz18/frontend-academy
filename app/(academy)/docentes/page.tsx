import { getAllDocentes, getSexos, getEtnias, getCargos } from "@/actions";
import DocenteList from "@/components/DocenteList";

export default async function DocentesPage() {
  const [docentes, sexos, etnias, cargos] = await Promise.all([
    getAllDocentes(),
    getSexos(),
    getEtnias(),
    getCargos(),
  ]);

  const gatewayUrl = process.env.GATEWAY_URL ?? "http://localhost:3005";

  return <DocenteList docentes={docentes} sexos={sexos} etnias={etnias} cargos={cargos} gatewayUrl={gatewayUrl} />;
}
