// src/components/PageSwitcher.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const pages = {
  home: "Welcome to Home!",
  about: "About Us Section",
  contact: "Contact Info Here",
};

export default function PageSwitcher() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [rippleKey, setRippleKey] = useState(0);

  const handleChange = (e) => {
    setSelectedPage(e.target.value);
    setRippleKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Radio buttons */}
      <div className="mb-8 space-x-4">
        {Object.keys(pages).map((key) => (
          <label key={key} className="cursor-pointer">
            <input
              type="radio"
              name="page"
              value={key}
              checked={selectedPage === key}
              onChange={handleChange}
              className="mr-2"
            />
            {key.toUpperCase()}
          </label>
        ))}
      </div>

      {/* Ripple animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={rippleKey}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 20, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full bg-blue-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        />
      </AnimatePresence>

      {/* Page content */}
      <div className="relative z-10 text-center text-xl font-semibold p-8">
        {pages[selectedPage]}
      </div>
    </div>
  );
}
