import Link from 'next/link';
import React, { useState } from 'react';
import burgerIcon from '../../public/images/burger_icon.svg..png';
import Image from 'next/image';
import styles from './menu.module.scss';
import ThemeSwitcher from '../theme-btn/ThemeSwitcher';

interface MenuProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const Menu = (props: MenuProps) => {
  const { menuContainer, menuStyle, authContainer } = styles;
  const { isDark, setIsDark } = props;
  const [menu, setMenu] = useState<boolean>(false);
  const handleClick = () => {
    setMenu(!menu);
  };

  return (
    <div className={menuContainer} onClick={handleClick}>
      <button onClick={handleClick}>
        <Image width={20} src={burgerIcon} alt="burger menu icon" />
      </button>
      {menu && (
        <menu className={menuStyle}>
          <nav>
            <Link href="/">home</Link>
            <Link href="/about">about</Link>
            <Link href="/galleries">galleries</Link>
            <Link href="/help">help</Link>
          </nav>
          <div className={authContainer}>
            <Link href={'/auth/login'}>Log In</Link>
            <Link href={'/auth'}>Sign Up</Link>
          </div>
            <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </menu>
      )}
    </div>
  );
};

export default Menu;
