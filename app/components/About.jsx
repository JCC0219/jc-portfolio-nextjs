"use client";
import { assets, infoList, toolsData } from "@/assets/assets";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import AboutTabButton from "./AboutTabButton";
import { motion } from "motion/react";

const TAB_DATA = [
  {
    title: "Cloud Platforms",
    id: "cloud",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li><strong>AWS</strong> - Solutions Architect & Developer Certified</li>
        <li><strong>Oracle Cloud</strong> - OCI & OIC Integration Specialist</li>
        <li><strong>Google Cloud Platform</strong> - Digital Leader Certified</li>
        <li><strong>Alibaba Cloud</strong> - Professional Cloud Computing</li>
        <li><strong>Supabase</strong> - Full-stack Backend Solutions</li>
        <li><strong>Cloudflare</strong> - Security & Performance Optimization</li>
      </ul>
    ),
  },
  {
    title: "Programming Languages",
    id: "languages",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li><strong>JavaScript, TypeScript</strong> - Modern web development</li>
        <li><strong>Python</strong> - ETL pipelines, automation, AI/ML</li>
        <li><strong>Java</strong> - SpringMVC, enterprise applications</li>
        <li><strong>Dart</strong> - Flutter Web development</li>
        <li><strong>C++</strong> - System programming, performance optimization</li>
        <li><strong>SQL, PL/SQL</strong> - Database development, Oracle expertise</li>
        <li><strong>Bash</strong> - Linux scripting, automation</li>
      </ul>
    ),
  },
  {
    title: "Frameworks & Tools",
    id: "frameworks",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li><strong>Frontend:</strong> ReactJS, NextJS, Flutter Web, Tailwind CSS</li>
        <li><strong>Backend:</strong> NodeJS, ExpressJS, SpringMVC, FastAPI</li>
        <li><strong>Databases:</strong> Oracle, MongoDB, MySQL, PostgreSQL</li>
        <li><strong>DevOps:</strong> Docker, Git & GitHub, Ubuntu Server</li>
        <li><strong>Automation:</strong> n8n, BullMQ, ETL pipelines</li>
        <li><strong>APIs:</strong> REST, SOAP, JWT, OAuth, WhatsApp API</li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li><strong>AWS Solutions Architect – Associate</strong> (2024-2027)</li>
        <li><strong>AWS Developer – Associate</strong> (2025-2028)</li>
        <li><strong>Oracle Cloud Infrastructure 2024</strong> - Application Integration Professional</li>
        <li><strong>Google Cloud Digital Leader</strong> (2023-2026)</li>
        <li><strong>Alibaba Cloud Professional</strong> - Cloud Computing</li>
        <li><strong>Microsoft Power Platform</strong> - Fundamental</li>
        <li><strong>Katalon Expert Level</strong> - Test Automation</li>
      </ul>
    ),
  },
];

const About = ({ isDarkMode }) => {
  const [tab, setTab] = useState("cloud");
  const [isPending, startTransition] = useTransition();
  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="about"
      className="w-full px-[12%] py-10 scroll-mt-20"
    >
      <motion.h4
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center mb-2 text-lg font-Ovo"
      >
        Introduction
      </motion.h4>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl font-Ovo"
      >
        About Me
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex w-full flex-col lg:flex-row items-center gap-20 my-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-64 sm:w-80 rounded-3xl max-w-none"
        >
          <Image
            src={assets.user_image}
            alt="user"
            className="w-full rounded-3xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          exit={{ opacity: 0 }}
          className="flex-1"
        >
          <p className="mb-10 max-w-2xl font-Ovo">
          I am a Senior Technology Analyst at Deloitte, specializing in Oracle Cloud Integration and enterprise consulting. With a Bachelor of Computer Science (Hons) and 2+ years of professional experience, I deliver impactful cloud solutions across AWS, OCI, GCP, and Alibaba Cloud. My expertise spans Oracle Integration Cloud (OIC) for enterprise projects, ETL pipelines, API-driven integrations, and full-stack development. I hold multiple cloud certifications including AWS Solutions Architect, Oracle Cloud Infrastructure Professional, and Google Cloud Digital Leader. Based in Kuala Lumpur, Malaysia, I'm passionate about cloud-native solutions, automation, and driving innovation in technology consulting.
          </p>
          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl"
          >
            {infoList.map(({ icon, iconDark, title, description }, index) => (
              <motion.li
                whileHover={{ scale: 1.05 }}
                className="border-[0.5px] border-gray-400 rounded-xl p-6 cursor-pointer hover:bg-lightHover hover:-translate-y-1 duration-500 hover:shadow-black dark:border-white dark:shadow-white dark:hover:bg-darkHover/50"
                key={index}
              >
                <Image
                  src={isDarkMode ? iconDark : icon}
                  alt={title}
                  className="w-7 mt-3"
                />
                <h3 className="my-4 font-semibold text-gray-700 dark:text-white">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm dark:text-white/80">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
          {/* <h4 className="mt-8 font-semibold font-Ovo dark:text-white/80">
            Tools I use:
          </h4> */}
          {/* <motion.h4
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3, delay: 0.5 }}
            className="my-6 text-gray-700 font-Ovo dark:text-white/80"
          >
            Tools I use
          </motion.h4>
          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="flex items-center gap-5 sm:gap-5"
          >
            {toolsData.map((tool, index) => (
              <motion.li
              whileHover={{scale: 1.1}}
                className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:-translate-y-1 duration-500"
                key={index}
              >
                <Image src={tool} alt="Tool" className="w-5 sm:w-7" />
              </motion.li>
            ))}
          </motion.ul> */}
          <div className="flex flex-row justify-start flex-wrap mt-8 gap-4">
            {TAB_DATA.map((tabItem) => (
              <motion.div
                key={tabItem.id}
                whileHover={{scale: 1.1}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0 }} // Adjust transition time
              >
                <AboutTabButton
                 
                  selectTab={() => handleTabChange(tabItem.id)}
                  active={tab === tabItem.id}
                  isDarkMode={isDarkMode}
                >
                  {tabItem.title}
                </AboutTabButton>
              </motion.div>
            ))}
          </div>

          <motion.div
            key={tab} // Ensures animation when tab changes
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }} // Transition for content fade in/out
          >
            {TAB_DATA.find((t) => t.id === tab)?.content}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
