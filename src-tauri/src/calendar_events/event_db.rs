use rusqlite::Connection;
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CalendarEvent {
    pub id: String,
    pub title: String,
    pub is_duration: bool,
    pub is_all_day: bool,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
}
pub fn list_db_events(connection: &Connection) -> Result<Vec<CalendarEvent>, String> {
    let mut stmt = connection
        .prepare(
            "SELECT id, title, is_duration, is_all_day, starts_at, ends_at
             FROM tasks
             WHERE starts_at IS NOT NULL AND is_completed = 0 AND deleted_at IS NULL
             ORDER BY starts_at",
        )
        .map_err(|e| e.to_string())?;

    let tasks: Vec<CalendarEvent> = stmt
        .query_map([], |row| {
            Ok(CalendarEvent {
                id: row.get(0)?,
                title: row.get(1)?,
                is_duration: row.get::<_, i32>(2)? != 0,
                is_all_day: row.get::<_, i32>(3)? != 0,
                starts_at: row.get(4)?,
                ends_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<CalendarEvent>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}
