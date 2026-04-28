mod db;
mod tasks;
mod time_logs;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db::init_db())
        .invoke_handler(tauri::generate_handler![
            tasks::create_task,
            tasks::update_task,
            tasks::list_tasks,
            tasks::show_task,
            time_logs::create_time_log,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
