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

export default async function searchYouTube({ query, maxResults }: { query: string; maxResults?: number }): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=${maxResults || 100}`);
    const data = await response.json();
    console.log("YouTube API response data:", data.items);
    return data.items as YouTubeVideo[];
  }
  catch (error) {
    console.error("Error fetching YouTube data:", error);
    return [];
  }
}