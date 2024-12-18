CREATE TABLE settings (
    name character varying NOT NULL UNIQUE,
    value character varying NOT NULL
);

CREATE TABLE users (
    id serial NOT NULL,
    username character varying NOT NULL UNIQUE,
    email character varying NOT NULL UNIQUE,
    password character varying NOT NULL,
    access integer NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE categories (
    id serial NOT NULL,
    name character varying NOT NULL UNIQUE,
    color character varying(6) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE threads (
    id serial NOT NULL,
    user_id integer NOT NULL,
    title character varying NOT NULL,
    post_count integer NOT NULL DEFAULT 0,
    category_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE posts (
    id serial NOT NULL,
    user_id integer NOT NULL,
    thread_id integer NOT NULL,
    post_number integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (thread_id) REFERENCES threads (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE follows (
    id serial NOT NULL,
    user_id integer NOT NULL,
    thread_id integer NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (thread_id) REFERENCES threads (id),
    UNIQUE (user_id, thread_id)
);

INSERT INTO settings (name, value) VALUES ('siteName', 'Symposium');
INSERT INTO settings (name, value) VALUES ('isInitialized', 'false');

