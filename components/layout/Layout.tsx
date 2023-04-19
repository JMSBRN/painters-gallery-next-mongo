import React, { ReactElement } from 'react';
import styles from './layout.module.scss';

const Layout = ({ children }: { children: ReactElement }) => {
  const { layout, main } = styles;
  return (
    <div className={layout}>
      <div className={main}>{children}</div>
    </div>
  );
};

export default Layout;
