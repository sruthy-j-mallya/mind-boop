use serde::Serialize;

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
