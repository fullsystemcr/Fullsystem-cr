// IndexedDB helper for robust storage and retrieval of local video and large media assets
// Bypasses the 5MB quota limit of browser localStorage

const DB_NAME = "FullSystemMediaDB";
const DB_VERSION = 1;
const STORE_NAME = "mediaStore";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB no soportado en este entorno"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getMediaBlob(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function deleteMediaBlob(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore error
  }
}

// Download helper for saving video file locally to user's PC
export async function triggerVideoDownload(videoUrl: string, defaultFilename: string = "video_demostrativo_full_system.mp4"): Promise<void> {
  try {
    if (!videoUrl) {
      alert("No hay ningún video configurado actualmente para descargar.");
      return;
    }

    // Check if it is a blob or data url
    if (videoUrl.startsWith("blob:") || videoUrl.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = defaultFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // If it's a direct web URL (e.g. mp4)
    if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) {
      // If it's YouTube or Vimeo, explain or open
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") || videoUrl.includes("vimeo.com")) {
        window.open(videoUrl, "_blank");
        return;
      }

      // Try fetching as blob to trigger direct download
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = defaultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return;
      } catch {
        // Fallback: open in new window or standard download link
        const a = document.createElement("a");
        a.href = videoUrl;
        a.download = defaultFilename;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  } catch (err) {
    console.error("Error al descargar video:", err);
    window.open(videoUrl, "_blank");
  }
}
