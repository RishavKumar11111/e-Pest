window.onload = function() {
    setTimeout(function() {
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    }, 3000);
};