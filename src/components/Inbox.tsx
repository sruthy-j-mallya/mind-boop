import { useListTasks } from "@/tanstackQueries/useTaskQueries";

const Inbox = () => {
  const { data: tasks, isLoading, isError } = useListTasks();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load tasks.</div>;

  return (
    <div>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <span>{task.title}</span>
              {task.description && <p>{task.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks yet.</p>
      )}
    </div>
  );
};

export default Inbox;
