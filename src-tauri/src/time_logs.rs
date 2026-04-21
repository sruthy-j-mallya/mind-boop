use rusqlite::{Connection, Result};
use uuid::Uuid;

#[tauri::command]
pub async fn create_time_log(task_id: String, start_time: String, end_time: String, duration: i128) -> Result {
    let conn = Connection::open("mind-boop-local.db").unwrap();
    let id = Uuid::new_v4().to_string();

    let result = conn.execute(
        "INSERT INTO time_logs (id, task_id, start_time, end_time, duration) VALUES (?1, ?2, ?3, ?4, ?5)",
        (id, ),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok("Time log created");
}

