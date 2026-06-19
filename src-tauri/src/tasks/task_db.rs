use serde::Serialize;
use rusqlite::Connection;
use uuid::Uuid;
use chrono::NaiveDate;
use chrono::NaiveDateTime;

#[derive(Debug)]
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub estimated_minutes: Option<u16>,
    pub is_duration: bool,
    pub is_all_day: bool,
    pub is_completed: bool,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
}

pub fn list_db_tasks(search_string: &str, connection: &Connection,) -> Result<Vec<Task>, String> {
  let pattern = format!("%{}%", search_string);
    let mut stmt = connection
        .prepare("SELECT id, title, description, estimated_minutes, is_duration, is_all_day, is_completed, starts_at, ends_at FROM tasks WHERE is_completed = 0 AND (title LIKE ?1 OR description LIKE ?1) ORDER BY COALESCE(starts_at, '9999-12-30T23:59:59Z'), created_at DESC")
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
                starts_at: row.get(7)?,
                ends_at: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<Task>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn create_db_task(
  title: String,
  description: Option<String>,
  estimated_minutes: u16,
  is_duration: bool,
  is_all_day: bool,
  starts_at: Option<String>,
  ends_at: Option<String>,
  connection: &Connection) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();

    connection.execute(
        "INSERT INTO tasks (id, title, description, estimated_minutes, is_duration, is_all_day, starts_at, ends_at, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))",
        (id.clone(), title, description, estimated_minutes, is_duration, is_all_day, starts_at, ends_at),
    ).map_err(|e| e.to_string())?;

    Ok(id)
}

pub fn create_db_task_with_title_only(title: String, connection: &Connection) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();

    connection.execute(
        "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))",
        (id.clone(), title),
    ).map_err(|e| e.to_string())?;

    Ok(id)
}

pub fn show_db_task(id: String, connection: &Connection) -> Result<Task, String> {
    let mut stmt = connection
        .prepare("SELECT id, title, description, estimated_minutes, is_duration, is_all_day, is_completed, starts_at, ends_at FROM tasks WHERE id = ?1")
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
            starts_at: row.get(7)?,
            ends_at: row.get(8)?,
        })
    })
    .map_err(|e| e.to_string())
}

pub fn update_db_task_title_and_description(id: String, title: String, description: String, connection: &Connection) -> Result<String, String> {
    let result = connection.execute(
        "UPDATE tasks SET title = ?1, description = ?2, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?3",
        (title, description, id),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok("Task updated successfully".to_string())
}

pub fn set_db_estimated_minutes(id: String, estimated_minutes: u16, connection: &Connection) -> Result<String, String> {
    let result = connection.execute(
        "UPDATE tasks SET estimated_minutes = ?1,  updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
        (estimated_minutes, id),
    ).map_err(|e| e.to_string());

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok("Estimation updated successfully".to_string())
}

pub fn complete_db_task(id: String, connection: &Connection) -> Result<String, String> {
    connection.execute(
        "UPDATE tasks SET is_completed = 1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?1",
        [id],
    ).map_err(|e| e.to_string())?;
    Ok("Task completed".to_string())
}

struct Schedule {
    is_duration: bool,
    is_all_day: bool,
    starts_at: Option<String>,
    ends_at: Option<String>
}

fn validate_schedule(schedule: Schedule) -> Result<Schedule, String> {
    if !schedule.is_duration {
        if schedule.ends_at.is_some() {
            return Err("ends_at need not be populated within due date context".to_string());
        }
        if schedule.is_all_day {
            return Err("is_all_day need not be populated within due date context".to_string());
        }
        if let Some(ref starts_at) = schedule.starts_at {
            let is_valid = NaiveDate::parse_from_str(starts_at, "%Y-%m-%d").is_ok()
                || NaiveDateTime::parse_from_str(starts_at, "%Y-%m-%dT%H:%M:%SZ").is_ok();
            if !is_valid {
                return Err("Invalid due date/time format".to_string());
            }
        }
        return Ok(schedule);
    }

    if schedule.starts_at.is_none() {
        return Err("starts_at must be present".to_string());
    }
    if schedule.ends_at.is_none() {
        return Err("ends_at must be present".to_string());
    }

    let starts_at = schedule.starts_at.as_ref().unwrap();
    let ends_at = schedule.ends_at.as_ref().unwrap();

    if schedule.is_all_day {
        if NaiveDate::parse_from_str(starts_at, "%Y-%m-%d").is_err() {
            return Err("Invalid starts_at date format".to_string());
        }
        if NaiveDate::parse_from_str(ends_at, "%Y-%m-%d").is_err() {
            return Err("Invalid ends_at date format".to_string());
        }
    } else {
        if NaiveDateTime::parse_from_str(starts_at, "%Y-%m-%dT%H:%M:%SZ").is_err() {
            return Err("Invalid starts_at datetime format".to_string());
        }
        if NaiveDateTime::parse_from_str(ends_at, "%Y-%m-%dT%H:%M:%SZ").is_err() {
            return Err("Invalid ends_at datetime format".to_string());
        }
    }

    Ok(schedule)
}

pub fn set_db_task_schedule(
    id: String,
    is_duration: bool,
    is_all_day: bool,
    starts_at: Option<String>,
    ends_at: Option<String>,
    connection: &Connection,
) -> Result<String, String> {

    let validator_result = validate_schedule(Schedule {
        is_duration,
        is_all_day,
        starts_at,
        ends_at
    });

    match validator_result {
        Ok(schedule) => {
            connection
                .execute(
                    "UPDATE tasks SET is_duration = ?1, is_all_day = ?2, starts_at = ?3, ends_at = ?4, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?5",
                    (schedule.is_duration as i32, schedule.is_all_day as i32, schedule.starts_at, schedule.ends_at, id),
                )
                .map_err(|e| e.to_string())?;
        }
        Err(e) => {
            return Err(e.to_string());
        }
    }

    Ok("Schedule updated successfully".to_string())
}
