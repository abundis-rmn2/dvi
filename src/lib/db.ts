import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'public', 'data', 'app_data.db');
const tasksJsonPath = path.join(process.cwd(), 'public', 'data', 'tasks.json');

export function isDbAvailable(): boolean {
  return fs.existsSync(dbPath);
}

export function getDb() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database file not found at ${dbPath}`);
  }
  return new Database(dbPath, { readonly: true });
}

export function getStaticTasks() {
  if (!fs.existsSync(tasksJsonPath)) {
    return [];
  }
  const fileData = fs.readFileSync(tasksJsonPath, 'utf-8');
  return JSON.parse(fileData);
}

