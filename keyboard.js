function Keyboard() {
    if (!(this instanceof Keyboard)) {
        throw 'keyboard not instantiated';
    }
    var handlers = {};
    var isKeyPressed = {};

    function onKeyDown(key) {
        if (isKeyPressed[key.code]) {
            return;
        }
        isKeyPressed[key.code] = true;

        if (key.code in handlers && 'down' in handlers[key.code]) {
            handlers[key.code].down();
        }
    }

    function onKeyUp(key) {
        if (!isKeyPressed[key.code]) {
            return;
        }
        isKeyPressed[key.code] = false;

        if (key.code in handlers && 'up' in handlers[key.code]) {
            handlers[key.code].up();
        }
    }

    this.install = function (document) {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    };

    this.add = function (handler) {
        handlers[handler.key] = handler;
    }
}