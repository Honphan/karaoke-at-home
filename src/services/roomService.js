import { db } from '../config/firebase';
import {
  ref,
  set,
  push,
  get,
  update,
  remove,
  onValue,
  off,
} from 'firebase/database';

/**
 * Generate a random 6-character room ID.
 */
function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a new room in Firebase.
 * @returns {Promise<string>} – the room ID
 */
export async function createRoom() {
  const roomId = generateRoomId();
  const roomRef = ref(db, `rooms/${roomId}`);
  await set(roomRef, {
    currentVideo: null,
    queue: [],
    createdAt: Date.now(),
  });
  return roomId;
}

/**
 * Check if a room exists.
 * @param {string} roomId
 * @returns {Promise<boolean>}
 */
export async function roomExists(roomId) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  return snapshot.exists();
}

/**
 * Delete a room from Firebase.
 * @param {string} roomId
 */
export async function deleteRoom(roomId) {
  const roomRef = ref(db, `rooms/${roomId}`);
  await remove(roomRef);
}

/**
 * Add a song to the room queue.
 * @param {string} roomId
 * @param {{id: string, title: string, thumbnail: string, user: string}} song
 */
export async function addToQueue(roomId, song) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  const queue = data.queue || [];
  queue.push({
    ...song,
    addedAt: Date.now(),
  });

  await update(roomRef, { queue });

  // If nothing is playing, auto-set the first song
  if (!data.currentVideo) {
    await nextSong(roomId);
  }
}

/**
 * Remove a song from the queue at a given index.
 */
export async function removeFromQueue(roomId, songIndex) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  const queue = data.queue || [];
  queue.splice(songIndex, 1);

  await update(roomRef, { queue });
}

/**
 * Move a song to the top of the queue (priority).
 */
export async function prioritizeSong(roomId, songIndex) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  const queue = data.queue || [];
  if (songIndex <= 0 || songIndex >= queue.length) return;

  const [song] = queue.splice(songIndex, 1);
  queue.unshift(song);

  await update(roomRef, { queue });
}

/**
 * Set the currently playing video.
 */
export async function setCurrentVideo(roomId, video) {
  const roomRef = ref(db, `rooms/${roomId}`);
  await update(roomRef, {
    currentVideo: video
      ? { id: video.id, title: video.title, thumbnail: video.thumbnail, status: 'playing' }
      : null,
  });
}

/**
 * Move to the next song in the queue.
 */
export async function nextSong(roomId) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  const queue = data.queue || [];

  if (queue.length === 0) {
    await update(roomRef, { currentVideo: null });
    return;
  }

  const next = queue.shift();
  await update(roomRef, {
    currentVideo: { id: next.id, title: next.title, thumbnail: next.thumbnail, status: 'playing' },
    queue,
  });
}

/**
 * Listen for real-time room changes.
 * @param {string} roomId
 * @param {(data: object) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onRoomChange(roomId, callback) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const handler = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  return () => off(roomRef, 'value', handler);
}
