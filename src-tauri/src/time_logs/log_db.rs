use chrono::DateTime;
use serde::Serialize;
use uuid::Uuid;

use rusqlite::Connection;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeLog {
    pub id: String,
    pub task_id: String,
    pub task_title: String,
    pub starts_at: String,
    pub ends_at: String,
}

pub fn list_db_time_logs(connection: &Connection) -> Result<Vec<TimeLog>, String> {
    let mut stmt = connection
        .prepare("SELECT tl.id, tl.task_id, t.title, tl.starts_at, tl.ends_at FROM time_logs tl JOIN tasks t ON tl.task_id = t.id ORDER BY tl.starts_at")
        .map_err(|e| e.to_string())?;

    let logs = stmt
        .query_map([], |row| {
            Ok(TimeLog {
                id: row.get(0)?,
                task_id: row.get(1)?,
                task_title: row.get(2)?,
                starts_at: row.get(3)?,
                ends_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<TimeLog>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(logs)
}

pub fn create_db_time_log(
    task_id: String,
    starts_at: String,
    ends_at: String,
    connection: &Connection,
) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();

    let start = DateTime::parse_from_rfc3339(&starts_at)
        .map_err(|_| format!("Invalid starts_at: {starts_at}"))?;
    let end = DateTime::parse_from_rfc3339(&ends_at)
        .map_err(|_| format!("Invalid ends_at: {ends_at}"))?;

    if start >= end {
        return Err("starts_at must be before ends_at".to_string());
    }
    if (end - start).num_minutes() < 2 {
        return Err("ends_at must be at least 2 minutes after starts_at".to_string());
    }

    connection.execute(
        "INSERT INTO time_logs (id, task_id, starts_at, ends_at) VALUES (?1, ?2, ?3, ?4)",
        (&id, task_id, starts_at, ends_at),
    ).map_err(|e| e.to_string())?;

    Ok(id)
}
