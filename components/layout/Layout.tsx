import BackGroundImage from '../back_ground-image/BackGroundImage';
import React  from 'react';
import backGroundImageDark from '../../public/images/tree-736885_1280.jpg';
import backGroundImageLight from '../../public/images/sea.jpg';
import styles from './layout.module.scss';

const Layout = ({ children, isDark }: { children: ReactNode, isDark: boolean }) => {
  const { layout, main } = styles;

  return (
    <main className={layout}>
       <BackGroundImage width={400} src={isDark ? backGroundImageDark : backGroundImageLight} />
      <div className={main}>{children}</div>
    </main>
  );
};

export default Layout;
