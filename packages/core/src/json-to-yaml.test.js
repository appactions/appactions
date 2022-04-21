import json2yaml from './json-to-yaml';

// TODO get a good test case
test.skip('YAML stringifier shold make good looking output', () => {
    const data = {};
    expect(json2yaml(data)).toMatchInlineSnapshot();
});
