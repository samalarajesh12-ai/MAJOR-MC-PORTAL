/**
 * Utility functions for interacting with localStorage safely in a Next.js environment.
 */
import { 
  initialAppointments, 
  initialMedications, 
  initialBills, 
  initialLabResults, 
  initialMedicalHistory,
  initialDoctors 
} from './data';

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

/**
 * Seeds localStorage with initial data if it doesn't already exist.
 * This ensures that even on first load (especially on Vercel), there's data to display.
 */
export const seedStorage = () => {
  if (typeof window === 'undefined') return;

  const SEED_KEY = 'maruthi_seed_v3';

  if (!localStorage.getItem(SEED_KEY)) {
    // Patients starts empty until someone registers
    if (!localStorage.getItem('patients')) setStorageItem('patients', []);
    
    // Initial doctors for testing
    if (!localStorage.getItem('doctors')) setStorageItem('doctors', initialDoctors);
    
    // Clinical data
    if (!localStorage.getItem('appointments')) setStorageItem('appointments', initialAppointments);
    if (!localStorage.getItem('medications')) setStorageItem('medications', initialMedications);
    if (!localStorage.getItem('bills')) setStorageItem('bills', initialBills);
    if (!localStorage.getItem('labResults')) setStorageItem('labResults', initialLabResults);
    if (!localStorage.getItem('medicalHistory')) setStorageItem('medicalHistory', initialMedicalHistory);
    
    // Notifications start empty
    if (!localStorage.getItem('notifications')) setStorageItem('notifications', []);
    
    localStorage.setItem(SEED_KEY, 'true');
  }
};
