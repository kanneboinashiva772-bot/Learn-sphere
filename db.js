const Database=require("better-sqlite3");
const fs=require("fs");
const path=require("path");

const dataDir=path.join(__dirname,"data");
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir,{recursive:true});

const db=new Database(path.join(dataDir,"learnsphere.db"));
db.pragma("foreign_keys=ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('student','instructor')),
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS courses(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 instructor_id INTEGER NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(instructor_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS enrollments(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 student_id INTEGER NOT NULL,
 course_id INTEGER NOT NULL,
 UNIQUE(student_id,course_id),
 FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS resources(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 course_id INTEGER NOT NULL,
 title TEXT NOT NULL,
 url TEXT NOT NULL,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS quizzes(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 course_id INTEGER NOT NULL,
 question TEXT NOT NULL,
 option_a TEXT NOT NULL,
 option_b TEXT NOT NULL,
 option_c TEXT NOT NULL,
 option_d TEXT NOT NULL,
 answer TEXT NOT NULL CHECK(answer IN ('A','B','C','D')),
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS results(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 student_id INTEGER NOT NULL,
 course_id INTEGER NOT NULL,
 score INTEGER NOT NULL,
 total INTEGER NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);
`);
module.exports=db;
