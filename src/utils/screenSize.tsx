import React, { Context, createContext, useContext, useEffect, useState } from 'react';

interface ScreenSizeContextValues {
  isScreenLess: boolean;
}

const RESPONSIVE_SIZE = 540; // surface duo size - max mobile screen width

// eslint-disable-next-line max-len
const ScreenSizeContext: Context<null | ScreenSizeContextValues> = createContext<null | ScreenSizeContextValues>(
  null,
);

export const ScreenSizeProvider = ({ children }) => {
  const [isScreenLess, setIsScreenLess] = useState<boolean>(window.innerWidth <= RESPONSIVE_SIZE);

  const resizeHandler = (): void => {
    setIsScreenLess(window.innerWidth <= RESPONSIVE_SIZE);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);

  return (
    <ScreenSizeContext.Provider value={{ isScreenLess }}>{children}</ScreenSizeContext.Provider>
  );
};

export const useScreenSize = () => {
  const context = useContext(ScreenSizeContext);
  if (!context) throw new Error('Missing referrer context');

  return {
    isScreenLess: context.isScreenLess,
  };
};
