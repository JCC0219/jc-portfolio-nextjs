import { assets, workData } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

const Work = ({ isDarkMode }) => {
  const handleOpenChatFromProject = () => {
    window.dispatchEvent(new CustomEvent("jc-ai-chat-open"));
  };

  const getProjectActionLabel = (project) => {
    return project.action === "open-chat" ? "Open Chat" : "View Project";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="work"
      className="w-full px-[12%] py-10 scroll-mt-20"
    >
      {/* <motion.h4
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="text-center mb-2 text-lg font-Ovo"
      >
        Self Learning & Development
      </motion.h4> */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl font-Ovo"
      >
        My Portfolio
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo"
      >
        Welcome to my portfolio, showcasing a collection of completed projects
        from various IT fields. These projects reflect my commitment to
        learning, hands-on experience, and skill development across different
        domains.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="grid grid-cols-auto-work my-10 gap-6 dark:text-black"
      >
        {workData.map((project, index) => {
          const isChatAction = project.action === "open-chat";

          const card = (
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.28 }}
              key={index}
              className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl border border-white/45 bg-no-repeat bg-center bg-cover shadow-[0_14px_36px_rgba(46,62,130,0.16)] dark:border-white/10 dark:shadow-[0_16px_44px_rgba(7,12,34,0.45)]"
              style={{ backgroundImage: `url(${project.bgImage})` }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/58 via-slate-900/16 to-transparent" />
              <div className="absolute bottom-3 left-1/2 w-[calc(100%-1.25rem)] -translate-x-1/2 rounded-xl border border-white/50 bg-white/88 px-4 py-3 shadow-[0_12px_24px_rgba(40,56,120,0.22)] backdrop-blur-md transition-all duration-300 group-hover:bottom-4 dark:border-white/15 dark:bg-slate-950/55 dark:shadow-[0_12px_28px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="pr-1 text-xl font-semibold leading-tight text-slate-900 dark:text-white">
                    {project.title}
                  </h2>
                  <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-indigo-600 px-3 text-xs font-semibold text-white shadow-[0_6px_14px_rgba(67,86,204,0.35)] transition-colors group-hover:bg-indigo-700">
                    {getProjectActionLabel(project)}
                    <Image
                      src={assets.right_arrow_white}
                      alt="project action"
                      className="w-3"
                    />
                  </span>
                </div>
                <p
                  className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200/90"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {project.description}
                </p>
              </div>
            </motion.div>
          );

          if (isChatAction) {
            return (
              <button
                key={index}
                type="button"
                onClick={handleOpenChatFromProject}
                className="text-left"
                aria-label="Open JC Portfolio AI Assistant chat"
              >
                {card}
              </button>
            );
          }

          return (
            <Link key={index} href={project.link} target="_blank" passHref>
              {card}
            </Link>
          );
        })}
      </motion.div>
      <motion.a
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        whileHover={{scale:1.05}}
        transition={{ duration: 1.1, delay: 0.5}}
        target="_blank"
        href="https://github.com/JCC0219"
        className="w-max flex items-center justify-center gap-2 text-gray-700 border-[0.5px] border-gray-700 rounded-full py-3 px-10 mx-auto my-20 hover:bg-lightHover duration-500 dark:text-white dark:border-white dark:hover:bg-darkHover"
      >
        Show more on GitHub
        <Image
          src={
            isDarkMode ? assets.right_arrow_bold_dark : assets.right_arrow_bold
          }
          alt="Right arrow"
          className="w-4"
        />
      </motion.a>
    </motion.div>
  );
};

export default Work;
