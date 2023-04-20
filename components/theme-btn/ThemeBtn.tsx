import React from 'react';

interface ThemBtnProps {
    isDark: boolean;
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const ThemeBtn = (props: ThemBtnProps) => {
   const { isDark, setIsDark } = props;
  return (
    <div>
        <button onClick={() => setIsDark(!isDark)} className="theme-btn">set theme {isDark ?'light' : 'dark'}</button>
    </div>
  );
};

export default ThemeBtn;
