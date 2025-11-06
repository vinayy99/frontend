import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Project, SkillSwap } from "../types";
import * as api from "../services/api";

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillSwaps, setSkillSwaps] = useState<SkillSwap[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setUsers(await api.getUsers());
      setProjects(await api.getProjects());
      if (token) setSkillSwaps(await api.getSkillSwaps(token));
    } catch {}
  };

  useEffect(() => { load(); }, [token, currentUser]);

  const login = async (email: string, password: string) => {
    try {
      const result = await api.login(email, password);
      setCurrentUser(result.user);
      setToken(result.token);
      localStorage.setItem("token", result.token);
      load();
    } catch {
      setError("Invalid email or password");
    }
  };

  const signup = async (name: string, email: string, password: string, skills: string, bio: string) => {
    try {
      const skillArr = skills.split(",").map(s => s.trim());
      const result = await api.register(name, email, password, skillArr, bio);
      setCurrentUser(result.user);
      setToken(result.token);
      localStorage.setItem("token", result.token);
      load();
    } catch {
      setError("Signup failed");
    }
  };

  const clearError = () => setError(null);

  return (
    <AppContext.Provider value={{
      users, projects, skillSwaps, currentUser, token,
      login, signup, clearError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
