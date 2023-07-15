import React, { useEffect, useState } from 'react';
import { selectUsers, setLogged, setUser } from '@/features/users/usersSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import Image from 'next/image';
import Link from 'next/link';
import ThemeSwitcher from '../theme-switcher/ThemeSwitcher';
import { User } from '@/features/users/interfaces';
import burgerIcon from '../../public/images/burger_icon.svg..png';
import { deleteCookie } from 'cookies-next';
import router from 'next/router';
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

  const handlClickLogOut = () => {
    dispatch(setUser({} as User));
    dispatch(setLogged(false));
    setUserFromLocal({} as User);
    router.push('/');
    localStorage.clear();
    deleteCookie('token');
  };
  const handlClickEditProfile = () => {
    router.push('/edit');
  };

  return (
    <div className={menuContainer}>
      <Image
        onClick={handleClick}
        priority={true}
        width={20}
        src={burgerIcon}
        alt="burger menu icon"
      />
      {menu && (
        <menu className={menuStyle}>
          <div onClick={handleClick}>
            <nav>
              <Link href="/">home</Link>
              <Link href="/about">about</Link>
              <Link href="/galleries">galleries</Link>
              <Link href="/help">help</Link>
              {userFromLocal.name && logged && (
                <Link href={`/painters/${user.id}`}>gallery</Link>
              )}
            </nav>
            <div className={authContainer}>
              {logged ? (
                <>
                  <Link
                    className={authLink}
                    href="#"
                    onClick={handlClickLogOut}
                  >
                    Log Out
                  </Link>
                  <Link
                    className={authLink}
                    href="#"
                    onClick={handlClickEditProfile}
                  >
                    Edit Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link className={authLink} href={'/login'}>
                    Log In
                  </Link>
                  <Link className={authLink} href={'/signup'}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </menu>
      )}
    </div>
  );
};

export default Menu;
