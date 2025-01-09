import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

const PromptContext = createContext<any>(null);

interface PromptContextProviderProps {
  children: ReactNode;
}

export const PromptContextProvider: React.FC<PromptContextProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<any>("I want to buy a property of type appartment which is located at DonwTown Dubai, with a price range of 200,000 AED, my preference regarding beds and bath is 7, and if furnished, it would be great.");

  return (
    <PromptContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PromptContext.Provider>
  );
};

export default PromptContext;
