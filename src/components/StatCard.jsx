import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, color }) => {
    return (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <h3 className="text-slate-500 dark:text-[#a0aec0] text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">{value}</h2>
                {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
            </div>
        </div>
    );
};

export default StatCard;
