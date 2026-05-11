use serde::Serialize;
use tauri::State;
use uuid::Uuid;

use crate::db::DbState;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub estimated_minutes: u16,
    pub is_duration: bool,
    pub is_all_day: bool,
    pub is_completed: bool,
    pub starts_on: Option<String>,
    pub starts_at: Option<String>,
    pub ends_on: Option<String>,
    pub ends_at: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CalendarTask {
    pub id: String,
    pub title: String,
    pub is_duration: bool,
    pub is_all_day: bool,
    pub starts_on: Option<String>,
    pub starts_at: Option<String>,
    pub ends_on: Option<String>,
    pub ends_at: Option<String>,
}

#[tauri::command]
pub async fn list_tasks(search_string: String, state: State<'_, DbState>) -> Result<Vec<Task>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let pattern = format!("%{}%", search_string);
    let mut stmt = conn
        .prepare("SELECT id, title, description, estimated_minutes, is_duration, is_all_day, is_completed, starts_on, starts_at, ends_on, ends_at FROM tasks WHERE is_completed = 0 AND (title LIKE ?1 OR description LIKE ?1) ORDER BY starts_on IS NULL, starts_on, starts_at IS NULL, starts_at")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&pattern], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                estimated_minutes: row.get(3)?,
                is_duration: row.get::<_, i32>(4)? != 0,
                is_all_day: row.get::<_, i32>(5)? != 0,
                is_completed: row.get::<_, i32>(6)? != 0,
                starts_on: row.get(7)?,
                starts_at: row.get(8)?,
                ends_on: row.get(9)?,
                ends_at: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<Task>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

#[tauri::command]
pub async fn create_task(title: String, state: State<'_, DbState>) -> Result<String, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
        (id.clone(), title),
    ).map_err(|e| e.to_string())?;

    Ok(id)
}

#[tauri::command]
pub async fn show_task(id: String, state: State<'_, DbState>) -> Result<Task, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, title, description, estimated_minutes, is_duration, is_all_day, is_completed, starts_on, starts_at, ends_on, ends_at FROM tasks WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    stmt.query_row([id], |row| {
        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            estimated_minutes: row.get(3)?,
            is_duration: row.get::<_, i32>(4)? != 0,
            is_all_day: row.get::<_, i32>(5)? != 0,
            is_completed: row.get::<_, i32>(6)? != 0,
            starts_on: row.get(7)?,
            starts_at: row.get(8)?,
            ends_on: row.get(9)?,
            ends_at: row.get(10)?,
        })
    })
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_task_title_and_description(id: String, title: String, description: String, state: State<'_, DbState>) -> Result<String, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let result = conn.execute(
        "UPDATE tasks SET title = ?1, description = ?2, updated_at = datetime('now') WHERE id = ?3",
        (title, description, id),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok("Task updated successfully".to_string())
}

#[tauri::command]
pub async fn set_estimated_minutes(id: String, estimated_minutes: u16, state: State<'_, DbState>) -> Result<String, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let result = conn.execute(
        "UPDATE tasks SET estimated_minutes = ?1,  updated_at = datetime('now') WHERE id = ?2",
        (estimated_minutes, id),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok("Estimation updated successfully".to_string())
}

#[tauri::command]
pub async fn list_calendar_tasks(state: State<'_, DbState>) -> Result<Vec<CalendarTask>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, title, is_duration, is_all_day, starts_on, starts_at, ends_on, ends_at FROM tasks WHERE starts_on IS NOT NULL AND is_completed = 0 AND deleted_at IS NULL ORDER BY starts_on, starts_at IS NULL, starts_at")
        .map_err(|e| e.to_string())?;

    let tasks: Vec<CalendarTask> = stmt
        .query_map([], |row| {
            Ok(CalendarTask {
                id: row.get(0)?,
                title: row.get(1)?,
                is_duration: row.get::<_, i32>(2)? != 0,
                is_all_day: row.get::<_, i32>(3)? != 0,
                starts_on: row.get(4)?,
                starts_at: row.get(5)?,
                ends_on: row.get(6)?,
                ends_at: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<CalendarTask>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

#[tauri::command]
pub async fn complete_task(id: String, state: State<'_, DbState>) -> Result<String, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE tasks SET is_completed = 1, updated_at = datetime('now') WHERE id = ?1",
        [id],
    ).map_err(|e| e.to_string())?;
    Ok("Task completed".to_string())
}

#[tauri::command]
pub async fn set_task_schedule(
    id: String,
    is_duration: bool,
    is_all_day: bool,
    starts_at: Option<String>,
    starts_on: Option<String>,
    ends_at: Option<String>,
    ends_on: Option<String>,
    state: State<'_, DbState>,
) -> Result<String, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE tasks SET is_duration = ?1, is_all_day = ?2, starts_at = ?3, starts_on = ?4, ends_at = ?5, ends_on = ?6, updated_at = datetime('now') WHERE id = ?7",
        (is_duration as i32, is_all_day as i32, starts_at, starts_on, ends_at, ends_on, id),
    ).map_err(|e| e.to_string())?;
    Ok("Schedule updated successfully".to_string())
}
