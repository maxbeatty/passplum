exports.register = function (server, options, next) {

    const icons = [
        'favicon.ico',
        'touch-icon-ipad-retina.png',
        'touch-icon-ipad.png',
        'touch-icon-iphone-retina-hd.png',
        'touch-icon-iphone-retina.png'
    ];

    icons.forEach(function register (icon) {

        server.route({
            method: 'GET',
            path: '/' + icon,
            handler: {
                file: 'lib/static/' + icon
            }
        });
    });

    next();
};

exports.register.attributes = {
    name: 'icons'
};
