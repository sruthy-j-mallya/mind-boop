# SQL Query Style (Tauri Backend)

## Format SQL statements across multiple lines

Write `SELECT`/`INSERT`/`UPDATE` statements with each clause (`SELECT`, `FROM`,
`WHERE`, `SET`, `VALUES`, `ORDER BY`, etc.) on its own line instead of as one
long string literal. This keeps queries readable as columns and conditions grow.

**Good**

```rust
connection.prepare(
    "SELECT id, title, description
     FROM tasks
     WHERE is_completed = 0
     ORDER BY created_at DESC",
)
```

**Bad**

```rust
connection.prepare("SELECT id, title, description FROM tasks WHERE is_completed = 0 ORDER BY created_at DESC")
```

## Use named parameters, not positional parameters

Bind query parameters with `rusqlite::named_params!` and `:name` placeholders
instead of positional `?1`, `?2`, ... placeholders. Named parameters stay
correct when columns are reordered or added, and make the binding self-documenting
at the call site.

**Good**

```rust
use rusqlite::named_params;

connection.execute(
    "UPDATE tasks SET title = :title WHERE id = :id",
    named_params! { ":title": title, ":id": id },
)
```

**Bad**

```rust
connection.execute(
    "UPDATE tasks SET title = ?1 WHERE id = ?2",
    (title, id),
)
```

## Don't repeat the same SQL expression — compute it once in Rust and bind it

If a value (e.g. the current timestamp via `strftime(...)`) is used in more
than one place in a query, compute it once as a Rust variable and pass it in
as a single named parameter, rather than repeating the SQL expression.

**Good**

```rust
fn now_iso() -> String {
    Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string()
}

let now = now_iso();
connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (:id, :title, :now, :now)",
    named_params! { ":id": id, ":title": title, ":now": now },
)
```

**Bad**

```rust
connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at)
     VALUES (?1, ?2, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))",
    (id, title),
)
```
