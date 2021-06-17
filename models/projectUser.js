class ProjectUser {
    constructor(project_id, project_name, owner, shared_with, shared_userid,shared_with_username, permission) {
        this.project_id = project_id;
        this.project_name = project_name;
        this.owner = owner;
        this.shared_with = shared_with;
        this.shared_userid = shared_userid;
        this.shared_with_username = shared_with_username;
        this.permission = permission;
    }
}

export default ProjectUser;