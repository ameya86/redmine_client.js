var RedmineClient = function(url) {
    var base_url;
    var api_key;
    var user_firstname;
    var user_lastname;

    this.base_url = url;
}

RedmineClient.prototype = {
    login: function(login_id, password) {
        this.login_id = login_id;
        this.password = password;
        $.ajax({
            url: this.base_url + "/users/current.json",
            dataType: 'json',
            headers: {
                "Authorization": "Basic " + btoa(login_id + ":" + password)
            },
            success: this.setAccount.bind(this),
            error: this.errorPattern
        });
    },

    setAccount: function(user) {
        this.api_key = user['user']['api_key'];
        this.user_firstname = user['user']['firstname'];
        this.user_lastname = user['user']['lastname'];
        $('#account').text(this.user_firstname + ' ' + this.user_lastname);
    },

    getProjects: function() {
        $.ajax({
            url: this.base_url + "/projects.json",
            dataType: 'json',
            headers: {
                "X-Redmine-API-Key": this.api_key
            },
            success: this.setProjects,
            error: this.errorPattern
        });
    },

    setProjects: function(projects) {
        $.each(projects["projects"], function(index, project) {
            var tag = $('<div>');
            var link = $('<a>');

            link.text(project["name"]);
            link.attr('href', '#');

            var identifier = $('<div>');
            identifier.text(project["identifier"]);
            identifier.addClass('attr');
            identifier.addClass('identifier');

            var project_id = $('<div>');
            project_id.text(project["id"]);
            project_id.addClass('attr');
            project_id.addClass('project_id');

            tag.addClass('project');
            tag.append(link);
            tag.append(project_id);
            tag.append(identifier);
            $('#project_list').append(tag);
        });

        $('#project_list div.project').click(function() {
            // todo clientでなくthis的な呼び方をしたい
            client.getIssues($(this).find('.project_id:first').text());
        });
    },

    getIssues: function(project_id) {
          $.ajax({
            url: this.base_url + "/issues.json",
            dataType: 'json',
            headers: {
                "X-Redmine-API-Key": this.api_key
            },
            data: {'project_id': project_id},
            success: this.setIssues,
            error: this.errorPattern
        });
    },

    setIssues: function(issues) {
        $.each(issues["issues"], function(index, issue) {
            var link = $('<a>');

            link.text(issue["subject"]);
            link.attr('href', '#');

            var issue_id = $('<div>');
            issue_id.text(issue["id"]);
            issue_id.addClass('attr');
            issue_id.addClass('issue_id');

            var tag = $('<div>');
            tag.addClass('issue');
            tag.append(issue_id);
            tag.append(link);
            $('#issue_list').append(tag);
        });

        $('#issue_list div.issue').click(function() {
            // todo clientでなくthis的な呼び方をしたい
            client.getIssue($(this).find('.issue_id:first').text());
        });
    },

    getIssue: function(issue_id) {
          $.ajax({
            url: this.base_url + "/issues/" + issue_id + ".json",
            dataType: 'json',
            headers: {
                "X-Redmine-API-Key": this.api_key
            },
            success: this.setIssue,
            error: this.errorPattern
        });
    },

    setIssue: function(issue_data) {
        var issue = issue_data["issue"];
        var description = $('<div>');
        description.text(issue["description"]);

        var tag = $('<div>');
        tag.text(issue['subject']);
        tag.append(description);
        $('#show_issue').append(tag);
    },

    errorPattern: function(jqXHR, textStatus, errorThrown) {
        alert(textStatus + ": " + errorThrown);
    }
};
