/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message VARCHAR(200) NOT NULL,
        admin BOOLEAN DEFAULT false,
        userId BIGINT REFERENCES users(id),
        read BOOLEAN DEFAULT false
    )
    `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE messages
    `);
};
