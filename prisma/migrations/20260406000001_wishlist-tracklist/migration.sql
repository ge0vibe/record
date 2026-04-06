-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER,
    "genre" TEXT,
    "artworkUrl" TEXT,
    "starRating" INTEGER NOT NULL DEFAULT 3,
    "targetPrice" REAL,
    "notes" TEXT,
    "tracklist" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WishlistItem" ("album", "artist", "artworkUrl", "createdAt", "genre", "id", "notes", "starRating", "targetPrice", "year") SELECT "album", "artist", "artworkUrl", "createdAt", "genre", "id", "notes", "starRating", "targetPrice", "year" FROM "WishlistItem";
DROP TABLE "WishlistItem";
ALTER TABLE "new_WishlistItem" RENAME TO "WishlistItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
