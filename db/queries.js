import pool from "./pool.js";

// Post Queries
export const getAllPosts = async () => {
  return await pool.query(`SELECT 
            p.id,
        p.title,
        p.content,
        p.view_count,
        p.created_at,
        p.updated_at,
        json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
        ) as author,
        json_build_object(
            'id', c.id,
            'name', c.category_name
        ) as category
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC`);
};

export const getPostById = async (id) => {
    return await pool.query(`
        SELECT 
            p.id,
            p.title,
            p.content,
            p.view_count,
            p.created_at,
            p.updated_at,
            json_build_object(
                'id', u.id,
                'name', u.name,
                'email', u.email
            ) as author,
            json_build_object(
                'id', c.id,
                'name', c.category_name
            ) as category
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
    `, [id]);
}

export const createPostQuery = async (title, content, category_id, user_id = 1) => {
  return await pool.query(
    "INSERT INTO posts (title, content, category_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, title, content, category_id, user_id",
    [title, content, category_id, user_id]
  );
};

export const deletePostQuery = async (id) => {
    return await pool.query(
        "DELETE FROM posts WHERE id = $1 RETURNING id",
        [id]
    );
};

export const updatePostQuery = async (id, title, content, category_id) => {
    return await pool.query(
        "UPDATE posts SET title = $1, content = $2, category_id = $3, updated_at = NOW() WHERE id = $4 RETURNING id, title, content, category_id",
        [title, content, category_id, id]
    );
};

// User Queries
export const createUser = async (name, email, password) => {
  return await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at",
    [name, email, password, "admin"],
  );
};

export const getUserByEmail = async (email) => {
  return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
};