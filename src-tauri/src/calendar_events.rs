use tauri::State;

use events_db::CalendarEvent;
use crate::db::DbState;

pub mod events_db;

#[tauri::command]
pub async fn list_calendar_tasks(state: State<'_, DbState>) -> Result<Vec<CalendarEvent>, String> {
    let connection = state.connection.lock().map_err(|e| e.to_string())?;

    events_db::list_db_events(&connection)
}
