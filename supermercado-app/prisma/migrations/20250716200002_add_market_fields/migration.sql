-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Market" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "distance" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "phone" TEXT,
    "hours" TEXT,
    "googleMapsUrl" TEXT,
    "priceLevel" TEXT,
    "categories" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Market" ("address", "distance", "id", "name", "rating") SELECT "address", "distance", "id", "name", "rating" FROM "Market";
DROP TABLE "Market";
ALTER TABLE "new_Market" RENAME TO "Market";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
