pub mod tasks_db;

use tauri::{State};

use tasks_db::Task;
use crate::db::DbState;

#[tauri::command]
pub async fn list_tasks(search_string: &str, state: State<'_, DbState>) -> Result<Vec<Task>, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;

  tasks_db::list_db_tasks(search_string, &connection)
}

#[tauri::command]
pub async fn create_task(title: String, state: State<'_, DbState>) -> Result<String, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;

  tasks_db::create_db_task(title, &connection)
}

#[tauri::command]
pub async fn show_task(id: String, state: State<'_, DbState>) -> Result<Task, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;

  tasks_db::show_db_task(id, &connection)
}

#[tauri::command]
pub async fn update_task_title_and_description(id: String, title: String, description: String, state: State<'_, DbState>) -> Result<String, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;

  tasks_db::update_db_task_title_and_description(id, title, description, &connection)
}

#[tauri::command]
pub async fn set_estimated_minutes(id: String, estimated_minutes: u16, state: State<'_, DbState>) -> Result<String, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;

  tasks_db::set_db_estimated_minutes(id, estimated_minutes, &connection)
}

#[tauri::command]
pub async fn complete_task(id: String, state: State<'_, DbState>) -> Result<String, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;

  tasks_db::complete_db_task(id, &connection)
}

#[tauri::command]
pub async fn set_task_schedule(
  id: String,
  is_duration: bool,
  is_all_day: bool,
  starts_at: Option<String>,
  ends_at: Option<String>,
  state: State<'_, DbState>,
) -> Result<String, String> {
    let connection = state.connection.lock().map_err(|e| e.to_string())?;

    tasks_db::set_db_task_schedule(id, is_duration, is_all_day, starts_at, ends_at, &connection)
}
