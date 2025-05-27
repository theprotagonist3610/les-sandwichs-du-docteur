import { createContext, useContext, useState } from "react";
import FullPageLoader from "../components/FullPageLoader";

const FullLoaderContext = createContext();

export function FullLoaderProvider({ children }) {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <FullLoaderContext.Provider value={{ show, hide }}>
      {visible && <FullPageLoader />}
      {children}
    </FullLoaderContext.Provider>
  );
}

export function useFullLoader() {
  return useContext(FullLoaderContext);
}
