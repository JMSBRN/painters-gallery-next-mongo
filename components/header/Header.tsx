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
  const { header, headerContainer, authLink } = styles;
  return (
    <header className={header}>
      <div className={headerContainer}>
        <nav>
          <Link href="/">home</Link>
          <Link href="/about">about</Link>
          <Link href="/galleries">galleries</Link>
          <Link href="/help">help</Link>
        </nav>
        <>
          <Link className={authLink} href={'/auth'}>Sign Up</Link>
          <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </>
      </div>
    </header>
  );
};

export default Header;
