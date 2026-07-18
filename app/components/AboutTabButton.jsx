import React from "react";
import { motion } from "motion/react";

const variants = {
  default: { width: 0 },
  active: { width: "calc(100% - 0.75rem" },
};

const AboutTabButton = ({ active, selectTab, children, isDarkMode }) => {
  const buttonClasses = active
    ? "text-slate-950 dark:text-white scale-110 font-semibold"
    : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200";

  return (
    <button onClick={selectTab} className="relative px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-950/30">
      <p className={`mr-3 ${buttonClasses}`}>
        {children}
      </p>
      <motion.div
        animate={active ? "active" : "default"}
        variants={variants}
        className="h-1.5 bg-gradient-to-r from-indigo-600 to-purple-500 mt-2 mr-3 rounded-full"
      ></motion.div>
    </button>
  );
};

export default AboutTabButton;
