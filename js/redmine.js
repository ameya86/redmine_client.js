var RedmineClient = function(url) {
    var base_url;
    var api_key;
    var user_firstname;
    var user_lastname;

    this.base_url = url;
}

RedmineClient.prototype = {
    login: function(login_id, password) {
        var that = this;
        $.ajax({
            url: this.base_url + "/users/current.json",
            dataType: 'json',
            headers: {
                "Authorization": "Basic " + btoa(login_id + ":" + password)
            },
            success: this.set_account,
            error: function(jqXHR, textStatus, errorThrown){
                alert(textStatus + ": " + errorThrown);
            }
        });
    },

    set_account: function(user) {
        this.api_key = user['user']['api_key'];
        this.user_firstname = user['user']['firstname'];
        this.user_lastname = user['user']['lastname'];
        $('#account').text(this.user_firstname + ' ' + this.user_lastname);
    }
};
