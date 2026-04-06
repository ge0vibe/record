-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT,
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Track_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER,
    "genre" TEXT,
    "artworkUrl" TEXT,
    "starRating" INTEGER NOT NULL DEFAULT 3,
    "cost" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Record" ("album", "artist", "artworkUrl", "cost", "createdAt", "genre", "id", "notes", "starRating", "year") SELECT "album", "artist", "artworkUrl", "cost", "createdAt", "genre", "id", "notes", "starRating", "year" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
