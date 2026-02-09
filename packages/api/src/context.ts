export interface Context {
  // Will be populated with session, db, etc. in later phases
  userId?: string;
}

export function createContext(): Context {
  return {};
}
