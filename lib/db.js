import mysql from "mysql2/promise";

let pool;

export function getPool() {
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
  await pool.execute(
    "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
    [sessionId, role, content]
  );
}

export async function loadKnowledgeFallback(query) {
  const pool = getPool();
  const [rows] = await pool.execute(
    "SELECT title, content FROM knowledge_base WHERE MATCH(title, content) AGAINST (? IN NATURAL LANGUAGE MODE) LIMIT 3",
    [query]
  );
  return rows;
}

export async function loadQuestionBank(query) {
  const pool = getPool();
  const [rows] = await pool.execute(
    "SELECT question, answers FROM question_bank WHERE question LIKE ? LIMIT 3",
    [`%${query}%`]
  );
  return rows;
}
