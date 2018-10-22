var server;

$(document).ready(init);

function init() {
    server = io.connect('http://192.168.91.68:8080');

    $('#change').on('click', function() {
        console.log($('#keyword').val())
        server.emit('keyword', {
            keyword: $('#keyword').val()
        });
    })

    server.on('connected', function(data) {
        $('#keyword').val(data.keyword)
    })

    server.on('tweet', function(data) {
        console.log(data)
        $('<p>' + data.tweet.text + '</p>').appendTo('#tweets')
    })
}
