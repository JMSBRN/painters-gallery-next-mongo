import React, { useEffect, useState } from 'react';
import { selectUsers, setLogged } from '@/features/users/usersSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import Image from 'next/image';
import Link from 'next/link';
import ThemeSwitcher from '../theme-switcher/ThemeSwitcher';
import { User } from '@/features/users/interfaces';
import burgerIcon from '../../public/images/burger_icon.svg..png';
import secureLocalUtils from '../../utils/secureLocalStorageUtils';
import styles from './menu.module.scss';

interface MenuProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const Menu = (props: MenuProps) => {
  const { menuContainer, menuStyle, authContainer, authLink } = styles;
  const { isDark, setIsDark } = props;
  const [menu, setMenu] = useState<boolean>(false);
  const { user, logged } = useAppSelector(selectUsers);
  const [userFromLocal, setUserFromLocal] = useState({} as User);
  const { getDecryptedDataFromLocalStorage } = secureLocalUtils;
  const dispatch = useAppDispatch();
  const handleClick = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    const data = getDecryptedDataFromLocalStorage('user');

     if (data) {
      setUserFromLocal(data);
      dispatch(setLogged(true));
     }
  }, [dispatch, getDecryptedDataFromLocalStorage, logged]);

  return (
    <div className={menuContainer}>
      <button onClick={handleClick}>
        <Image priority={true} width={20} src={burgerIcon} alt="burger menu icon" />
      </button>
      {menu && (
        <menu className={menuStyle}>
          <div onClick={handleClick}>
            <nav>
              <Link href="/">home</Link>
              <Link href="/about">about</Link>
              <Link href="/galleries">galleries</Link>
              <Link href="/help">help</Link>
              {(userFromLocal.name && logged) && <Link href={`/painters/${user.id}`}>gallery</Link>}
            </nav>
            <div className={authContainer}>
              <Link className={authLink} href={'/login'}>Log In</Link>
              <Link className={authLink} href={'/signup'}>Sign Up</Link>
            </div>
          </div>
          <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </menu>
      )}
    </div>
  );
};

export default Menu;
