module.exports = {
    webpack: config => {
        // because cypress-app-actions depends on component names
        config.optimization.minimize = false;

        return config;
    },
};
