import { db } from '../config/firebase';
import { ref, get, set } from 'firebase/database';

/**
 * Normalize a username to a safe Firebase key.
 * Replaces characters not allowed in Firebase keys (. # $ [ ] /) with underscores.
 * @param {string} userName
 * @returns {string}
 */
function normalizeKey(userName) {
  return userName
    .trim()
    .toLowerCase()
    .replace(/[.#$\[\]\/]/g, '_');
}

/**
 * Get the favorites list for a user.
 * @param {string} userName
 * @returns {Promise<Array<{id: string, title: string, thumbnail: string, channelTitle?: string}>>}
 */
export async function getFavorites(userName) {
  if (!userName) return [];
  const favRef = ref(db, `favorites/${normalizeKey(userName)}`);
  const snapshot = await get(favRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return data.songs || [];
}

/**
 * Add a song to the user's favorites.
 * Prevents duplicates by checking song ID.
 * @param {string} userName
 * @param {{id: string, title: string, thumbnail: string, channelTitle?: string}} song
 * @returns {Promise<boolean>} true if added, false if already exists
 */
export async function addFavorite(userName, song) {
  if (!userName) return false;
  const key = normalizeKey(userName);
  const favRef = ref(db, `favorites/${key}`);
  const snapshot = await get(favRef);

  let songs = [];
  if (snapshot.exists()) {
    songs = snapshot.val().songs || [];
  }

  // Check for duplicate
  if (songs.some((s) => s.id === song.id)) {
    return false;
  }

  songs.push({
    id: song.id,
    title: song.title,
    thumbnail: song.thumbnail,
    channelTitle: song.channelTitle || '',
    addedAt: Date.now(),
  });

  await set(favRef, {
    userName: userName.trim(),
    songs,
    updatedAt: Date.now(),
  });

  return true;
}

/**
 * Remove a song from the user's favorites by song ID.
 * @param {string} userName
 * @param {string} songId
 */
export async function removeFavorite(userName, songId) {
  if (!userName) return;
  const key = normalizeKey(userName);
  const favRef = ref(db, `favorites/${key}`);
  const snapshot = await get(favRef);
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  const songs = (data.songs || []).filter((s) => s.id !== songId);

  await set(favRef, {
    userName: data.userName,
    songs,
    updatedAt: Date.now(),
  });
}
