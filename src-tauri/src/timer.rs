pub mod timer_db;

use timer_db::TimerState;
use tauri::State;

use crate::db::DbState;

#[tauri::command]
pub async fn start(
    task_id: String,
    mode: String,
    timer_preset: u16,
    state: State<'_, DbState>,
) -> Result<String, String> {
    let connection = state.connection.lock().map_err(|e| e.to_string())?;
    timer_db::start_timer(task_id, mode, timer_preset, &connection)
}

#[tauri::command]
pub async fn pause(id: String, state: State<'_, DbState>) -> Result<(), String> {
    let connection = state.connection.lock().map_err(|e| e.to_string())?;
    timer_db::pause_timer(id, &connection)
}

#[tauri::command]
pub async fn restart(id: String, state: State<'_, DbState>) -> Result<(), String> {
    let connection = state.connection.lock().map_err(|e| e.to_string())?;
    timer_db::restart_timer(id, &connection)
}

#[tauri::command]
pub async fn complete(id: String, state: State<'_, DbState>) -> Result<(), String> {
    let connection = state.connection.lock().map_err(|e| e.to_string())?;
    timer_db::complete_timer(id, &connection)
}

#[tauri::command]
pub async fn get_status(
    state: State<'_, DbState>,
) -> Result<Option<TimerState>, String> {
    let connection = state.connection.lock().map_err(|e| e.to_string())?;
    timer_db::get_timer_status(&connection)
}
