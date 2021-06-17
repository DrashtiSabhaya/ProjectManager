class SharedProject {
    constructor(project_id, project_name, owner, shared_with, permission) {
        this.project_id = project_id;
        this.project_name = project_name;
        this.owner = owner;
        this.shared_with = shared_with;
        this.permission = permission;
    }
}

export default SharedProject;