'use client';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LandingPageLogo() {
  const [isShaking, setIsShaking] = useState(false);

  return (
    <Box sx={{ position: 'relative', width: '180px', height: '180px' }}>
      <motion.img
        src="./image/shopitect-logo.png"
        alt="page logo"
        animate={{
          opacity: 1,
          x: isShaking ? [-5, 5, -5, 5, 0] : 0,
          y: isShaking ? [-5, 5, -5, 5, 0] : 0,
        }}
        transition={{
          y: { type: 'spring', stiffness: 250, damping: 30, duration: 0.8 },
          x: { duration: 0.5, ease: 'easeInOut' },
          onComplete: () => {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
          },
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
}
