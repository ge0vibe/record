-- CreateTable
CREATE TABLE "WatchedRelease" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mbid" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchedRelease_mbid_key" ON "WatchedRelease"("mbid");
