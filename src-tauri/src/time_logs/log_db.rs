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
    pub mode: String,
    pub timer_preset: Option<i64>,
    pub started_at: String,
    pub completed_at: Option<String>,
}

pub fn list_db_time_logs(connection: &Connection) -> Result<Vec<TimeLog>, String> {
    let mut stmt = connection
        .prepare(
            "SELECT tl.id, tl.task_id, t.title, tl.mode, tl.timer_preset, tl.started_at, tl.completed_at
             FROM time_logs tl
             JOIN tasks t ON tl.task_id = t.id
             ORDER BY tl.started_at",
        )
        .map_err(|e| e.to_string())?;

    let logs = stmt
        .query_map([], |row| {
            Ok(TimeLog {
                id: row.get(0)?,
                task_id: row.get(1)?,
                task_title: row.get(2)?,
                mode: row.get(3)?,
                timer_preset: row.get(4)?,
                started_at: row.get(5)?,
                completed_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<TimeLog>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(logs)
}

pub fn create_db_time_log(
    task_id: String,
    mode: String,
    timer_preset: Option<i64>,
    started_at: String,
    completed_at: Option<String>,
    connection: &Connection,
) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();

    let start = DateTime::parse_from_rfc3339(&started_at)
        .map_err(|_| format!("Invalid started_at: {started_at}"))?;

    if let Some(ref ca) = completed_at {
        let end = DateTime::parse_from_rfc3339(ca)
            .map_err(|_| format!("Invalid completed_at: {ca}"))?;

        if start >= end {
            return Err("started_at must be before completed_at".to_string());
        }
        if (end - start).num_minutes() < 2 {
            return Err("completed_at must be at least 2 minutes after started_at".to_string());
        }
    }

    connection.execute(
        "INSERT INTO time_logs (id, task_id, mode, timer_preset, started_at, completed_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![&id, task_id, mode, timer_preset, started_at, completed_at],
    ).map_err(|e| e.to_string())?;

    Ok(id)
}
