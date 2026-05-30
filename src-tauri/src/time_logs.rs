use serde::Serialize;
use tauri::State;
use uuid::Uuid;

use crate::db::DbState;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeLog {
    pub id: String,
    pub task_id: String,
    pub task_title: String,
    pub starts_at: String,
    pub ends_at: String,
    pub duration: i64,
}

#[tauri::command]
pub async fn list_time_logs(state: State<'_, DbState>) -> Result<Vec<TimeLog>, String> {
    let conn = state.connection.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT tl.id, tl.task_id, t.title, tl.starts_at, tl.ends_at, tl.duration FROM time_logs tl JOIN tasks t ON tl.task_id = t.id ORDER BY tl.starts_at")
        .map_err(|e| e.to_string())?;

    let logs = stmt
        .query_map([], |row| {
            Ok(TimeLog {
                id: row.get(0)?,
                task_id: row.get(1)?,
                task_title: row.get(2)?,
                starts_at: row.get(3)?,
                ends_at: row.get(4)?,
                duration: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<TimeLog>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(logs)
}

#[tauri::command]
pub async fn create_time_log(
    task_id: String,
    starts_at: String,
    ends_at: String,
    duration: i64,
    state: State<'_, DbState>,
) -> Result<String, String> {
    let conn = state.connection.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO time_logs (id, task_id, starts_at, ends_at, duration) VALUES (?1, ?2, ?3, ?4, ?5)",
        (id, task_id, starts_at, ends_at, duration),
    ).map_err(|e| e.to_string())?;

    Ok("Time log created".to_string())
}
