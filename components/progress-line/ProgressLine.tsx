import NProgress from 'nprogress';
import NextNProgress from 'nextjs-progressbar';
import React from 'react';
import Router from 'next/router';

const ProgressLine = () => {
  return (
    <>
      <NextNProgress
        color="#cb1414"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        options={{ showSpinner: false }}
        transformCSS={(css) => {
          const modifiedCss = `
              ${css}
              /* modify the progress bar height */
              #nprogress .bar {
                position: absolut;
                top: 80px;
                z-index: 8;
              }
  
              /* modify the progress bar color */
              #nprogress .peg {
                display: none;
              }
              #nprogress .bar {
                background-color: rgba(206, 42, 42, 0.6);
              }
              #nprogress .spinner-icon {
                border-top-color: #29D;
                border-left-color: #29D;
              }
            `;

          return <style>{modifiedCss}</style>;
        }}
      />
    </>
  );
};

export default ProgressLine;

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});
