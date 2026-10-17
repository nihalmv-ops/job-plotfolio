import React from 'react';

export const skillCategories = [
  {
    category: "Frontend",
    description: "Building responsive, modern, and accessible user interfaces",
    icon: "Layout",
    skills: [
      { name: "HTML5", level: "Advanced" },
      { name: "CSS3", level: "Advanced" },
      { name: "JavaScript", level: "Advanced" },
      { name: "React.js", level: "Advanced" },
      { name: "Tailwind CSS", level: "Proficient" }
    ]
  },
  {
    category: "Backend",
    description: "Developing robust server-side APIs and business logic",
    icon: "Server",
    skills: [
      { name: "Node.js", level: "Proficient" },
      { name: "Express.js", level: "Proficient" },
      { name: "REST APIs", level: "Proficient" }
    ]
  },
  {
    category: "Database",
    description: "Designing schema structures and managing cloud databases",
    icon: "Database",
    skills: [
      { name: "MongoDB", level: "Proficient" },
      { name: "MongoDB Atlas", level: "Proficient" }
    ]
  },
  {
    category: "Tools",
    description: "Version control, API testing, and modern developer workflows",
    icon: "Wrench",
    skills: [
      { name: "Git", level: "Proficient" },
      { name: "GitHub", level: "Proficient" },
      { name: "VS Code", level: "Proficient" },
      { name: "Postman", level: "Proficient" }
    ]
  }
];

export const techIcons = [
  {
    name: "React",
    color: "#61DAFB",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
      </svg>
    )
  },
  {
    name: "JavaScript",
    color: "#F7DF1E",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M12.5 17.5c.5.8 1.3 1.3 2.4 1.3 1.2 0 1.9-.6 1.9-1.5 0-1-.8-1.4-2.2-2-1.9-.8-3.2-1.8-3.2-3.8 0-1.9 1.5-3.3 3.8-3.3 1.6 0 2.8.6 3.6 2l-1.8 1.1c-.4-.7-.9-1.1-1.8-1.1-.9 0-1.5.5-1.5 1.2 0 .8.6 1.2 1.9 1.7 2.1.9 3.5 1.8 3.5 4 0 2.3-1.8 3.5-4.2 3.5-2.3 0-3.8-1.1-4.4-2.5l2-1.1zM6.5 17.6c.4.6.8 1 1.6 1 .9 0 1.5-.4 1.5-1.9V8.5h2.4v8.2c0 2.7-1.6 3.8-3.9 3.8-1.8 0-3.1-.9-3.7-2.3l2.1-1.2z" fill="#000000" />
      </svg>
    )
  },
  {
    name: "HTML5",
    color: "#E34F26",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M4 2.5L5.7 20 12 21.8l6.3-1.8L20 2.5H4z" fill="#E34F26" />
        <path d="M12 4.1v15.9l4.9-1.4L18.2 4.1H12z" fill="#EF652A" />
        <path d="M8.2 7.2h7.6l-.3 2.8H8.5l.3 2.8h6.5l-.6 6-2.7.8-2.7-.8-.2-2.1H7.8l.3 3.6 3.9 1.1 3.9-1.1.9-9.9H8.2V7.2z" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    name: "CSS3",
    color: "#1572B6",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M4 2.5L5.7 20 12 21.8l6.3-1.8L20 2.5H4z" fill="#1572B6" />
        <path d="M12 4.1v15.9l4.9-1.4L18.2 4.1H12z" fill="#33A9DC" />
        <path d="M12 7.2H8.2l.2 2.8H12v-2.8zm0 5.6H9.7l.2 2.2 2.1.6V18l-3.8-1-.3-3.6H12v-.6zm0-5.6h3.8l-.3 2.8H12V7.2zm0 5.6h2.2l-.2 2.2-2 .6V18l3.8-1 .4-4.2H12v-.6z" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    name: "Node.js",
    color: "#5FA04E",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2z" fill="#333333" />
        <path d="M12 4l7 4v8l-7 4-7-4V8l7-4z" fill="#5FA04E" />
        <path d="M12 7.5a4.5 4.5 0 00-4.5 4.5v2a2 2 0 002 2h5a2 2 0 002-2v-2A4.5 4.5 0 0012 7.5zm0 1.8a2.7 2.7 0 012.7 2.7v.5h-5.4v-.5a2.7 2.7 0 012.7-2.7z" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    name: "Express",
    color: "#FFFFFF",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="12" fill="#252525" />
        <text x="12" y="16" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ex</text>
      </svg>
    )
  },
  {
    name: "MongoDB",
    color: "#47A248",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 1.5s-6 5.5-6 11.5c0 4.8 4 8.5 6 9.5 2-1 6-4.7 6-9.5 0-6-6-11.5-6-11.5z" fill="#47A248" />
        <path d="M12 1.5v21c2-1 6-4.7 6-9.5 0-6-6-11.5-6-11.5z" fill="#4CAF50" />
        <path d="M12 12.5c-.8 0-1.5.7-1.5 1.5 0 2 1.5 4 1.5 4s1.5-2 1.5-4c0-.8-.7-1.5-1.5-1.5z" fill="#FFFFFF" opacity="0.8" />
      </svg>
    )
  },
  {
    name: "Git",
    color: "#F05032",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M21.6 10.9L13.1 2.4a1.7 1.7 0 00-2.4 0l-1.9 1.9 3 3a2 2 0 012.5 2.5l2.9 2.9a2 2 0 11-1.2 1.2l-2.7-2.7v4.6a2 2 0 11-1.7 0v-4.8a2 2 0 01-1.1-2.6l-3-3-4.1 4.1a1.7 1.7 0 000 2.4l8.5 8.5a1.7 1.7 0 002.4 0l8.5-8.5a1.7 1.7 0 000-2.4z" fill="#F05032" />
      </svg>
    )
  },
  {
    name: "GitHub",
    color: "#FFFFFF",
    svg: (
      <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-8 h-8">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    )
  },
  {
    name: "VS Code",
    color: "#007ACC",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M17.5 2.2l-9.8 8.8L3.2 7.7.8 9.3l4.6 3.7-4.6 3.7 2.4 1.6 4.5-3.3 9.8 8.8 4.5-2.2V4.4l-4.5-2.2zm0 4.6v12.4l-7.2-6.2 7.2-6.2z" fill="#007ACC" />
      </svg>
    )
  },
  {
    name: "Tailwind CSS",
    color: "#06B6D4",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 6c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8 1.3 1.4 2.8 2.9 6.3 2.9 3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8-1.3-1.4-2.8-2.9-6.3-2.9zM6 12c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8 1.3 1.4 2.8 2.9 6.3 2.9 3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8-1.3-1.4-2.8-2.9-6.3-2.9z" fill="#06B6D4" />
      </svg>
    )
  },
  {
    name: "Postman",
    color: "#FF6C37",
    svg: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" fill="#FF6C37" />
        <path d="M14.5 7.5L8.2 11l4.8 2.8 1.5-6.3zM7.5 12.2l-.7 2.8 2.8-1.5-2.1-1.3z" fill="#FFFFFF" />
      </svg>
    )
  }
];

