import { getRole } from './dispatch';

test('native roles', () => {
    document.body.innerHTML = `
<div>
    <h1>Sign <em>up</em></h1>
    <button>Sign in</button>
    <article>foo</article>
    <input type="checkbox" />
    <input type="search" />
    <input type="search" list="foo" />
    <table>
        <tr>
            <th>Foo</th>
        </tr>
        <tr>
            <td>Bar</td>
        </tr>
        <tr>
    </table>
</div>
    `;

    const allElements = Array.from(document.querySelectorAll('body *'));
    const result = allElements.map(el => {
        return {
            nodeName: el.nodeName,
            outerHTML: el.outerHTML.replace(/>\s*</g, '><'),
            role: getRole(el),
        };
    });

    expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "nodeName": "DIV",
            "outerHTML": "<div><h1>Sign <em>up</em></h1><button>Sign in</button><article>foo</article><input type=\\"checkbox\\"><input type=\\"search\\"><input type=\\"search\\" list=\\"foo\\"><table><tbody><tr><th>Foo</th></tr><tr><td>Bar</td></tr><tr></tr></tbody></table></div>",
            "role": null,
          },
          Object {
            "nodeName": "H1",
            "outerHTML": "<h1>Sign <em>up</em></h1>",
            "role": "heading",
          },
          Object {
            "nodeName": "EM",
            "outerHTML": "<em>up</em>",
            "role": null,
          },
          Object {
            "nodeName": "BUTTON",
            "outerHTML": "<button>Sign in</button>",
            "role": "button",
          },
          Object {
            "nodeName": "ARTICLE",
            "outerHTML": "<article>foo</article>",
            "role": "article",
          },
          Object {
            "nodeName": "INPUT",
            "outerHTML": "<input type=\\"checkbox\\">",
            "role": "checkbox",
          },
          Object {
            "nodeName": "INPUT",
            "outerHTML": "<input type=\\"search\\">",
            "role": "searchbox",
          },
          Object {
            "nodeName": "INPUT",
            "outerHTML": "<input type=\\"search\\" list=\\"foo\\">",
            "role": "combobox",
          },
          Object {
            "nodeName": "TABLE",
            "outerHTML": "<table><tbody><tr><th>Foo</th></tr><tr><td>Bar</td></tr><tr></tr></tbody></table>",
            "role": "table",
          },
          Object {
            "nodeName": "TBODY",
            "outerHTML": "<tbody><tr><th>Foo</th></tr><tr><td>Bar</td></tr><tr></tr></tbody>",
            "role": "rowgroup",
          },
          Object {
            "nodeName": "TR",
            "outerHTML": "<tr><th>Foo</th></tr>",
            "role": "row",
          },
          Object {
            "nodeName": "TH",
            "outerHTML": "<th>Foo</th>",
            "role": "columnheader",
          },
          Object {
            "nodeName": "TR",
            "outerHTML": "<tr><td>Bar</td></tr>",
            "role": "row",
          },
          Object {
            "nodeName": "TD",
            "outerHTML": "<td>Bar</td>",
            "role": "cell",
          },
          Object {
            "nodeName": "TR",
            "outerHTML": "<tr></tr>",
            "role": "row",
          },
        ]
    `);
});
