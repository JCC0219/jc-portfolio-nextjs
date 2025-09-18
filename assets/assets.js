import user_image from "./user-img.jpg";
import code_icon from "./code-icon.png";
import code_icon_dark from "./code-icon-dark.png";
import edu_icon from "./edu-icon.png";
import edu_icon_dark from "./edu-icon-dark.png";
import project_icon from "./project-icon.png";
import project_icon_dark from "./project-icon-dark.png";
import vscode from "./vscode.png";
import firebase from "./firebase.png";
import figma from "./figma.png";
import git from "./git.png";
import mongodb from "./mongodb.png";
import right_arrow_white from "./right-arrow-white.png";
import logo from "./logo-jingcheng.png";
import logo_dark from "./logo-jingcheng-dark.png";
import mail_icon from "./mail_icon.png";
import mail_icon_dark from "./mail_icon_dark.png";
import profile_img from "./profile-img-jc.jpg";
import download_icon from "./download-icon.png";
import hand_icon from "./hand-icon.png";
import header_bg_color from "./header-bg-color.png";
import moon_icon from "./moon_icon.png";
import sun_icon from "./sun_icon.png";
import arrow_icon from "./arrow-icon.png";
import arrow_icon_dark from "./arrow-icon-dark.png";
import menu_black from "./menu-black.png";
import menu_white from "./menu-white.png";
import close_black from "./close-black.png";
import close_white from "./close-white.png";
import web_icon from "./web-icon.png";
import mobile_icon from "./mobile-icon.png";
import ui_icon from "./ui-icon.png";
import graphics_icon from "./graphics-icon.png";
import right_arrow from "./right-arrow.png";
import send_icon from "./send-icon.png";
import right_arrow_bold from "./right-arrow-bold.png";
import right_arrow_bold_dark from "./right-arrow-bold-dark.png";

export const assets = {
  user_image,
  code_icon,
  code_icon_dark,
  edu_icon,
  edu_icon_dark,
  project_icon,
  project_icon_dark,
  vscode,
  firebase,
  figma,
  git,
  mongodb,
  right_arrow_white,
  logo,
  logo_dark,
  mail_icon,
  mail_icon_dark,
  profile_img,
  download_icon,
  hand_icon,
  header_bg_color,
  moon_icon,
  sun_icon,
  arrow_icon,
  arrow_icon_dark,
  menu_black,
  menu_white,
  close_black,
  close_white,
  web_icon,
  mobile_icon,
  ui_icon,
  graphics_icon,
  right_arrow,
  send_icon,
  right_arrow_bold,
  right_arrow_bold_dark,
};

export const workData = [
  {
    title: "AI Appointment Application",
    description: "Flutter Web app with Supabase backend, n8n automation, and WhatsApp API integration",
    bgImage: "/Work/AIAppointmentApp.png",
    link:"https://appointment-ai.alvinchiew.com/"
  },
  {
    title: "NodeJS Full Stack Application",
    description: "Simple E-commerce application developed with nodejs (expressjs) and ejs",
    bgImage: "/Work/FullStackApp.png",
    link:"https://github.com/JCC0219/Nodejs-Master-Exploration"
  },
  {
    title: "My Portfolio",
    description: "Single Page Portfolio with NextJS 15, Tailwind CSS, Framer motion",
    bgImage: "/Work/Portfolio.png", 
    link:"https://github.com/JCC0219/jc-portfolio-nextjs"
  },
  {
    title: "Car Plate Detection",
    description: "Car Plate Recognition and Detection with OpenVino (Python)",
    bgImage: "/Work/CarPlateDetection.png",
    link: "https://github.com/JCC0219/MyFYP-illegal-vehicle-detection-with-openVino"
  },
  {
    title: "Obj Rendering with OpenGLES",
    description: "Rendering .obj file to mobile screen using OpenGLES (Java)",
    bgImage: "/Work/RederOpenGL.png",
    link:"https://github.com/JCC0219/Render_WavefrontObj_to_Mobile_Using_OpenGLES"
  },
  // {
  //   title: "UI/UX designing",
  //   description: "UI/UX Design",
  //   bgImage: "/work-4.png",
  //   link: ""
  // },
  // {
  //   title: "UI/UX designing",
  //   description: "UI/UX Design",
  //   bgImage: "/work-4.png",
  //   link: ""
  // },
];

export const serviceData = [
  {
    icon: assets.web_icon,
    title: "Cloud Integration",
    description: "Oracle Integration Cloud (OIC) implementations for enterprise applications including AP, AR, GL, HCM, and Procurement modules with SOAP web services and ESS jobs.",
    link: "",
  },
  {
    icon: assets.mobile_icon,
    title: "Full Stack Development",
    description: "End-to-end application development using React, Next.js, Node.js, Flutter, and modern databases with REST/SOAP API integrations.",
    link: "",
  },
  {
    icon: assets.ui_icon,
    title: "Cloud Architecture",
    description: "Design and implement cloud-native solutions across AWS, OCI, GCP, and Alibaba Cloud with focus on security, scalability, and automation.",
    link: "",
  },
  {
    icon: assets.graphics_icon,
    title: "DevOps & Automation",
    description: "ETL pipeline development, workflow automation with n8n, containerization with Docker, and CI/CD implementation for modern applications.",
    link: "",
  },
];

export const infoList = [
  {
    icon: assets.code_icon,
    iconDark: assets.code_icon_dark,
    title: "Languages",
    description: "C++, Python, Java, Dart, JavaScript, SQL, Oracle PL/SQL, Bash, HTML, CSS",
  },
  {
    icon: assets.project_icon,
    iconDark: assets.project_icon_dark,
    title: "Present Workplace",
    description: "Deloitte Consulting SEA, Based in Kuala Lumpur, Malaysia | 2+ Years Experience",
  },
  {
    icon: assets.edu_icon,
    iconDark: assets.edu_icon_dark,
    title: "Education",
    description: "Bachelor of Computer Science (Honours)",
  },
];

export const toolsData = [
  assets.vscode,
  assets.firebase,
  assets.mongodb,
  assets.figma,
  assets.git,
];
