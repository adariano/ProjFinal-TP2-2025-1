-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShoppingList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "estimatedTotal" REAL,
    "actualTotal" REAL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBy" INTEGER,
    "reviewedAt" DATETIME,
    CONSTRAINT "ShoppingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShoppingList_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ShoppingList" ("actualTotal", "createdAt", "estimatedTotal", "id", "name", "status", "userId") SELECT "actualTotal", "createdAt", "estimatedTotal", "id", "name", "status", "userId" FROM "ShoppingList";
DROP TABLE "ShoppingList";
ALTER TABLE "new_ShoppingList" RENAME TO "ShoppingList";
CREATE TABLE "new_ShoppingListItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "collected" BOOLEAN NOT NULL DEFAULT false,
    "productId" INTEGER NOT NULL,
    "shoppingListId" INTEGER NOT NULL,
    "collectedBy" INTEGER,
    "collectedAt" DATETIME,
    CONSTRAINT "ShoppingListItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShoppingListItem_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "ShoppingList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShoppingListItem_collectedBy_fkey" FOREIGN KEY ("collectedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ShoppingListItem" ("collected", "id", "productId", "quantity", "shoppingListId") SELECT "collected", "id", "productId", "quantity", "shoppingListId" FROM "ShoppingListItem";
DROP TABLE "ShoppingListItem";
ALTER TABLE "new_ShoppingListItem" RENAME TO "ShoppingListItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
