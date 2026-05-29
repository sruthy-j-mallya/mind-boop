use serde::Serialize;
use rusqlite::Connection;
use uuid::Uuid;

#[derive(Debug)]
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub estimated_minutes: Option<u16>,
    pub is_duration: bool,
    pub is_all_day: bool,
    pub is_completed: bool,
    pub starts_on: Option<String>,
    pub starts_at: Option<String>,
    pub ends_on: Option<String>,
    pub ends_at: Option<String>,
}

pub fn list_db_tasks(search_string: &str, connection: &Connection,) -> Result<Vec<Task>, String> {
  let pattern = format!("%{}%", search_string);
    let mut stmt = connection
        .prepare("SELECT id, title, description, estimated_minutes, is_duration, is_all_day, is_completed, starts_on, starts_at, ends_on, ends_at FROM tasks WHERE is_completed = 0 AND (title LIKE ?1 OR description LIKE ?1) ORDER BY COALESCE(starts_on, '01-01-3000') DESC, COALESCE(starts_at, '23:59') ASC")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&pattern], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                estimated_minutes: row.get(3)?,
                is_duration: row.get::<_, i32>(4)? != 0,
                is_all_day: row.get::<_, i32>(5)? != 0,
                is_completed: row.get::<_, i32>(6)? != 0,
                starts_on: row.get(7)?,
                starts_at: row.get(8)?,
                ends_on: row.get(9)?,
                ends_at: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<Task>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn create_db_task(title: String, connection: &Connection) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();

    connection.execute(
        "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
        (id.clone(), title),
    ).map_err(|e| e.to_string())?;

    Ok(id)
}

pub fn show_db_task(id: String, connection: &Connection) -> Result<Task, String> {
    let mut stmt = connection
        .prepare("SELECT id, title, description, estimated_minutes, is_duration, is_all_day, is_completed, starts_on, starts_at, ends_on, ends_at FROM tasks WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    stmt.query_row([id], |row| {
        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            estimated_minutes: row.get(3)?,
            is_duration: row.get::<_, i32>(4)? != 0,
            is_all_day: row.get::<_, i32>(5)? != 0,
            is_completed: row.get::<_, i32>(6)? != 0,
            starts_on: row.get(7)?,
            starts_at: row.get(8)?,
            ends_on: row.get(9)?,
            ends_at: row.get(10)?,
        })
    })
    .map_err(|e| e.to_string())
}

pub fn update_db_task_title_and_description(id: String, title: String, description: String, connection: &Connection) -> Result<String, String> {
    let result = connection.execute(
        "UPDATE tasks SET title = ?1, description = ?2, updated_at = datetime('now') WHERE id = ?3",
        (title, description, id),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok("Task updated successfully".to_string())
}

pub fn set_db_estimated_minutes(id: String, estimated_minutes: u16, connection: &Connection) -> Result<String, String> {
    let result = connection.execute(
        "UPDATE tasks SET estimated_minutes = ?1,  updated_at = datetime('now') WHERE id = ?2",
        (estimated_minutes, id),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok("Estimation updated successfully".to_string())
}

pub fn complete_db_task(id: String, connection: &Connection) -> Result<String, String> {
    connection.execute(
        "UPDATE tasks SET is_completed = 1, updated_at = datetime('now') WHERE id = ?1",
        [id],
    ).map_err(|e| e.to_string())?;
    Ok("Task completed".to_string())
}

pub fn set_db_task_schedule(
    id: String,
    is_duration: bool,
    is_all_day: bool,
    starts_at: Option<String>,
    starts_on: Option<String>,
    ends_at: Option<String>,
    ends_on: Option<String>,
    connection: &Connection,
) -> Result<String, String> {
    connection.execute(
        "UPDATE tasks SET is_duration = ?1, is_all_day = ?2, starts_at = ?3, starts_on = ?4, ends_at = ?5, ends_on = ?6, updated_at = datetime('now') WHERE id = ?7",
        (is_duration as i32, is_all_day as i32, starts_at, starts_on, ends_at, ends_on, id),
    ).map_err(|e| e.to_string())?;
    Ok("Schedule updated successfully".to_string())
}
