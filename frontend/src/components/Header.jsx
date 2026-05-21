import React from 'react';
import { Search, Bell } from 'lucide-react';
import ModeSwitch from './ModeSwitch';

function Header() {
    return (
        /* use backdrop-blur and a sticky top-0 anchor configuration to maintain my scrolling clarity indices */
        <header className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-[#0b0f17]/70 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
            {/* This is the entry interface for my Neural Search Engine. keep the widths flexible via max-w-md constraints */}
            <div classname="relative w-full max-w-md group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Query the neural engine..."
                    className="w-full bg-slate-100 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm pl-11 pr-4 py-2.5 rounded-xl border-transparent focus:border-emerald-500/30 dark:focus:border-emerald-400/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                
                {/* drop the fully customizable glass switch componet straight into the primary global control block */}
                <div className="flex items-center gap-2">
                    <ModeSwitch />
                </div>

                {/* Action Indicators Block */}
                <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 transition-colors relative">
                    <Bell size{18} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-slate-950"></span>
                </button>

                {/* Private Portfolio Anchor Info Block */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/10">
                        NR
                    </div>
                    <div className="hidden md:block select-none">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none mb-0.5">Naya Rachel</h4>
                        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Private Portfolio</p>
                    </div>
                </div>

            </div>
        </header>
    );
}

export default Header;