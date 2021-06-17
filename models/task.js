class Task {
    constructor(id, task_name, description, project_name, created_at, endDate, progress, status, assigned_to) {
        this.id = id,
        this.task_name = task_name;
        this.description = description;
        this.project_name = project_name;
        this.created_at = created_at;
        this.endDate = endDate;
        this.progress = progress;
        this.status = status;
        this.assigned_to = assigned_to;
    }
}

export default Task;