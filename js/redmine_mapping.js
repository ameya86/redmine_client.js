var RedmineMapping = function(url) {
    var client;
    var current_user;
    var projects;

    this.client = new RedmineClient(url);
}

RedmineMapping.prototype = {
    login: function(login_id, password) {
        this.client.login(
            login_id,
            password,
            function(data) {
                this.setAccount(data);
            }.bind(this));
    },

    setAccount: function(data) {
        this.current_user = data['user'];

        var user_firstname = this.current_user['firstname'];
        var user_lastname = this.current_user['lastname'];
        $('#account').text(user_firstname + ' ' + user_lastname);

        this.client.api_key = this.current_user['api_key'];
    },

    getProjects: function() {
        this.client.loadProjects(function(data) {
            this.setProjects(data);
        }.bind(this));
    },

    setProjects: function(data) {
        $.each(data["projects"], function(index, project) {
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
            mapper.client.loadIssues(
                $(this).find('.project_id:first').text(),
                function(data) {
                    this.setIssues(data);
                }.bind(mapper)
            );
        });
    },

    setIssues: function(data) {
        $.each(data["issues"], function(index, issue) {
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
            mapper.client.loadIssue(
                $(this).find('.issue_id:first').text(),
                function(data) {
                    this.setIssue(data);
                }.bind(mapper)
            );
        });
    },

    setIssue: function(data) {
        var issue = data["issue"];
        var description = $('<div>');
        description.text(issue["description"]);

        var tag = $('<div>');
        tag.text(issue['subject']);
        tag.append(description);
        $('#show_issue').append(tag);
    }
}
