import { Checkbox } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import React from 'react';
import styles from './themeSwitcher.module.scss';

interface ThemBtnProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const ThemeSwitcher = (props: ThemBtnProps) => {
  const { themeSwitcherContainer, darkModeIcon, lightModeIcon } = styles;
  const { isDark, setIsDark } = props;
  const handleChangeTheme = () => {
    setIsDark(!isDark);
  };
  
  return (
    <div className={themeSwitcherContainer} style={{ opacity: '0.7' }}>
      <Checkbox 
        checked={isDark}
        onChange={handleChangeTheme}
        icon={ <DarkModeIcon className={darkModeIcon} />}
        checkedIcon={ <LightModeIcon className={lightModeIcon} /> }
       />
    </div>
  );
};

export default ThemeSwitcher;
