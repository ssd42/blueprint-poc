// AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Mapping {
  id: number;
  shape: 'rect';
  coords: [number, number, number, number];
  title: string;
}

interface ContextValue {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  mappings: Mapping[];
  setMappings: React.Dispatch<React.SetStateAction<Mapping[]>>;
  associations: { [id: number]: string }; // Mapping ID to photo URL
  setAssociations: React.Dispatch<React.SetStateAction<{ [id: number]: string }>>;
}

const AppContext = createContext<ContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [image, setImage] = useState<string | null>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [associations, setAssociations] = useState<{ [id: number]: string }>({});

  return (
    <AppContext.Provider value={{ image, setImage, mappings, setMappings, associations, setAssociations }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
