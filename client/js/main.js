var server;

$(document).ready(init);

function init() {
    server = io.connect('http://localhost:8080');

    server.on('connected', function(data) {
        $('#keyword').val(data.keyword)
    })

    server.on('tweet', function(data) {
        $('<p>' + data.tweet.text + '</p>').appendTo('#tweets')
    })
}
