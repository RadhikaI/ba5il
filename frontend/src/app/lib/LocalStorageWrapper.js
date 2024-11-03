// lib/localStorageWrapper.js

class LocalStorageWrapper {
  static read(name) {
    if (typeof window === 'undefined') return null;
    try {
      const data = window.localStorage.getItem(name);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return null;
    }
  }

  static write(name, contents) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, JSON.stringify(contents));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }

  static list() {
    if (typeof window === 'undefined') return [];
    try {
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        if (window.localStorage.key(i) != "ally-supports-cache" && window.localStorage.key(i) != "__NEXT_DISMISS_PRERENDER_INDICATOR")
          keys.push(window.localStorage.key(i));
      }
      return keys;
    } catch (error) {
      console.error("Error listing keys in localStorage", error);
      return [];
    }
  }
  static rm(key) {
    if (typeof window === 'undefined') return [];
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }
}

export default LocalStorageWrapper;
