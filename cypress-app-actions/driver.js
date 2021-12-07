module.exports.register = (Component, config) => {
    if (!config || !config.role) {
        throw new Error('Role must be specified');
    }
    
    Object.defineProperty(Component, '__REACT_APP_ACTIONS__', {
        enumerable: false,
        get() {
            return config;
        },
    });
};
