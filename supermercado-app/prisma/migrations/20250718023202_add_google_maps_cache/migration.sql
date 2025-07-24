-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Market" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "distance" REAL NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "phone" TEXT,
    "hours" TEXT,
    "googleMapsUrl" TEXT,
    "priceLevel" TEXT,
    "categories" TEXT,
    "description" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "placeId" TEXT,
    "photoUrl" TEXT,
    "website" TEXT,
    "businessStatus" TEXT,
    "types" TEXT,
    "vicinity" TEXT,
    "lastMapUpdate" DATETIME,
    "mapUpdateFreq" INTEGER NOT NULL DEFAULT 86400,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Market" ("address", "categories", "createdAt", "description", "distance", "googleMapsUrl", "hours", "id", "latitude", "longitude", "name", "phone", "priceLevel", "rating", "updatedAt") SELECT "address", "categories", "createdAt", "description", "distance", "googleMapsUrl", "hours", "id", "latitude", "longitude", "name", "phone", "priceLevel", "rating", "updatedAt" FROM "Market";
DROP TABLE "Market";
ALTER TABLE "new_Market" RENAME TO "Market";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
