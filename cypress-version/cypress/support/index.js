import { registerCypressCommands } from '../../src';

registerCypressCommands();

const req = require.context('../app', true, /\.cypress\.jsx?/);

req.keys().forEach(filename => {
    req(filename);
});
