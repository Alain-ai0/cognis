import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutGrid, Zap, Home, Clock, BookOpen, Video, Barchart3, Wallet, DatabaseZap, SwatchBook, TrendingDown, Settings, BrainCircuit
} from 'lucide-react';

// structure the navigation items into declarative arrays grouped by logical domains.
// This design makes it incredibly easy for me to add, scale, or modify routes as Cognis grows.
const navSections = [
    {
        title: "Pages",
        items: [
            { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
            { name: "Activity", path: "/activity", icon: Zap },
            { name: "Home", path: "/home", icon: Home },
            { name: "Schedule", path: "/schedule", icon: Clock },
            { name: "Courses", path: "/courses", icon: BookOpen},
            { name: "Videos", path: "/videos", icon: Video },
            { name: "Analytics", path: "/analytics", icon: Barchart3},
            { name: "Wallet", path: "/wallet", icon: Wallet}
        ]
    },
    {
        title: "Tools",
        items: [
            { name: "Markets", path: "/markets", icon: DatabaseZap},
            { name: "Portfolio", path: "/portfolio", icon: Barchart3},
            { name: "Liquidity Pools", path: "/liquidity", icon: SwatchBook },
            { name: "swap", path: "/swap", icon: TrendingDown },
            { name: "Settings", path: "/settings", icon: Settings},
            { name: "AI Insights", path: "/insights", icon: BrainCircuit }
        ]
    }
];

function Sidebar() {
    return (
        /* I intentionally hardcode my sidebar to a sleek dark slate backround mix (#0d1117).
           Even in light mode, retaining a dark sidebar preserves the contrast ratio and professional asset style  
        */
       <aside className="w-64 bg-[#0d1117] border-r border-slate-800/60 p-6 flex flex-col h-screen sticky top-0 shrink-0 select-none" >
        <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BrainCircuit className="text-slate-950 w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Cognis</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-7 custom-scrollbar">
            {navSections.map((section, sIdx) => (
                <div key={sIdx}>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                        {section.title}
                    </h3>
                    <nav className="space-y-1">
                        {section.items.map((item, iIdx) => (
                            <NavLink
                                key={iIdx}
                                to={item.path}
                                /* I pass a dynamic function callback straight to Tailwind's className processing logic.
                                   This lets me instantly handle sub-page transition highlights based on React Router status flags.
                                */
                               className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-gradient-to-r from-emerald-500/15 to-transparent text-emerald-400 border-l-[3px] border-emerald-400 pl-[9px]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}
                               `}
                            >
                                <item.icon size={18} className="shrink-0" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            ))}
        </div>
       </aside>
    );
}

export default Sidebar;