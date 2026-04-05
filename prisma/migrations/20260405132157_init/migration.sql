-- CreateTable
CREATE TABLE "Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER,
    "genre" TEXT,
    "artworkUrl" TEXT,
    "starRating" INTEGER NOT NULL DEFAULT 3,
    "favouriteTrack" TEXT,
    "cost" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER,
    "genre" TEXT,
    "artworkUrl" TEXT,
    "starRating" INTEGER NOT NULL DEFAULT 3,
    "favouriteTrack" TEXT,
    "targetPrice" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
