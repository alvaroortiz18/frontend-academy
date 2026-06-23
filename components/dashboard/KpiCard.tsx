import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface KpiCardProps {
  title: string;
  value: number;
  icon: IconDefinition;
  bgColor: string;
  borderColor: string;
}

export default function KpiCard({ title, value, icon, bgColor, borderColor }: KpiCardProps) {
  return (
    <div className={`rounded-xl shadow-sm border ${borderColor} ${bgColor} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">{title}</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-blue-400 shadow-sm">
          <FontAwesomeIcon icon={icon} className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
