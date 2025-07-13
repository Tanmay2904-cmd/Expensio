import React, { useState } from 'react';
import { IconButton, Box } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

// You can download these SVGs and place them in your assets folder for production use
const illustrations = [
  'https://undraw.co/api/illustrations/undraw_wallet_aym5.svg',
  'https://undraw.co/api/illustrations/undraw_savings_re_eq4w.svg',
  'https://undraw.co/api/illustrations/undraw_online_payments_re_y8f2.svg',
  'https://undraw.co/api/illustrations/undraw_investment_data_re_sh9x.svg',
  'https://undraw.co/api/illustrations/undraw_budget_6gux.svg',
  'https://undraw.co/api/illustrations/undraw_credit_card_re_blml.svg',
  'https://undraw.co/api/illustrations/undraw_personal_finance_tqcd.svg',
];

const animatedBg = (
  <svg width="100%" height="220" style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
    <g>
      {/* Floating coins */}
      <circle cx="40" cy="60" r="12" fill="#FFD700" opacity="0.25">
        <animate attributeName="cy" values="60;180;60" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="120" r="8" fill="#FFD700" opacity="0.18">
        <animate attributeName="cy" values="120;40;120" dur="7s" repeatCount="indefinite" />
      </circle>
      {/* Animated chart line */}
      <polyline points="0,180 40,120 80,160 120,100 160,140 200,80 240,120 280,60 320,100 360,60 400,120" fill="none" stroke="#1976d2" strokeWidth="2" opacity="0.12">
        <animate attributeName="points" values="0,180 40,120 80,160 120,100 160,140 200,80 240,120 280,60 320,100 360,60 400,120;0,120 40,180 80,100 120,160 160,80 200,140 240,60 280,120 320,60 360,100 400,60;0,180 40,120 80,160 120,100 160,140 200,80 240,120 280,60 320,100 360,60 400,120" dur="8s" repeatCount="indefinite" />
      </polyline>
    </g>
  </svg>
);

const FinanceBanner = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const handlePrev = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((prev) => (prev === 0 ? illustrations.length - 1 : prev - 1));
      setFade(false);
    }, 200);
  };
  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((prev) => (prev === illustrations.length - 1 ? 0 : prev + 1));
      setFade(false);
    }, 200);
  };

  return (
    <Box sx={{
      width: '100%',
      height: 220,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(90deg, #f4f6fa 60%, #e3eafc 100%)',
      borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {animatedBg}
      <IconButton
        sx={{ position: 'absolute', left: 16, zIndex: 2, bgcolor: 'white', '&:hover': { bgcolor: '#e3eafc', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}
        onMouseEnter={handlePrev}
        size="large"
      >
        <ArrowBackIosNew fontSize="inherit" />
      </IconButton>
      <Box
        sx={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
        }}
      >
        <img
          src={illustrations[index]}
          alt={`Finance Illustration ${index + 1}`}
          style={{
            height: 160,
            width: 'auto',
            background: 'transparent',
            borderRadius: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'opacity 0.3s, transform 0.3s',
            opacity: fade ? 0 : 1,
            transform: fade ? 'scale(0.92)' : 'scale(1)',
          }}
        />
      </Box>
      <IconButton
        sx={{ position: 'absolute', right: 16, zIndex: 2, bgcolor: 'white', '&:hover': { bgcolor: '#e3eafc', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}
        onMouseEnter={handleNext}
        size="large"
      >
        <ArrowForwardIos fontSize="inherit" />
      </IconButton>
    </Box>
  );
};

export default FinanceBanner; 