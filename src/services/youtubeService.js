import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Search YouTube for karaoke videos.
 * @param {string} query – search term
 * @param {number} maxResults – results per page (default 10)
 * @returns {Promise<Array<{id: string, title: string, thumbnail: string, channelTitle: string}>>}
 */
export async function searchVideos(query, maxResults = 10) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        part: 'snippet',
        q: `${query} karaoke`,
        type: 'video',
        maxResults,
        key: API_KEY,
        videoCategoryId: '10', // Music category
      },
    });

    return response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}
