import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGaugeHigh, faUserGraduate, faSchool, faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { href: "/", label: "Dashboard", icon: faGaugeHigh },
  { href: "/estudiantes", label: "Estudiantes", icon: faUserGraduate },
  { href: "/docentes", label: "Docentes", icon: faChalkboardUser },
];

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-slate-950 text-white flex flex-col shrink-0 fixed left-0 top-0 bottom-0">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FontAwesomeIcon icon={faSchool} className="w-5 h-5" />
            Academy
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          Academy v1.0
        </div>
      </aside>

      <main className="flex-1 bg-slate-900 p-8 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
