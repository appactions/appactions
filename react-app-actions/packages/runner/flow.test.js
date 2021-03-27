import { parse, flatten, resolve } from './flow';

const flow = content => resolve(flatten(parse({ content })));

test('should work', () => {
    const output = flow(`
    description: General user flows.
    variants: [regular, owner]
    usage: 100%
    data:
      { user, restaurant }: generate.js
    start:
      route: '/'
      auth: false
    steps:
      - with: document
        assert: [title, toBe, Restaurant Reviewer]
      - with: { button: Sign in }
        do: click
      - with: { input: Email }
        do: { type: $data.user.email }
      - with: { button: Sign in with TestLogin }
        do: click
      - with: { heading: Welcome to Restaurant Reviewer! }
      - switch:
        { variant: regular }:
          - with: { input: Restaurant goer }
            do: click
        { variant: owner }:
          - with: { input: Restaurant owner }
            do: click
      - with: { button: Continue }
        do: click
    `);

    expect(output).toMatchSnapshot();
});
