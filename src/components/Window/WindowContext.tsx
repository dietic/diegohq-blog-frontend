import { createContext, useContext, useState } from 'react';

export enum WindowSizeStatus {
  NORMAL = 'normal',
  MAXIMIZED = 'maximized',
  MINIMIZED = 'minimized',
}

interface WindowContextType {
  windowSizeStatus: WindowSizeStatus;
  setWindowSizeStatus: (status: WindowSizeStatus) => void;
}

const WindowContext = createContext<WindowContextType>({
  windowSizeStatus: WindowSizeStatus.NORMAL,
  setWindowSizeStatus: () => {},
});

export const WindowContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [windowSizeStatus, setWindowSizeStatus] = useState(
    WindowSizeStatus.NORMAL
  );

  return (
    <WindowContext.Provider value={{ windowSizeStatus, setWindowSizeStatus }}>
      {children}
    </WindowContext.Provider>
  );
};

export function useWindowContext() {
  return useContext(WindowContext);
}