export interface Record {
  id: number;
  artist: string;
  album: string;
  year: number | null;
  genre: string | null;
  artworkUrl: string | null;
  starRating: number;
  favouriteTrack: string | null;
  cost: number | null;
  notes: string | null;
  createdAt: string;
}

export interface WishlistItem {
  id: number;
  artist: string;
  album: string;
  year: number | null;
  genre: string | null;
  artworkUrl: string | null;
  starRating: number;
  favouriteTrack: string | null;
  targetPrice: number | null;
  notes: string | null;
  createdAt: string;
}
