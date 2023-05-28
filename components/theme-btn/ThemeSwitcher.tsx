import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

interface ThemBtnProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const ThemeSwitcher = (props: ThemBtnProps) => {
  const { isDark, setIsDark } = props;
  return (
    <div className='theme-btn' style={{ opacity: '0.7' }}>
      {isDark && '☀️'}
      <Switch checked={isDark} onChange={() => setIsDark(!isDark)} />
      {!isDark && '🌙'}
    </div>
  );
};

export default ThemeSwitcher;
