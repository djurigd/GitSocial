CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT,

    github_id VARCHAR(255) UNIQUE,
    github_username VARCHAR(255),

    avatar_url TEXT,
    bio TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    visibility VARCHAR(20) DEFAULT 'public',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE files (
    id SERIAL PRIMARY KEY,

    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

    filename VARCHAR(255) NOT NULL,

    language VARCHAR(50),

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,

    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,

    name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,

    PRIMARY KEY(post_id, tag_id)
);