export interface TrackInput {
  position: string;
  title: string;
  duration?: string;
  order: number;
}

export interface Track {
  id: string;
  recordId: number;
  position: string;
  title: string;
  duration: string | null;
  isFavourite: boolean;
  order: number;
}

export interface Record {
  id: number;
  artist: string;
  album: string;
  year: number | null;
  genre: string | null;
  artworkUrl: string | null;
  starRating: number;
  cost: number | null;
  notes: string | null;
  createdAt: string;
  tracks?: Track[];
}

export interface WishlistItem {
  id: number;
  artist: string;
  album: string;
  year: number | null;
  genre: string | null;
  artworkUrl: string | null;
  starRating: number;
  targetPrice: number | null;
  notes: string | null;
  tracklist: TrackInput[] | null;
  createdAt: string;
}
