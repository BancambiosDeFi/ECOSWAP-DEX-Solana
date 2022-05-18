import React, { Context, createContext, useContext, useEffect, useState } from 'react';

interface ScreenSizeContextValues {
  isMobile: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

const MOBILE_SIZE = 768; // surface duo size - max mobile screen width
const LAPTOP_SIZE = 1200;
const DESKTOP_SIZE = 1440;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LARGE_DESKTOP_SIZE = 4000;

// eslint-disable-next-line max-len
const ScreenSizeContext: Context<null | ScreenSizeContextValues> = createContext<null | ScreenSizeContextValues>(
  null,
);

export const ScreenSizeProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= MOBILE_SIZE);
  const [isLaptop, setIsLaptop] = useState<boolean>(window.innerWidth <= LAPTOP_SIZE);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > LAPTOP_SIZE);
  const [isLargeDesktop, setIsLargeDesktop] = useState<boolean>(window.innerWidth > DESKTOP_SIZE);

  const resizeHandler = (): void => {
    setIsMobile(window.innerWidth <= MOBILE_SIZE);
    setIsLaptop(window.innerWidth > MOBILE_SIZE && window.innerWidth <= LAPTOP_SIZE);
    setIsDesktop(window.innerWidth > LAPTOP_SIZE);
    setIsLargeDesktop(window.innerWidth > DESKTOP_SIZE);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);

  return (
    <ScreenSizeContext.Provider value={{ isMobile, isLaptop, isDesktop, isLargeDesktop }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

export const useScreenSize = () => {
  const context = useContext(ScreenSizeContext);
  if (!context) throw new Error('Missing referrer context');

  return {
    isMobile: context.isMobile,
    isLaptop: context.isLaptop,
    isDesktop: context.isDesktop,
    isLargeDesktop: context.isLargeDesktop,
  };
};
