use serde::Serialize;
use rusqlite::Connection;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub estimated_minutes: u16,
    pub is_duration: bool,
    pub is_all_day: bool,
    pub is_completed: bool,
    pub starts_on: Option<String>,
    pub starts_at: Option<String>,
    pub ends_on: Option<String>,
    pub ends_at: Option<String>,
}

pub fn list_db_tasks(connection: &Connection, search_string: &str) -> Result<Vec<Task>, String> {
  let pattern = format!("%{}%", search_string);
    let mut stmt = connection
        .prepare("SELECT id, title, description, estimated_minutes, is_duration, is_all_day, is_completed, starts_on, starts_at, ends_on, ends_at FROM tasks WHERE is_completed = 0 AND (title LIKE ?1 OR description LIKE ?1) ORDER BY starts_on IS NULL, starts_on, starts_at IS NULL, starts_at")
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
