use tauri::State;
use uuid::Uuid;

use crate::db::DbState;

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
