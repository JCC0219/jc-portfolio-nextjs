"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";

const Contact = () => {
  const [result, setResult] = useState("");
  const emailStatus = useRef("hide");
  const accessKey = process.env.NEXT_PUBLIC_EMAIL_ACCESS_KEY;
  const statusClasses = {
    success: "text-green-600 bg-green-100",
    error: "text-red-600 bg-red-100",
    sending: "text-yellow-600 bg-yellow-100",
    hide: "",
  };

  const statusClass = statusClasses[emailStatus.current] ?? statusClasses.hide;

  const setStatus = (status, message) => {
    emailStatus.current = status;
    setResult(message);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending", "Sending....");

    if (!accessKey) {
      setStatus("error", "Email access key is missing. Set NEXT_PUBLIC_EMAIL_ACCESS_KEY.");
      return;
    }

    try {
      const formData = new FormData(event.target);
      formData.append("access_key", accessKey);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setStatus("error", "Submission failed. Unexpected response from email service.");
        return;
      }

      if (data.success) {
        setStatus("success", "Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error", data);
        setStatus("error", data.message || "Unable to submit form right now.");
      }
    } catch (error) {
      console.error("Contact form submit failed:", error);
      setStatus("error", "Unable to submit form right now.");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="contact"
      className="w-full px-[12%] py-10 scroll-mt-20 bg-[url('/footer-bg-color.png')] bg-no-repeat bg-center bg-[length:90%_auto] dark:bg-none"
    >
      <motion.h4
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center mb-2 text-lg font-Ovo"
      >
        Connect with me
      </motion.h4>
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl font-Ovo"
      >
        Get in touch
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo"
      >
        I'd love to hear from you! If you have any questions, comments, or
        feedback, please use the form below.
      </motion.p>
      <motion.form
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="max-w-2xl mx-auto"
        onSubmit={onSubmit}
      >
        <div className="grid grid-cols-auto gap-6 mt-10 mb-8">
          <motion.input
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            type="text"
            name="name"
            placeholder="Enter your name"
            required
            className="flex-1 p-3 outline-none rounded-lg border border-white/60 bg-white/95 backdrop-blur-lg shadow-[0_6px_16px_rgba(40,56,120,0.1)] transition-all duration-300 placeholder-slate-500 focus:border-white/80 focus:shadow-[0_8px_24px_rgba(40,56,120,0.2)] dark:border-white/15 dark:bg-slate-950/55 dark:placeholder-slate-400 dark:focus:border-white/25"
          />
          <motion.input
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="flex-1 p-3 outline-none rounded-lg border border-white/60 bg-white/95 backdrop-blur-lg shadow-[0_6px_16px_rgba(40,56,120,0.1)] transition-all duration-300 placeholder-slate-500 focus:border-white/80 focus:shadow-[0_8px_24px_rgba(40,56,120,0.2)] dark:border-white/15 dark:bg-slate-950/55 dark:placeholder-slate-400 dark:focus:border-white/25"
          />
        </div>
        <motion.textarea
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          rows="6"
          name="message"
          placeholder="Enter your message"
          className="w-full p-4 outline-none rounded-lg border border-white/60 bg-white/95 backdrop-blur-lg shadow-[0_6px_16px_rgba(40,56,120,0.1)] mb-6 transition-all duration-300 placeholder-slate-500 focus:border-white/80 focus:shadow-[0_8px_24px_rgba(40,56,120,0.2)] dark:border-white/15 dark:bg-slate-950/55 dark:placeholder-slate-400 dark:focus:border-white/25 resize-none"
        ></motion.textarea>
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          type="submit"
          className="py-3 px-8 w-max flex items-center justify-between gap-2 bg-indigo-600 text-white rounded-full mx-auto hover:bg-indigo-700 transition-all duration-300 shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_28px_rgba(79,70,229,0.4)] dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          Submit now{" "}
          <Image src={assets.right_arrow_white} alt="" className="w-4" />
        </motion.button>

        <p className={`mt-4 text-lg font-medium ${statusClass} p-4 rounded-md`}>
          {result}
        </p>
      </motion.form>
    </motion.div>
  );
};

export default Contact;
