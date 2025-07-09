import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onEnd }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onEnd();
    }, 4000); // duration before hiding

    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-40 h-40 md:w-64 md:h-64 border-4 border-blue-500 rounded-full flex items-center justify-center"
          >
            {/* Background radial glow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: [1.2, 1.5, 1.2],
                opacity: [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-full h-full rounded-full bg-blue-500/20 blur-2xl"
            />

            {/* Inner Pulsing Core */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.9, 1.4, 0.9] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 md:w-28 md:h-28 bg-blue-500/40 rounded-full shadow-lg"
            />

            {/* Rotating Container with Orbiting Dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Dots evenly placed around a circle */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 360) / 6;
                const radius = 110; // radius in px for md:h-64
                const x =
                  radius *
                  Math.cos((angle * Math.PI) / 180);
                const y =
                  radius *
                  Math.sin((angle * Math.PI) / 180);
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full shadow-md"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>

          {/* FAMFLIX Text */}
          <motion.h1
            initial={{ opacity: 0, y: 80 }} // Start further below
            animate={{ opacity: 1, y: 0 }} // End at natural position
            transition={{ delay: 0.6, duration: 1 }}
            className="text-blue-500 text-3xl md:text-5xl font-extrabold mt-8 tracking-widest"
          >
            <img
              src="/famflix logo wobg.png"
              alt=""
              className="w-42"
            />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 80 }} // Start further below
            animate={{ opacity: 1, y: 0 }} // End at natural position
            transition={{ delay: 0.6, duration: 1 }}
            className="text-white text-md md:text-xl mt-2 tracking-widest"
          >
            Premium Streaming Experience
          </motion.p>

          {/* Vertical glowing line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }} // you can adjust this length
            transition={{ delay: 1, duration: 1 }}
            className="h-1 mt-6 bg-blue-500 shadow-[0_0_10px_4px_rgba(59,130,246,0.5)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
