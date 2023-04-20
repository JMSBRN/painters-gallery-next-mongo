import React from 'react';
import styles from './header.module.scss';
import ThemeSwitcher from '../theme-btn/ThemeSwitcher';
import Link from 'next/link';

interface HeaderProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header = (props: HeaderProps) => {
  const { isDark, setIsDark } = props;
    const { header } = styles;
  return (
    <header className={header}>
      <nav>
          <Link href='/'>home</Link>
          <Link href='/about'>about</Link>
          <Link href='/galleries'>galleries</Link>
          <Link href='/help'>help</Link>
      </nav>
      <ThemeSwitcher isDark={isDark} setIsDark={setIsDark}/>
    </header>
  );
};

export default Header;