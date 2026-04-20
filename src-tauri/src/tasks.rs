use rusqlite::{Connection, Result};
use uuid::Uuid;

#[tauri::command]
pub async fn create_task(title: String, description: String) -> Result<String, String> {
    let conn = Connection::open("mind-boop-local.db").unwrap();
    let id = Uuid::new_v4().to_string();

    let result = conn.execute(
        "INSERT INTO tasks (id, title, description) VALUES (?1, ?2, ?3)",
        (id.clone(), title, description),
    ).map_err(|e| e.to_string());


    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok(id)
}

#[tauri::command]
pub async fn update_task(id: String, title: String, description: String) -> Result<String, String> {
    let conn = Connection::open("mind-boop-local.db").unwrap();
    let result = conn.execute(
        "UPDATE tasks SET title = ?1, description = ?2 WHERE id = ?3",
        (title, description, id),
    ).map_err(|e| e.to_string());

    

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok(result.unwrap().to_string())
}
