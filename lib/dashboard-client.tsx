'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { CollectionLog } from '@/lib/types';
import { DashboardCard } from './dashboard-card';
import { Package, Recycle, TrendingDown, Bot, HandCoins, AlertTriangle, FileDown } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export function DashboardClient() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<CollectionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/collections'); // API is now protected
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalItems = logs.reduce((acc, log) => acc + log.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);
    const damagedOrCrushed = logs.reduce((acc, log) => acc + log.items.filter(i => i.condition !== 'good').reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);
    const reuseRate = totalItems > 0 ? (((totalItems - damagedOrCrushed) / totalItems) * 100).toFixed(1) : 0;
    const lossRate = totalItems > 0 ? ((damagedOrCrushed / totalItems) * 100).toFixed(1) : 0;
    // Proxy Metric: Assume 50g of CO2 saved per reused item.
    const carbonReduction = ((totalItems - damagedOrCrushed) * 0.05).toFixed(2);
    const totalIncentivesPaid = logs.reduce((acc, log) => acc + (log.incentivePaid || 0), 0);

    return { totalItems, reuseRate, lossRate, carbonReduction, totalIncentivesPaid };
  }, [logs]);

  const chartData = useMemo(() => {
    const data = { bottle: 0, crate: 0, pet: 0 };
    logs.forEach(log => {
      log.items.forEach(item => {
        data[item.type] += item.quantity;
      });
    });
    return Object.entries(data).map(([name, value]) => ({ name, total: value }));
  }, [logs]);

  const complianceAlerts = useMemo(() => {
    if (session?.user?.role !== 'nb_admin') return [];

    const alerts: { type: string; message: string }[] = [];
    const partnerStats: { [key: string]: { total: number; damaged: number } } = {};

    logs.forEach(log => {
      if (!partnerStats[log.partnerId]) {
        partnerStats[log.partnerId] = { total: 0, damaged: 0 };
      }
      log.items.forEach(item => {
        partnerStats[log.partnerId].total += item.quantity;
        if (item.condition === 'damaged' || item.condition === 'crushed') {
          partnerStats[log.partnerId].damaged += item.quantity;
        }
      });
    });

    for (const partnerId in partnerStats) {
      const stats = partnerStats[partnerId];
      const damageRate = stats.total > 0 ? stats.damaged / stats.total : 0;
      if (damageRate > 0.2) { // Alert if damage rate is over 20%
        alerts.push({ type: 'High Damage Rate', message: `Partner ${partnerId} has a damage rate of ${(damageRate * 100).toFixed(0)}%.` });
      }
    }
    return alerts;
  }, [logs, session]);

  if (status === 'loading' || loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleExport = () => {
    const flattenedData = logs.flatMap(log => 
      log.items.map(item => ({
        log_id: log.id,
        timestamp: new Date(log.timestamp).toISOString(),
        partner_id: log.partnerId,
        item_type: item.type,
        quantity: item.quantity,
        condition: item.condition,
        incentive_paid: log.incentivePaid || 0,
        notes: log.notes || '',
      }))
    );

    if (flattenedData.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = Object.keys(flattenedData[0]);
    const csvContent = [
      headers.join(','),
      ...flattenedData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `collection_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">Welcome, {session?.user?.name}!</h2>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="bg-slate-100 text-slate-900 h-9 px-3 rounded-md text-sm font-medium">
          Sign Out
        </button>
      </div>

      {/* Admin Controls */}
      {session?.user?.role === 'nb_admin' && (
        <div className="flex justify-end">
          <button onClick={handleExport} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2">
            <FileDown className="mr-2 h-4 w-4" /> Export to CSV
          </button>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p>No collection data yet. Go log some collections!</p>
        </div>
      )}

      {/* Compliance Notifications (Admin Only) */}
      {session?.user?.role === 'nb_admin' && complianceAlerts.length > 0 && (
        <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
            <h3 className="text-lg font-semibold text-amber-800">Compliance Alerts</h3>
          </div>
          <ul className="mt-2 ml-9 list-disc space-y-1 text-amber-700">
            {complianceAlerts.map((alert, i) => <li key={i}>{alert.message}</li>)}
          </ul>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <DashboardCard title="Total Items Collected" value={stats.totalItems} icon={Package} />
        <DashboardCard title="Reuse Rate" value={`${stats.reuseRate}%`} icon={Recycle} />
        <DashboardCard title="Loss Rate" value={`${stats.lossRate}%`} icon={TrendingDown} />
        <DashboardCard title="Carbon Reduction (kg CO₂e)" value={stats.carbonReduction} icon={Bot} />
        <DashboardCard title="Incentives Paid (₦)" value={stats.totalIncentivesPaid.toLocaleString()} icon={HandCoins} />
      </div>

      {/* Chart */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Collections by Type</h3>
        </div>
        <div className="p-6 pt-0">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip />
              <Bar dataKey="total" fill="#1e293b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}