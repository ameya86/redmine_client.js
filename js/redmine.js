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
        $.each(projects["projects"], function(index, value) {
            var tag = $('<div>');
            tag.text(value["name"]);
            $('#project_list').append(tag);
        });
    },

    errorPattern: function(jqXHR, textStatus, errorThrown) {
        alert(textStatus + ": " + errorThrown);
    }
};
