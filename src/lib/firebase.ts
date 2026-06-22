import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, writeBatch, Firestore } from 'firebase/firestore';

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  isTrending?: boolean;
  createdAt?: number;
}

const config = {
  apiKey: "AIzaSyBb7pYsGVlM8Gam5XKmVQKvmRsAIdOpiL8",
  authDomain: "fundamental-theory-ckpr3.firebaseapp.com",
  projectId: "fundamental-theory-ckpr3",
  storageBucket: "fundamental-theory-ckpr3.firebasestorage.app",
  messagingSenderId: "711835099305",
  appId: "1:711835099305:web:dec131c974a8c6a6fd89b8"
};

let dbInstance: Firestore | null = null;

/**
 * Safely initializes Firebase App and Firestore lazily to prevent module load-time crashes.
 */
export function getDB(): Firestore | null {
  try {
    if (!config.apiKey) {
      console.warn("Firebase configuration is missingapiKey.");
      return null;
    }
    if (!dbInstance) {
      const app = getApps().length === 0 ? initializeApp(config) : getApp();
      dbInstance = getFirestore(app, "ai-studio-77a31152-6ab3-4b44-a9dc-0146084ed0d2");
    }
    return dbInstance;
  } catch (error) {
    console.error("Firebase/Firestore lazy initialization failed:", error);
    return null;
  }
}

/**
 * Fetches gallery items from Firestore. 
 * If Firestore database collection is empty, seeds the default items.
 */
export async function fetchGalleryItemsFromDB(defaultItems: GalleryItem[]): Promise<GalleryItem[]> {
  try {
    const db = getDB();
    if (!db) {
      return defaultItems;
    }
    const colRef = collection(db, 'gallery');
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      console.log('No gallery items found in Firestore, seeding default items...');
      const items: GalleryItem[] = [];
      const batch = writeBatch(db);
      
      defaultItems.forEach((item, index) => {
        const itemWithTime = {
          ...item,
          createdAt: Date.now() - index * 1000 // preserve original rendering order
        };
        const docRef = doc(db, 'gallery', item.id);
        batch.set(docRef, itemWithTime);
        items.push(itemWithTime);
      });
      
      await batch.commit();
      return items;
    }
    
    const items: GalleryItem[] = [];
    snapshot.forEach(docSnap => {
      items.push(docSnap.data() as GalleryItem);
    });
    
    // Sort so newly added items show up first
    return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error("Error fetching gallery items from Firestore:", error);
    return defaultItems;
  }
}

/**
 * Adds or updates a gallery item in Firestore
 */
export async function addGalleryItemToDB(item: GalleryItem): Promise<void> {
  try {
    const db = getDB();
    if (!db) return;
    const docRef = doc(db, 'gallery', item.id);
    await setDoc(docRef, {
      ...item,
      createdAt: item.createdAt || Date.now()
    });
  } catch (error) {
    console.error("Error writing gallery item to Firestore:", error);
  }
}

/**
 * Deletes a gallery item from Firestore
 */
export async function deleteGalleryItemFromDB(id: string): Promise<void> {
  try {
    const db = getDB();
    if (!db) return;
    const docRef = doc(db, 'gallery', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting gallery item from Firestore:", error);
  }
}

/**
 * Fetches the custom admin password from Firestore settings.
 * Defaults to 'admin' if not custom-configured yet.
 */
export async function fetchAdminPasswordFromDB(): Promise<string> {
  try {
    const db = getDB();
    if (!db) return 'admin';
    const docRef = doc(db, 'settings', 'admin');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().password || 'admin';
    }
  } catch (error) {
    console.error("Error loading admin password from Firestore settings:", error);
  }
  return 'admin';
}

/**
 * Saves a new admin password in Firestore
 */
export async function saveAdminPasswordToDB(password: string): Promise<void> {
  try {
    const db = getDB();
    if (!db) return;
    const docRef = doc(db, 'settings', 'admin');
    await setDoc(docRef, { password }, { merge: true });
  } catch (error) {
    console.error("Error updating admin password in Firestore settings:", error);
  }
}

/**
 * Fetches the custom stop prices map from Firestore settings
 */
export async function fetchCustomPricesFromDB(): Promise<Record<string, { ticketPrice?: number; mealPrice?: number; transportPrice?: number; otherPrice?: number }>> {
  try {
    const db = getDB();
    if (!db) return {};
    const docRef = doc(db, 'settings', 'pricing');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.customPrices) {
        return JSON.parse(data.customPrices);
      }
    }
  } catch (error) {
    console.error("Error loading custom prices from Firestore settings:", error);
  }
  return {};
}

/**
 * Saves the customized pricing map in Firestore
 */
export async function saveCustomPricesToDB(customPrices: Record<string, { ticketPrice?: number; mealPrice?: number; transportPrice?: number; otherPrice?: number }>): Promise<void> {
  try {
    const db = getDB();
    if (!db) return;
    const docRef = doc(db, 'settings', 'pricing');
    await setDoc(docRef, { customPrices: JSON.stringify(customPrices) }, { merge: true });
  } catch (error) {
    console.error("Error saving custom prices to Firestore settings:", error);
  }
}

/**
 * Compresses a Data URL image to ensure it stays below the 1MB Firestore limit.
 * It resizes the image down to standard bounds and uses high-compression JPEG formats.
 */
export function compressImage(dataUrl: string, maxDim: number = 800, quality: number = 0.6): Promise<string> {
  return new Promise((resolve) => {
    // If it is not a data URL sequence, just bypass compression
    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      } catch (err) {
        console.error("Canvas compression failed, returning original document", err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

