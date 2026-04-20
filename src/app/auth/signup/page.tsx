"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Signup() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 -mt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
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
