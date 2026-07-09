import React from "react";

export default function StatCard({ icon: Icon, label, value, color = "bg-primary/10 text-primary", trend }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </div>
    </div>
  );
}