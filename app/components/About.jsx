"use client";
import { assets, infoList, toolsData } from "@/assets/assets";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import AboutTabButton from "./AboutTabButton";
import { motion } from "motion/react";

const TAB_DATA = [
  {
    title: "Front End Dev",
    id: "frontend",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li>ReactJS</li>
        <li>NextJS</li>
        <li>Tailwind CSS</li>
      </ul>
    ),
  },
  {
    title: "Back End Dev",
    id: "back",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li>NodeJS (ExpressJS)</li>
        <li>SQL, PL/SQL</li>
        <li>Oracle Database</li>
        <li>MongoDB</li>
        <li>My SQL</li>
      </ul>
    ),
  },
  {
    title: "Cloud Tech",
    id: "cloud",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li>AWS Cloud</li>
        <li>Oracle Cloud Infrastructure (OCI)</li>
        <li>Oracle Integration Cloud (OIC)</li>
        <li>Google Cloud</li>
        <li>Alibaba Cloud</li>
      </ul>
    ),
  },
  {
    title: "Others",
    id: "others",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li>Git & GitHub</li>
        <li>Oracle Report BI Publisher</li>
        <li>Cloudflare</li>
        <li>Ubuntu OS</li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li>AWS Solution Architect - Associate</li>
        <li>AWS Cloud Practitioner</li>
        <li>Oracle Cloud Infrastructure 2024 Certified Application Integration Professional</li>
        <li>Google Cloud Digital Leader</li>
        <li>Alibaba Cloud Professional – Cloud Computing Certification</li>
      </ul>
    ),
  },
  {
    title: "Completed Courses",
    id: "courses",
    content: (
      <ul className="list-disc pl-4 space-y-2 text-gray-700 dark:text-white/80">
        <li>The Complete React Developer Course (w/Hooks and Redux) - 2020 </li>
        <li>NodeJS - The Complete Guide (MVC, REST APIs, GraphQL) </li>
        <li>The Git & Github Bootcamp </li>
        <li>Ultimate AWS Certified Solutions Architect Associate 2024 </li>
        <li>Linux Administration: Build 5 Hands-On Linux Projects 2023</li>
      </ul>
    ),
  },
];

const About = ({ isDarkMode }) => {
  const [tab, setTab] = useState("frontend");
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
            I am a full-time Technology Analyst, currently working on Oracle
            Cloud projects (OCI, OIC, ERP), delivering impactful solutions and
            driving innovation in technology consulting. Based in Kuala Lumpur,
            Malaysia, I have 2 years of experience working with leading
            companies such as Deloitte Consulting SEA and Finexus Sdn Bhd. My
            expertise includes full-stack development, with a focus on React,
            Node.js, Spring, and databases (MongoDB, MySQL, Oracle).
            Additionally, I am certified in AWS, Alibaba Cloud, and Google
            Cloud. I am passionate about cloud technology and solution
            architecture, and I am constantly seeking ways to leverage these
            technologies to deliver value and innovation.
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
