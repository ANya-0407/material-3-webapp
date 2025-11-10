export const MAX_EMAIL_LETTERS = 254;
export const MAX_PASSWORD_LETTERS = 50;
export const MIN_PASSWORD_LETTERS = 8;

export const MAX_SEARCH_LETTERS = 50;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

export const EYES_ALLOWED_MIME = new Set<string>([
    "image/jpeg",
    "image/png",
    "image/gif",
]);
export const MAX_TAG_LETTERS = 100;
export const MAX_HASHTAG_LETTERS = 20;
export const MAX_HASHTAGS = 3;

export const MAX_EYES_COMMENT_LETTERS = 200;

export const VOICES_ALLOWED_MIME = new Set<string>([
    "image/jpeg",
    "image/png",
    "image/gif",
]);
export const MAX_VOICES_IMAGES = 4;
export const MAX_VOICES_TEXT_LETTERS = 200;

export const MESSAGE_ALLOWED_MIME = new Set<string>([
    "image/jpeg",
    "image/png",
    "image/gif",
]);
export const MAX_MESSAGE_FILES = 4;
export const MAX_MESSAGE_TEXT_LETTERS = 600;