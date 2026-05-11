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
    pub start_time: String,
    pub end_time: String,
    pub duration: i64,
}

#[tauri::command]
pub async fn list_time_logs(state: State<'_, DbState>) -> Result<Vec<TimeLog>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT tl.id, tl.task_id, t.title, tl.start_time, tl.end_time, tl.duration FROM time_logs tl JOIN tasks t ON tl.task_id = t.id ORDER BY tl.start_time")
        .map_err(|e| e.to_string())?;

    let logs = stmt
        .query_map([], |row| {
            Ok(TimeLog {
                id: row.get(0)?,
                task_id: row.get(1)?,
                task_title: row.get(2)?,
                start_time: row.get(3)?,
                end_time: row.get(4)?,
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
    start_time: String,
    end_time: String,
    duration: i64,
    state: State<'_, DbState>,
) -> Result<String, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO time_logs (id, task_id, start_time, end_time, duration) VALUES (?1, ?2, ?3, ?4, ?5)",
        (id, task_id, start_time, end_time, duration),
    ).map_err(|e| e.to_string())?;

    Ok("Time log created".to_string())
}
