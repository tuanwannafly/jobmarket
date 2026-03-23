CREATE TABLE IF NOT EXISTS permission_role (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS subscriber_skill (
    subscriber_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (subscriber_id, skill_id)
);
