const NoTasksPage = () => (
  <div className="flex h-full flex-col items-center justify-center">
    <img
      src="/no-task-illustration.png"
      alt="A small window with a cup of tea"
      className="w-72 select-none"
      draggable={false}
    />
    <p className="text-muted-foreground text-base">
      You have no task, layback and relax
    </p>
  </div>
);

export default NoTasksPage;
