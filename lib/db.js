import mysql from "mysql2/promise";

let pool;

// Check if MySQL is configured
function isMySQLConfigured() {
  return !!(
    process.env.MYSQL_HOST &&
    process.env.MYSQL_HOST !== "localhost" &&
    process.env.MYSQL_USER &&
    process.env.MYSQL_PASSWORD &&
    process.env.MYSQL_DATABASE
  );
}

export function getPool() {
  if (!isMySQLConfigured()) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function saveMessage({ sessionId, role, content }) {
  const pool = getPool();
  if (!pool) {
    // Skip saving in production without DB
    console.log(`[No DB] Message not saved: ${role}: ${content.substring(0, 50)}...`);
    return;
  }

  try {
    await pool.execute(
      "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
      [sessionId, role, content]
    );
  } catch (error) {
    console.error("Failed to save message:", error.message);
  }
}

export async function loadKnowledgeFallback(query) {
  const pool = getPool();
  if (!pool) {
    return [];
  }

  try {
    const [rows] = await pool.execute(
      "SELECT title, content FROM knowledge_base WHERE MATCH(title, content) AGAINST (? IN NATURAL LANGUAGE MODE) LIMIT 3",
      [query]
    );
    return rows;
  } catch (error) {
    console.error("Failed to load knowledge fallback:", error.message);
    return [];
  }
}

export async function loadQuestionBank(query) {
  const pool = getPool();
  if (!pool) {
    return [];
  }

  try {
    const [rows] = await pool.execute(
      "SELECT question, answers FROM question_bank WHERE question LIKE ? LIMIT 3",
      [`%${query}%`]
    );
    return rows;
  } catch (error) {
    console.error("Failed to load question bank:", error.message);
    return [];
  }
}
