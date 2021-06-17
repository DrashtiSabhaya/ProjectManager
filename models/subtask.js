class SubTask {
    constructor(id, task_name, description, task_id, created_at, user_id, created_by, status) {
        this.id = id;
        this.task_name = task_name;
        this.description = description;
        this.task_id = task_id;
        this.created_at = created_at;
        this.user_id = user_id;
        this.created_by = created_by;
        this.status = status;
    }
}
export default SubTask;