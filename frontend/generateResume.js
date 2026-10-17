import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 32, bottom: 32, left: 38, right: 38 }
});

const outputPath = path.join(__dirname, 'public', 'resume.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const primaryColor = '#1e1b4b'; // deep navy
const accentColor = '#6d28d9'; // purple
const textColor = '#1f2937'; // charcoal
const mutedColor = '#4b5563'; // gray

// Header
doc.fontSize(22).font('Helvetica-Bold').fillColor(primaryColor).text('NIHAL MV', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(11).font('Helvetica-Bold').fillColor(accentColor).text('MERN STACK DEVELOPER | FRONTEND DEVELOPER', { align: 'center' });
doc.moveDown(0.2);

doc.fontSize(8.5).font('Helvetica').fillColor(mutedColor).text(
  'Kerala, India  |  Email: nihalmv2004@gmail.com  |  GitHub: github.com/nihalmv-ops  |  LinkedIn: linkedin.com/in/nihal-mv-dev',
  { align: 'center' }
);
doc.moveDown(0.7);

function drawDivider(title) {
  doc.fontSize(10.5).font('Helvetica-Bold').fillColor(accentColor).text(title.toUpperCase());
  const y = doc.y;
  doc.strokeColor('#cbd5e1').lineWidth(0.8).moveTo(38, y + 2).lineTo(557, y + 2).stroke();
  doc.moveDown(0.4);
}

// Summary
drawDivider('Professional Summary');
doc.fontSize(9).font('Helvetica').fillColor(textColor).text(
  'Motivated and detail-oriented MERN Stack Developer with practical experience building responsive, user-friendly, and modern web applications using React.js, JavaScript, Tailwind CSS, Node.js, Express.js, and MongoDB. Proven track record delivering functional full-stack projects including supermarket retail POS applications, e-commerce storefronts, and travel platforms. Actively seeking opportunities as a React Developer, Frontend Developer, or MERN Stack Developer.',
  { lineGap: 2.2 }
);
doc.moveDown(0.6);

// Skills
drawDivider('Technical Skills');
function skillRow(category, items) {
  doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text(`${category}: `, { continued: true });
  doc.font('Helvetica').fillColor(textColor).text(items);
}

skillRow('Frontend', 'React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Vite, Responsive Design');
doc.moveDown(0.15);
skillRow('Backend & APIs', 'Node.js, Express.js, RESTful APIs, JSON');
doc.moveDown(0.15);
skillRow('Database', 'MongoDB, MongoDB Atlas, Mongoose');
doc.moveDown(0.15);
skillRow('Tools & Platforms', 'Git, GitHub, VS Code, Postman, Vercel, npm');
doc.moveDown(0.15);
skillRow('Core Strengths', 'Component-Based Architecture, UI Usability, Problem Solving, Continuous Learning');
doc.moveDown(0.6);

// Projects
drawDivider('Featured Projects');

// Project 1: SmartMart AI
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('SmartMart AI — Supermarket Management & Billing System', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(accentColor).text('  (Live: smartsh-ai-hrkd.vercel.app)', { align: 'right' });
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(mutedColor).text('Technologies: ', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(textColor).text('React.js, JavaScript, Node.js, Express.js, MongoDB  |  github.com/nihalmv-ops/smartshAI');
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(8.5).fillColor(textColor).list([
  'Developed a supermarket management and billing application focused on streamlining retail operations.',
  'Built a responsive user interface using React.js.',
  'Worked on backend API integration and database connectivity.',
  'Prepared the application for online deployment.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });
doc.moveDown(0.5);

// Project 2: TrachMart E-Commerce
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('TrachMart E-Commerce — TechNest Laptops & Mobiles', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(accentColor).text('  (Live: trachmartshop.vercel.app)', { align: 'right' });
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(mutedColor).text('Technologies: ', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(textColor).text('React.js, JavaScript, Vite, Tailwind CSS  |  github.com/nihalmv-ops/trachmartshop');
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(8.5).fillColor(textColor).list([
  'Developed a responsive e-commerce website for browsing laptops, mobile phones, and other technology products.',
  'Built reusable React components and responsive user interface elements.',
  'Implemented client-side navigation and interactive shopping features.',
  'Focused on responsive design and usability across desktop and mobile devices.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });
doc.moveDown(0.5);

// Project 3: GoTravel
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('GoTravel — Responsive Travel Website', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(accentColor).text('  (Live: rgotravel.vercel.app)', { align: 'right' });
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(mutedColor).text('Technologies: ', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(textColor).text('React.js, JavaScript, Tailwind CSS, HTML5, CSS3  |  github.com/nihalmv-ops/rgotravel');
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(8.5).fillColor(textColor).list([
  'Developed a responsive travel website using React.js and modern frontend technologies.',
  'Created reusable UI components and responsive layouts for desktop and mobile devices.',
  'Implemented interactive user interface elements with a focus on usability and visual consistency.',
  'Published the application online using Vercel.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });
doc.moveDown(0.6);

// Education
drawDivider('Education');
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Bachelor of Computer Applications (BCA)', { continued: true });
doc.font('Helvetica-Bold').fontSize(9).fillColor(accentColor).text('2023 – 2026', { align: 'right' });
doc.font('Helvetica').fontSize(8.5).fillColor(mutedColor).text('Undergraduate Degree Program  |  Kerala, India');
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(8.5).fillColor(textColor).text(
  'Coursework & Foundation: Data Structures, Web Development, Object-Oriented Programming, Database Management Systems (DBMS), Operating Systems, and Software Engineering Principles.'
);
doc.moveDown(0.6);

// Continuous Learning
drawDivider('Self-Directed Learning & Development');
doc.fontSize(8.5).font('Helvetica').fillColor(textColor).list([
  'Full Stack JavaScript Development: Hands-on implementation of MERN architecture, asynchronous programming, and REST APIs.',
  'Version Control & Collaboration: Proficient with Git workflows, branch management, code reviews, and GitHub repositories.',
  'Web Accessibility & Modern Web: Practicing semantic markup, responsive design principles, and Core Web Vitals.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });

doc.end();

writeStream.on('finish', () => {
  console.log('Resume PDF updated successfully at:', outputPath);
});
