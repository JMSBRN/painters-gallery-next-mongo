import React from 'react';
import styles from './header.module.scss';
import ThemeBtn from '../theme-btn/ThemeBtn';

interface HeaderProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header = (props: HeaderProps) => {
  const { isDark, setIsDark } = props;
    const { header } = styles;
  return (
    <header className={header}>
      <ThemeBtn isDark={isDark} setIsDark={setIsDark}/>
    </header>
  );
};

export default Header;