class Project {
    constructor(id, name, description, created_at, end_date, created_by, ownerid, status, progress, total_tasks, project_users) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
        this.end_date = end_date;
        this.created_by = created_by;
        this.ownerid = ownerid;
        this.status = status;
        this.progress = progress;
        this.total_tasks = total_tasks;
        this.project_users = project_users;
    }
}

export default Project;