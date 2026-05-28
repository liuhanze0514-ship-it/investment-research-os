PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "source" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "thesis" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "risk" TEXT,
  "nextStep" TEXT NOT NULL DEFAULT 'Review opportunity',
  "priority" INTEGER NOT NULL DEFAULT 2,
  "probability" INTEGER NOT NULL DEFAULT 25,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "expectedCheck" INTEGER,
  "targetOwnership" REAL,
  "companyId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Project" (
  "id",
  "slug",
  "name",
  "status",
  "source",
  "owner",
  "thesis",
  "summary",
  "nextStep",
  "priority",
  "probability",
  "progress",
  "expectedCheck",
  "targetOwnership",
  "companyId",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  lower(replace(replace(replace("name", ' ', '-'), '.', ''), '/', '-')),
  "name",
  "status",
  "source",
  "owner",
  "thesis",
  "summary",
  'Review opportunity',
  "priority",
  25,
  0,
  "expectedCheck",
  "targetOwnership",
  "companyId",
  "createdAt",
  "updatedAt"
FROM "Project";

DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

PRAGMA foreign_keys=ON;
