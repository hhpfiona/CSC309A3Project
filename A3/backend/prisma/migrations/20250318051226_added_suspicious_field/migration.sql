-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utorid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "spent" REAL NOT NULL DEFAULT 0,
    "amount" REAL NOT NULL DEFAULT 0,
    "relatedId" INTEGER NOT NULL DEFAULT 0,
    "remark" TEXT NOT NULL DEFAULT '',
    "createBy" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "suspicious" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "createBy", "customerId", "id", "relatedId", "remark", "spent", "type", "utorid") SELECT "amount", "createBy", "customerId", "id", "relatedId", "remark", "spent", "type", "utorid" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
