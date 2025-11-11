--User
CREATE TABLE users (
  id               UUID PRIMARY KEY,
  email            VARCHAR(254)  NOT NULL,
  phone_e164       VARCHAR(32)   NOT NULL,
  password_hash    VARCHAR(100)  NOT NULL,
  birthdate        DATE          NULL,
  status           VARCHAR(16)   NOT NULL DEFAULT 'ACTIVE', -- ACTIVE/LOCKED/DELETED
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  CONSTRAINT ck_users_status CHECK (status IN ('ACTIVE','LOCKED','DELETED'))
);

CREATE UNIQUE INDEX uk_users_email ON users (email);
CREATE UNIQUE INDEX uk_users_phone ON users (phone_e164);

--Persona
CREATE TABLE personas (
  id                    UUID PRIMARY KEY,
  user_id               UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                  VARCHAR(16)  NOT NULL,  -- 'EYES' or 'VOICES'
  persona_id            VARCHAR(30)  NOT NULL,  -- 公開ハンドル
  persona_id_norm       VARCHAR(30)  NOT NULL,  -- 大文字非区別ユニーク用
  persona_name          VARCHAR(50)  NULL,
  icon_url              TEXT         NULL,
  header_url            TEXT         NULL,
  bio                   VARCHAR(1000) NULL,
  birthdate_visibility  VARCHAR(16)  NOT NULL DEFAULT 'NONE',  -- NONE/MONTH_DAY/FULL_DATE
  active                BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT ck_personas_type CHECK (type IN ('EYES','VOICES')),
  CONSTRAINT ck_personas_birthdate_visibility CHECK (birthdate_visibility IN ('NONE','MONTH_DAY','FULL_DATE'))
);

-- 各ユーザーは type ごとに高々1件（= EYES 1, VOICES 1）
CREATE UNIQUE INDEX uk_personas_user_type ON personas (user_id, type);

-- type 内で persona_id（大文字非区別）一意
CREATE UNIQUE INDEX uk_personas_type_handle ON personas (type, persona_id_norm);


-- Eyes posts
CREATE TABLE eyes_posts (
  id               UUID PRIMARY KEY,
  owner_persona_id UUID         NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  image_url        TEXT         NOT NULL,
  tag              VARCHAR(50)  NULL,
  hashtag          VARCHAR(100) NULL,
  view_count       BIGINT       NOT NULL DEFAULT 0,
  good_count       BIGINT       NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_eyes_posts_owner_created ON eyes_posts(owner_persona_id, created_at);
CREATE INDEX idx_eyes_posts_created ON eyes_posts(created_at);
CREATE INDEX idx_eyes_posts_good_count ON eyes_posts(good_count);

-- Eyes friends (順序保持)
CREATE TABLE eyes_post_friend_links (
  post_id        UUID        NOT NULL REFERENCES eyes_posts(id) ON DELETE CASCADE,
  ordinal        SMALLINT    NOT NULL,
  friend_post_id UUID        NOT NULL REFERENCES eyes_posts(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, ordinal),
  CONSTRAINT uk_eyes_friend_unique UNIQUE (post_id, friend_post_id),
  CONSTRAINT ck_eyes_friend_ordinal CHECK (ordinal BETWEEN 0 AND 49)
);

-- Voices posts
CREATE TABLE voices_posts (
  id               UUID PRIMARY KEY,
  owner_persona_id UUID         NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  text             TEXT         NULL,
  hashtag          VARCHAR(100) NULL,
  view_count       BIGINT       NOT NULL DEFAULT 0,
  good_count       BIGINT       NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_voices_posts_owner_created ON voices_posts(owner_persona_id, created_at);
CREATE INDEX idx_voices_posts_created ON voices_posts(created_at);
CREATE INDEX idx_voices_posts_good_count ON voices_posts(good_count);

-- Voices images (最大4、順序保持)
CREATE TABLE voices_post_images (
  post_id  UUID      NOT NULL REFERENCES voices_posts(id) ON DELETE CASCADE,
  ordinal  SMALLINT  NOT NULL,
  url      TEXT      NOT NULL,
  PRIMARY KEY (post_id, ordinal),
  CONSTRAINT ck_voices_image_ordinal CHECK (ordinal BETWEEN 0 AND 3)
);

-- Likes / Bookmarks を type ごとに分割して FK を厳密化
CREATE TABLE eyes_post_likes (
  post_id        UUID     NOT NULL REFERENCES eyes_posts(id) ON DELETE CASCADE,
  by_persona_id  UUID     NOT NULL REFERENCES personas(id)  ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, by_persona_id)
);

CREATE TABLE eyes_post_bookmarks (
  post_id        UUID     NOT NULL REFERENCES eyes_posts(id) ON DELETE CASCADE,
  by_persona_id  UUID     NOT NULL REFERENCES personas(id)  ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, by_persona_id)
);

CREATE TABLE voices_post_likes (
  post_id        UUID     NOT NULL REFERENCES voices_posts(id) ON DELETE CASCADE,
  by_persona_id  UUID     NOT NULL REFERENCES personas(id)    ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, by_persona_id)
);

CREATE TABLE voices_post_bookmarks (
  post_id        UUID     NOT NULL REFERENCES voices_posts(id) ON DELETE CASCADE,
  by_persona_id  UUID     NOT NULL REFERENCES personas(id)     ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, by_persona_id)
);

-- Eyes follows
CREATE TABLE eyes_follows (
  follower_persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  followee_persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_eyes_follows PRIMARY KEY (follower_persona_id, followee_persona_id),
  CONSTRAINT ck_eyes_follow_self CHECK (follower_persona_id <> followee_persona_id)
);
CREATE INDEX idx_eyes_follow_followee ON eyes_follows(followee_persona_id);
CREATE INDEX idx_eyes_follow_follower ON eyes_follows(follower_persona_id);

-- Eyes blocks
CREATE TABLE eyes_blocks (
  blocker_persona_id  UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  blocked_persona_id  UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_eyes_blocks PRIMARY KEY (blocker_persona_id, blocked_persona_id),
  CONSTRAINT ck_eyes_block_self CHECK (blocker_persona_id <> blocked_persona_id)
);
CREATE INDEX idx_eyes_block_blocked ON eyes_blocks(blocked_persona_id);
CREATE INDEX idx_eyes_block_blocker ON eyes_blocks(blocker_persona_id);

-- Voices follows
CREATE TABLE voices_follows (
  follower_persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  followee_persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_voices_follows PRIMARY KEY (follower_persona_id, followee_persona_id),
  CONSTRAINT ck_voices_follow_self CHECK (follower_persona_id <> followee_persona_id)
);
CREATE INDEX idx_voices_follow_followee ON voices_follows(followee_persona_id);
CREATE INDEX idx_voices_follow_follower ON voices_follows(follower_persona_id);

-- Voices blocks
CREATE TABLE voices_blocks (
  blocker_persona_id  UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  blocked_persona_id  UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_voices_blocks PRIMARY KEY (blocker_persona_id, blocked_persona_id),
  CONSTRAINT ck_voices_block_self CHECK (blocker_persona_id <> blocked_persona_id)
);
CREATE INDEX idx_voices_block_blocked ON voices_blocks(blocked_persona_id);
CREATE INDEX idx_voices_block_blocker ON voices_blocks(blocker_persona_id);