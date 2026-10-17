import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 36, bottom: 36, left: 40, right: 40 }
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
doc.fontSize(12).font('Helvetica-Bold').fillColor(accentColor).text('MERN STACK DEVELOPER | FRONTEND DEVELOPER', { align: 'center' });
doc.moveDown(0.2);

doc.fontSize(9).font('Helvetica').fillColor(mutedColor).text(
  'Kerala, India  |  Email: nihalmv2004@gmail.com  |  GitHub: github.com/nihalmv-ops  |  LinkedIn: linkedin.com/in/nihal-mv-dev',
  { align: 'center' }
);
doc.moveDown(0.8);

function drawDivider(title) {
  doc.fontSize(11).font('Helvetica-Bold').fillColor(accentColor).text(title.toUpperCase());
  const y = doc.y;
  doc.strokeColor('#cbd5e1').lineWidth(0.8).moveTo(40, y + 2).lineTo(555, y + 2).stroke();
  doc.moveDown(0.5);
}

// Summary
drawDivider('Professional Summary');
doc.fontSize(9.5).font('Helvetica').fillColor(textColor).text(
  'Passionate and motivated MERN Stack Developer with strong foundations in React.js, JavaScript, Node.js, Express.js, and MongoDB. Experienced in developing responsive, accessible, and user-friendly web applications with clean component architecture and modern UI standards. Eager to contribute technical skills and collaborative problem-solving to a dynamic development team as a React / Frontend / MERN Stack Developer.',
  { lineGap: 2.5 }
);
doc.moveDown(0.8);

// Skills
drawDivider('Technical Skills');
function skillRow(category, items) {
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text(`${category}: `, { continued: true });
  doc.font('Helvetica').fillColor(textColor).text(items);
}

skillRow('Frontend', 'React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Responsive Design, Context API');
doc.moveDown(0.2);
skillRow('Backend', 'Node.js, Express.js, RESTful APIs, JSON');
doc.moveDown(0.2);
skillRow('Database', 'MongoDB, MongoDB Atlas, Mongoose');
doc.moveDown(0.2);
skillRow('Developer Tools', 'Git, GitHub, VS Code, Postman, Vercel, npm');
doc.moveDown(0.2);
skillRow('Core Strengths', 'Component-Based Architecture, UI/UX Implementation, Problem Solving, Continuous Learning');
doc.moveDown(0.8);

// Projects
drawDivider('Key Projects');

// Project 1
doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('TrachMart E-Commerce', { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('  |  React, JavaScript, Tailwind CSS, Context API', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(accentColor).text('  (Live: trachmartshop.vercel.app)', { align: 'right' });
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(9).fillColor(textColor).list([
  'Architected a modern e-commerce storefront with intuitive product catalog navigation, dynamic product cards, and responsive layouts.',
  'Implemented shopping cart state management with Context API, supporting item addition, quantity adjustments, and pricing calculations.',
  'Designed a mobile-first, ATS and SEO-friendly interface utilizing Tailwind CSS utility classes and semantic HTML5.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });
doc.moveDown(0.6);

// Project 2
doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Budget Insights & Expense Tracker', { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('  |  React, JavaScript, Tailwind CSS, Chart.js', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(accentColor).text('  (github.com/nihalmv-ops)', { align: 'right' });
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(9).fillColor(textColor).list([
  'Developed a personal finance and budgeting dashboard to track income, expense streams, and categorizations in real-time.',
  'Integrated visual data representations with modern charting libraries to offer users clear monthly budget breakdowns and spending trends.',
  'Ensured modular, maintainable code structure with custom React hooks and validated input forms for financial records.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });
doc.moveDown(0.6);

// Project 3
doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('SmartMart AI', { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('  |  React, Node.js, Express.js, MongoDB', { continued: true });
doc.font('Helvetica').fontSize(8.5).fillColor(accentColor).text('  (github.com/nihalmv-ops/smartshAI)', { align: 'right' });
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(9).fillColor(textColor).list([
  'Engineered a supermarket management and billing application engineered for seamless point-of-sale (POS) and inventory workflows.',
  'Implemented backend REST endpoints using Node.js and Express to manage product catalogs, inventory updates, and transactions.',
  'Designed schema structures with MongoDB to record store sales and support rapid product search and invoice tracking.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });
doc.moveDown(0.8);

// Education
drawDivider('Education');
doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('Bachelor of Computer Applications (BCA)', { continued: true });
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(accentColor).text('2023 – 2026', { align: 'right' });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('Undergraduate Degree Program  |  Kerala, India');
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9).fillColor(textColor).text(
  'Coursework & Foundation: Data Structures, Web Development, Object-Oriented Programming, Database Management Systems (DBMS), Operating Systems, and Software Engineering Principles.'
);
doc.moveDown(0.8);

// Continuous Learning
drawDivider('Self-Directed Learning & Development');
doc.fontSize(9).font('Helvetica').fillColor(textColor).list([
  'Full Stack JavaScript Development: Hands-on implementation of MERN architecture, asynchronous programming, and REST APIs.',
  'Version Control & Collaboration: Proficient with Git workflows, branch management, code reviews, and GitHub repositories.',
  'Web Accessibility & Modern Web: Practicing semantic markup, responsive design principles, and Core Web Vitals.'
], { bulletRadius: 1.5, textIndent: 12, lineGap: 1.5 });

doc.end();

writeStream.on('finish', () => {
  console.log('Resume PDF generated successfully at:', outputPath);
});
