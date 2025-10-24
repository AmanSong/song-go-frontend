export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
  };
}

export default async function searchYouTube({query, maxResults}: { query: string; maxResults?: number }): Promise<YouTubeVideo[]> {
    const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
    const BASE_URL = "https://www.googleapis.com/youtube/v3";

    try {
        const response = await fetch(
            `${BASE_URL}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
                query
            )}&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();

        if (data.error) {
            console.log(YOUTUBE_API_KEY);
            console.log(query);
            console.error("YouTube API error:", data.error);
            return [];
        }
        return data.items;

    } catch (error) {
        console.error("Failed to fetch from YouTube API:", error);
        return [];
    }
}