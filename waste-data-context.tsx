"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Submission {
  lga: string;
  tons: number;
  date: string; // YYYY-MM-DD
}

// Sample initial data to make the charts appear on first load
const initialSubmissions: Submission[] = [
  { lga: "Ikeja", tons: 12, date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0] },
  { lga: "Alimosho", tons: 25, date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0] },
  { lga: "Surulere", tons: 18, date: new Date().toISOString().split("T")[0] },
];

interface WasteDataContextType {
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
}

const WasteDataContext = createContext<WasteDataContextType | undefined>(undefined);

export function WasteDataProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const addSubmission = (submission: Submission) => {
    setSubmissions((prev) => [...prev, submission]);
  };

  return (
    <WasteDataContext.Provider value={{ submissions, addSubmission }}>
      {children}
    </WasteDataContext.Provider>
  );
}

export function useWasteData() {
  const context = useContext(WasteDataContext);
  if (!context) {
    throw new Error("useWasteData must be used within a WasteDataProvider");
  }
  return context;
}