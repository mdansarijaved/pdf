"use client";
import React, { useEffect } from "react";
export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isServer, setIsServer] = React.useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);
  return isServer ? null : children;
};
