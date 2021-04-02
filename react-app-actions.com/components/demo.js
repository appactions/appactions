const yaml = `description: General user flows.
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
`;

function Demo() {
    return (
        <div className="block overflow-hidden font-mono bg-gray-800 border rounded-xl w-192">
            <div className="block w-full h-8 pl-2 bg-gray-700">
                <span className="inline-block w-4 h-4 my-2 ml-2 bg-red-400 rounded-full"></span>
                <span className="inline-block w-4 h-4 my-2 ml-2 bg-yellow-300 rounded-full"></span>
                <span className="inline-block w-4 h-4 my-2 ml-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="py-2 overflow-y-scroll text-gray-200 pl-14 h-96">
                <ol className="list-decimal">
                    {yaml.split('\n').map((line, index) => (
                        <li key={index}>{line.replace(/ /g, '\u00a0')}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default Demo;
