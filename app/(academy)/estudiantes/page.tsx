import { getAllStudents } from "@/actions";

export default async function ObtenerEstudiantes() {
  const estudiantes = await getAllStudents();

  return (
    <div>
      <div>
        <h1 className='font-bold p-3'>Estudiantes</h1>
        <table>
          <thead>
            <tr>
              <th className='p-3'>Nombres</th>
              <th className='p-3'>Paterno</th>
              <th className='p-3'>Materno</th>
              <th className='p-3'>Direccion</th>
            </tr>
          </thead>

          <tbody>
            {estudiantes.map((est) => (
              <tr key={est.id} className='border-t'>
                <td className='p-3'>{est.nombres}</td>
                <td className='p-3'>{est.paterno}</td>
                <td className='p-3'>{est.materno}</td>
                <td className='p-3'>{est.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
