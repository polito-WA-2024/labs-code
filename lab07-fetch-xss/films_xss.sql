BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "films" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"favorite"	INTEGER NOT NULL DEFAULT (0),
	"watchdate"	TEXT,
	"rating"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "films" VALUES (1,'Pulp Fiction',1,'2023-03-10',5);
INSERT INTO "films" VALUES (2,'21 Grams',1,'2023-03-17',4);
INSERT INTO "films" VALUES (3,'Star <b>Wars</b>',0,NULL,NULL);
INSERT INTO "films" VALUES (4,'<i>Matrix</i>',0,NULL,NULL);
INSERT INTO "films" VALUES (5,'Shrek',0,'2023-03-21',3);
INSERT INTO "films" VALUES (6,'<img src="/" onerror = "alert(''hacked xss'');">',0,'2023-04-05',1);
COMMIT;
