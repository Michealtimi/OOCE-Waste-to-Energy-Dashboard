import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function DashboardCard({ title, value, icon: Icon }: DashboardCardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2"><h3 className="tracking-tight text-sm font-medium">{title}</h3><Icon className="h-4 w-4 text-muted-foreground" /></div><div className="p-6 pt-0"><div className="text-2xl font-bold">{value}</div></div>
    </div>
  );
}