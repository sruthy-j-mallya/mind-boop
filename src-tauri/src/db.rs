use rusqlite::Connection;
use std::sync::Mutex;

pub struct DbState {
    pub connection: Mutex<Connection>
}

pub fn init_db() -> DbState {
    let conn = Connection::open("mind-boop-local.db")
        .expect("failed to open database");
    DbState { connection: Mutex::new(conn) }
}
