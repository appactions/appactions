import renderYAML from './recordings-to-yaml';
import recordings from './recordings.fixture.json';

const agent = {
    _sessionRecordingNestingDepth: 0,
    getSimplifyForPattern(pattern) {
        const simplifiers = {
            Board: {
                addLane: {
                    start: {
                        pattern: 'Button',
                        name: '+ Add another lane',
                        action: 'click',
                    },
                    end: {
                        pattern: 'Button',
                        name: 'Add lane',
                        action: 'click',
                    },
                    collect(generator) {
                        return generator.query({ pattern: 'Input', action: 'type' });
                    },
                },
            },
            Lane: {
                addCard: {
                    start: {
                        pattern: 'Button',
                        name: 'Click to add card',
                        action: 'click',
                    },
                    end: {
                        pattern: 'Button',
                        name: 'Add card',
                        action: 'click',
                    },
                    collect(generator) {
                        const [title] = generator.query({
                            pattern: 'Input',
                            name: 'title',
                            action: 'type',
                            optional: true,
                        });
                        const [label] = generator.query({
                            pattern: 'Input',
                            name: 'label',
                            action: 'type',
                            optional: true,
                        });
                        const [description] = generator.query({
                            pattern: 'Input',
                            name: 'description',
                            action: 'type',
                            optional: true,
                        });

                        return [title, label, description];
                    },
                },
            },
        };

        return simplifiers[pattern];
    },
};

const meta = {
    description: 'Test recorded at 4/21/2022, 5:23:37 PM',
    start: {
        route: '/',
        auth: false,
    },
};

test('Recording to YAML', () => {
    expect(renderYAML({ agent, meta, recordings })).toMatchInlineSnapshot(`
"description: \\"Test recorded at 4/21/2022, 5:23:37 PM\\"
start: 
  route: \\"/\\"
  auth: false
steps: 
  - with: 
      - Board
      - { Lane: Planned Tasks }
    do: 
      - addCard: [ddd, fff, ggg]
  - with: 
      - Board
      - { Lane: Planned Tasks }
      - { Card: Dispose Garbage }
      - Input
    do: 
      - exists: []
        assert: null
      - getValue: []
        assert: \\"Dispose Garbage\\"
  - with: Board
    do: 
      - addLane: [jjj]
  - with: 
      - Board
      - { Lane: jjj }
      - { Button: Click to add card }
    do: 
      - exists: []
        assert: null
  - with: 
      - Board
      - { Lane: Planned Tasks }
      - { Card: Buy milk }
      - Input
    do: 
      - type: [aaa]
  - with: 
      - Board
      - { Lane: Planned Tasks }
      - { Card: aaa }
      - Input
    do: 
      - exists: []
        assert: null
"
`);
});
