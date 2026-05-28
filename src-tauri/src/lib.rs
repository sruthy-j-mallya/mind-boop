pub mod db;
pub mod tasks;
pub mod time_logs;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db::init_db())
        .invoke_handler(tauri::generate_handler![
            tasks::create_task,
            tasks::update_task_title_and_description,
            tasks::list_tasks,
            tasks::list_calendar_tasks,
            tasks::show_task,
            tasks::set_estimated_minutes,
            tasks::set_task_schedule,
            tasks::complete_task,
            time_logs::create_time_log,
            time_logs::list_time_logs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
