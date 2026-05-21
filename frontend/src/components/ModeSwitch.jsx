import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function ModeSwitch() {
    // pull the theme control straight from the global pipeline.
    const { isDarkMode, toggle } = useContext(ThemeContext);

    return (
        <button 
            onClick={toggleTheme}
            className={`
                relative w-16 h-9 rounded-full p-1 transition-all duration-500 outline-none
                bg-slate-200/40 dark:bg-slate-900/40 backdrop-blur-xl
                border border-white/40 dark:border-white/10
                shadow-[inset_0_2px_4px-rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]
                flex items-center justify-between gap-1 cursor-pointer group
            `}
            aria-label="Toggle application theme"
        >
            {/* implementing the Figma frosted glass design right here.
                By combining backdrop-blur-xl, semi-transparent borders, and deep inset shadows,
                create the layered refraction look.
            */}
            <Sun size={14} className="ml-1 text-amber-500 opacity-80 dark:opacity-40 transition-opacity" />
            <Moon size={14} className="mr-1 text-slate-400 opacity-40 dark:opacity-90 transition-opacity" />

            {/* This is the physical sliding thumb. I handle the smooth layout transitions via absolute positioning extensions */}
            <div
                className={`
                    absolute top-[3px] left-[3px] w-[28px] h-[28px] rounded-full
                    transition-all duration-500 ease-out flext items-center justify-center
                    bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
                    border border-white dark:border-slate-700/50
                    shadow-[0_3px_8px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                    ${isDarkMode ? 'transform translate-x-[28px]' : 'transform translate-x-0'}
                `}
            >
                {isDarkMode ? (
                    <Moon size={13} className="text-emerald-400 fill-emerald-400/20" />
                ) : (
                    <Sun size={13} className="text-amber-500 fill-amber-500/20" />
                )}
            </div>
        </button>
    );
}

export default ModeSwitch;