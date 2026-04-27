use rusqlite::{Connection, Result};
use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
}

#[tauri::command]
pub async fn list_tasks() -> Result<Vec<Task>, String> {
    let conn = Connection::open("mind-boop-local.db").map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, title, description FROM tasks")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<Task>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

#[tauri::command]
pub async fn create_task(title: String) -> Result<String, String> {
    let conn = Connection::open("mind-boop-local.db").unwrap();
    let id = Uuid::new_v4().to_string();

    let result = conn.execute(
        "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
        (id.clone(), title),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok(id)
}

#[tauri::command]
pub async fn show_task(id: String) -> Result<Task, String> {
    let conn = Connection::open("mind-boop-local.db").map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, title, description FROM tasks WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    stmt.query_row([id], |row| {
        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
        })
    })
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_task(id: String, title: String, description: String) -> Result<String, String> {
    let conn = Connection::open("mind-boop-local.db").unwrap();
    let result = conn.execute(
        "UPDATE tasks SET title = ?1, description = ?2, updated_at = datetime('now') WHERE id = ?3",
        (title, description, id),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok(result.unwrap().to_string())
}
