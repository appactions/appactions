import EventEmitter from './event-emitter';

class Bridge extends EventEmitter {
    constructor(wall) {
        super();

        this._wall = wall;
        this._isShutdown = false;

        this._wallUnlisten =
            wall.listen(message => {
                this.emit(message.event, message.payload);
            }) || null;
    }

    send(event, ...payload) {
        if (this._isShutdown) {
            console.warn(`Cannot send message "${event}" through a Bridge that has been shutdown.`);
            return;
        }

        this._wall.send(event, ...payload);
    }

    shutdown() {
        if (this._isShutdown) {
            console.warn('Bridge was already shutdown.');
            return;
        }

        // Queue the shutdown outgoing message for subscribers.
        this.send('shutdown');

        // Mark this bridge as destroyed, i.e. disable its public API.
        this._isShutdown = true;

        // Disable the API inherited from EventEmitter that can add more listeners and send more messages.
        this.addListener = function () {};
        this.emit = function () {};

        // Unsubscribe this bridge incoming message listeners to be sure, and so they don't have to do that.
        this.removeAllListeners();

        // Stop accepting and emitting incoming messages from the wall.
        if (this._wallUnlisten) {
            this._wallUnlisten();
        }
    }
}

export default Bridge;
