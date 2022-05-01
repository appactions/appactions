import json2yaml from './json-to-yaml';
import yaml from 'yaml';

test('json2yaml', () => {
    const json = {
        steps: [
            { with: 'Board', do: 'addCard' },
            { with: ['Board', { Lane: 'aaa' }], do: { addCard: ['fff', 'ggg', 'hhh'] }, assert: 'exists' },
            {
                with: ['Board', { Lane: 'aaa' }],
                do: { addCard: ['bbb', 'nnn', 'mmm'] },
                assert: { exists: true, text: ['===', 'aaa'] },
            },
        ],
    };

    const yamlContent = json2yaml(json);

    expect(yamlContent).toMatchInlineSnapshot(`
"steps: 
  - with: Board
    do: addCard
  - with: 
      - Board
      - { Lane: aaa }
    do: 
      addCard: [fff, ggg, hhh]
    assert: exists
  - with: 
      - Board
      - { Lane: aaa }
    do: 
      addCard: [bbb, nnn, mmm]
    assert: 
      exists: true
      text: [===, aaa]
"
`);

    // let's see if parsing it again results the correct json data
    expect(yaml.parse(yamlContent)).toEqual(json);
});
