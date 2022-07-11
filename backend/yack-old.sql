-- -------------------------------------------------------------
-- TablePlus 4.5.2(402)
--
-- https://tableplus.com/
--
-- Database: yack-old
-- Generation Time: 2022-02-25 17:31:40.2020
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."account";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS account_id_seq;

-- Table Definition
CREATE TABLE "public"."account" (
    "id" int4 NOT NULL DEFAULT nextval('account_id_seq'::regclass),
    "name" varchar NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."account_user";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS account_user_id_seq;

-- Table Definition
CREATE TABLE "public"."account_user" (
    "id" int4 NOT NULL DEFAULT nextval('account_user_id_seq'::regclass),
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "userId" int4,
    "accountId" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."comment";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS comment_id_seq;

-- Table Definition
CREATE TABLE "public"."comment" (
    "id" int4 NOT NULL DEFAULT nextval('comment_id_seq'::regclass),
    "text" text NOT NULL,
    "attachments" text,
    "html" text,
    "description" text NOT NULL,
    "unread" bool NOT NULL DEFAULT true,
    "name" varchar DEFAULT ''::character varying,
    "email" varchar DEFAULT ''::character varying,
    "messageId" varchar NOT NULL DEFAULT ''::character varying,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "postId" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."inbox";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS inbox_id_seq;

-- Table Definition
CREATE TABLE "public"."inbox" (
    "id" int4 NOT NULL DEFAULT nextval('inbox_id_seq'::regclass),
    "name" varchar NOT NULL,
    "description" text NOT NULL DEFAULT ''::text,
    "website" text NOT NULL DEFAULT ''::text,
    "image" text NOT NULL DEFAULT ''::text,
    "widget" json NOT NULL DEFAULT '{}'::json,
    "form" json NOT NULL DEFAULT '{}'::json,
    "slug" varchar NOT NULL,
    "subscription" varchar,
    "customer" varchar,
    "current_period_start" timestamp,
    "current_period_end" timestamp,
    "active" bool,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "accountId" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."label";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS label_id_seq;

-- Table Definition
CREATE TABLE "public"."label" (
    "id" int4 NOT NULL DEFAULT nextval('label_id_seq'::regclass),
    "text" varchar NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "inboxId" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."post";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS post_id_seq;
DROP TYPE IF EXISTS "public"."post_status_enum";
CREATE TYPE "public"."post_status_enum" AS ENUM ('OPEN', 'FLAGGED', 'LATER', 'CLOSED');

-- Table Definition
CREATE TABLE "public"."post" (
    "id" int4 NOT NULL DEFAULT nextval('post_id_seq'::regclass),
    "status" "public"."post_status_enum" NOT NULL DEFAULT 'OPEN'::post_status_enum,
    "title" varchar NOT NULL,
    "description" text,
    "html" text,
    "text" text,
    "attachments" text,
    "fields" text,
    "browser" text,
    "agent" text,
    "ip" varchar NOT NULL DEFAULT ''::character varying,
    "name" varchar NOT NULL DEFAULT ''::character varying,
    "email" varchar NOT NULL,
    "messageId" varchar NOT NULL DEFAULT ''::character varying,
    "latestMessageId" varchar,
    "unread" bool NOT NULL DEFAULT true,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "inboxId" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."post_label";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS post_label_id_seq;

-- Table Definition
CREATE TABLE "public"."post_label" (
    "id" int4 NOT NULL DEFAULT nextval('post_label_id_seq'::regclass),
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "postId" int4,
    "labelId" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."user";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_id_seq;

-- Table Definition
CREATE TABLE "public"."user" (
    "id" int4 NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    "name" varchar NOT NULL,
    "password" varchar NOT NULL,
    "email" varchar NOT NULL,
    "resetToken" varchar,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."account" ("id", "name", "created_at", "updated_at") VALUES
(1, 'Yack', '2022-02-25 11:39:04.773782', '2022-02-25 11:39:04.773782');

INSERT INTO "public"."account_user" ("id", "created_at", "updated_at", "userId", "accountId") VALUES
(1, '2022-02-25 11:40:51.068056', '2022-02-25 11:40:51.068056', 1, 1);

INSERT INTO "public"."inbox" ("id", "name", "description", "website", "image", "widget", "form", "slug", "subscription", "customer", "current_period_start", "current_period_end", "active", "created_at", "updated_at", "accountId") VALUES
(1, 'Hatch', '', '', '', '{}', '{}', 'hatch', NULL, NULL, NULL, NULL, NULL, '2022-02-25 11:41:02.957469', '2022-02-25 11:41:02.957469', 1);

INSERT INTO "public"."user" ("id", "name", "password", "email", "resetToken", "created_at", "updated_at") VALUES
(1, 'Johannes', '$2a$10$Wg4wZy1nsq9KOWChQ4nLr.iEHCOVRlUHL5UWxfx8Cc8FZJNuyOcF.', 'jo@joduplessis.com', NULL, '2022-02-25 11:38:29.835824', '2022-02-25 11:38:29.835824');

ALTER TABLE "public"."account_user" ADD FOREIGN KEY ("userId") REFERENCES "public"."user"("id");
ALTER TABLE "public"."account_user" ADD FOREIGN KEY ("accountId") REFERENCES "public"."account"("id");
ALTER TABLE "public"."comment" ADD FOREIGN KEY ("postId") REFERENCES "public"."post"("id");
ALTER TABLE "public"."inbox" ADD FOREIGN KEY ("accountId") REFERENCES "public"."account"("id");
ALTER TABLE "public"."label" ADD FOREIGN KEY ("inboxId") REFERENCES "public"."inbox"("id");
ALTER TABLE "public"."post" ADD FOREIGN KEY ("inboxId") REFERENCES "public"."inbox"("id");
ALTER TABLE "public"."post_label" ADD FOREIGN KEY ("postId") REFERENCES "public"."post"("id");
ALTER TABLE "public"."post_label" ADD FOREIGN KEY ("labelId") REFERENCES "public"."label"("id");
