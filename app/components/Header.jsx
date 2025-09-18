"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import { TypeAnimation } from "react-type-animation";

const Header = () => {
  return (
    <div className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <Image src={assets.profile_img} alt="" className="rounded-full w-32" />
      </motion.div>
      <motion.h3
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo"
      >
        Hi! I'm JC
        <Image src={assets.hand_icon} alt="" className="w-6" />
      </motion.h3>
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        // className="text-3xl sm:text-5xl lg:text-[58px] font-Ovo"
      >
        <TypeAnimation
          sequence={[
            "Senior Technology Analyst",
            1000,
            "Oracle Cloud Integration Specialist",
            1000,
            "Certified Cloud Solution Architect",
            1000,
            "Full Stack Developer",
            1000,
            "Cloud & Integration Expert",
            1000,
            "Making the World a Better Place!",
            2000,
            "",
            1000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
          speed={50}
          className="text-3xl sm:text-5xl lg:text-[58px] font-Ovo bg-clip-text text-transparent 
             bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        />
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="max-w-2xl mx-auto font-Ovo"
      >
        Jing Cheng (JC) is a Senior Technology Analyst at Deloitte with expertise in Oracle Cloud Integration, 
        enterprise consulting, and full-stack development. Certified across AWS, Oracle Cloud, Google Cloud, 
        and Alibaba Cloud platforms, he specializes in cloud-native solutions, automation, and delivering 
        innovative enterprise integrations.
      </motion.p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <motion.a
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          href="#contact"
          className="px-10 py-3 border rounded-full bg-gradient-to-r from-[#b820e6] to-[#da7d20] text-white flex items-center gap-2 dark:border-none 
     "
        >
          contact me
          <Image src={assets.right_arrow_white} alt="" className="w-4" />
        </motion.a>
        <motion.a
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          href="/Chiew Jing Cheng CV v4.0.pdf"
          download
          className="px-10 py-3 border rounded-full border-gray-500 flex items-center gap-2 dark:text-black bg-white "
        >
          my resume
          <Image src={assets.download_icon} alt="" className="w-4" />
        </motion.a>
      </div>
    </div>
  );
};

export default Header;
