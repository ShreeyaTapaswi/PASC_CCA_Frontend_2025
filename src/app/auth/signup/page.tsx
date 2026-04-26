"use client";

import React from "react";
import { motion } from "framer-motion";

const SLIDES = [
  {
    image: "/signup.png",
    title: "Track & Achieve",
    desc: "Your one-stop platform for discovering events, tracking credits, and competing with peers."
  },
  {
    image: "/signup.png",
    title: "Grow Your Network",
    desc: "Connect with industry professionals and ambitious peers to build your future."
  },
  {
    image: "/signup.png",
    title: "Unlock Opportunities",
    desc: "Gain exclusive access to workshops, hackathons, and tech talks."
  },
  {
    image: "/signup.png",
    title: "Unlock Opportunities",
    desc: "Gain exclusive access to workshops, hackathons, and tech talks."
  }
];

export default function Signup() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-10 px-4 sm:p-8 bg-[var(--color-background)] overflow-hidden transition-colors duration-200">
      {/* Decorative Background Matches Home Page Vibe */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(43, 166, 223, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(43, 166, 223, 0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#2BA6DF]/15 dark:bg-[#2BA6DF]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-[-10%] w-[400px] h-[400px] bg-[#FDB811]/10 dark:bg-[#FDB811]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col w-full max-w-screen-md min-h-[400px] rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 p-8 items-center text-center justify-center border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-6">
          Registrations Closed
        </h2>
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <p className="text-xl text-[var(--color-text-muted)] font-medium max-w-lg mb-8">
          Closed Review — Invite Only. Contact the admin for access.
        </p>
      </motion.div>
    </div>
  );
}
