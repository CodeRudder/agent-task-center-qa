const mysql = require('mysql2/promise');

async function checkTestUser() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'agent_task_center'
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['test@test.com']);
    console.log('Test user query result:', JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTestUser();
