import { Outfit, Ovo } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400","500","600","700"]
});

const ovo = Ovo({
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata = {
  title: "Jing Cheng Chiew | Portfolio",
  description: "Chiew Jing Cheng (JC) – Experienced Technology Analyst with 2+ years of total working experience, specializing in delivering impactful Oracle Cloud (OCI, OIC, ERP) solutions and full-stack development expertise in React, Node.js, Spring, and databases (MongoDB, MySQL, Oracle). Certified in AWS, Alibaba Cloud, and Google Cloud, I focus on cloud technology and solution architecture. Passionate about driving innovation in technology consulting, I am based in Kuala Lumpur, Malaysia, and have worked with leading companies like Deloitte Consulting SEA and Finexus Sdn Bhd.",
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${outfit.className} ${ovo.className} antialiased leading-8 overflow-x-hidden dark:bg-darkTheme dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
