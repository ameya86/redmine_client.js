var RedmineClient = function(url) {
    var base_url;
    var api_key;
    var user_firstname;
    var user_lastname;
    var login_info;

    this.base_url = url;
}

RedmineClient.prototype = {
    login: function(login_id, password, done_function) {
        this.login_id = login_id;
        this.password = password;

        $.ajax({
            url: this.base_url + "/users/current.json",
            dataType: 'jsonp',
            headers: {
                "Authorization": "Basic " + btoa(login_id + ":" + password)
            }
        }).done(done_function
        ).fail(this.errorPattern);
    },

    setAccount: function(data) {
        this.login_info = data['user'];
        this.api_key = data['user']['api_key'];
    },

    loadProjects: function(done_function) {
        $.ajax({
            url: this.base_url + "/projects.json",
            dataType: 'jsonp',
            headers: {
                "X-Redmine-API-Key": this.api_key
            }
        }).done(done_function).
           fail(this.errorPattern);
    },

    loadIssues: function(project_id, done_function) {
          $.ajax({
            url: this.base_url + "/issues.json",
            dataType: 'jsonp',
            headers: {
                "X-Redmine-API-Key": this.api_key
            },
            data: {
                'project_id': project_id
            }
        }).done(done_function).
           fail(this.errorPattern);
    },

    loadIssue: function(issue_id, done_function) {
          $.ajax({
            url: this.base_url + "/issues/" + issue_id + ".json",
            dataType: 'jsonp',
            headers: {
                "X-Redmine-API-Key": this.api_key
            }
        }).done(done_function).
           fail(this.errorPattern);
    },

    errorPattern: function(jqXHR, textStatus, errorThrown) {
        alert(textStatus + ": " + errorThrown);
    }
};
