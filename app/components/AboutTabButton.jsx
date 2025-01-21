import React from "react";
import { motion } from "motion/react";

const variants = {
  default: { width: 0 },
  active: { width: "calc(100% - 0.75rem" },
};

const AboutTabButton = ({ active, selectTab, children, isDarkMode }) => {
  const buttonClasses = active
    ? "text-black dark:text-white  scale-110"
    : "text-[#ADB7BE] 0";

  return (
    <button onClick={selectTab}>
      <p
        className={`mr-3 font-semibold hover:text-black dark:hover:text-white  ${buttonClasses}`}
      >
        {children}
      </p>
      <motion.div
        animate={active ? "active" : "default"}
        variants={variants}
        className="h-1 bg-purple-500 mt-2 mr-3"
      ></motion.div>
    </button>
  );
};

export default AboutTabButton;
