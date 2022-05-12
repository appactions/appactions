var spacing = '  ';

function getType(obj) {
    var type = typeof obj;
    if (Array.isArray(obj)) {
        return 'array';
    } else if (type == 'string') {
        return 'string';
    } else if (type == 'boolean') {
        return 'boolean';
    } else if (type == 'number') {
        return 'number';
    } else if (type == 'undefined' || obj === null) {
        return 'null';
    } else {
        return 'hash';
    }
}

function convert(obj, ret) {
    var type = getType(obj);

    switch (type) {
        case 'array':
            if (isPrimitiveArray(obj)) {
                ret.push(`[${obj.map(v => v === null ? 'null' : v).join(', ')}]`);
            } else {
                convertArray(obj, ret);
            }
            break;
        case 'hash':
            if (isPrimitiveObject(obj)) {
                const entries = Object.entries(obj);
                ret.push(`{ ${entries[0][0]}: ${entries[0][1]} }`);
            } else {
                convertHash(obj, ret);
            }
            break;
        case 'string':
            convertString(obj, ret);
            break;
        case 'null':
            ret.push('null');
            break;
        case 'number':
            ret.push(obj.toString());
            break;
        case 'boolean':
            ret.push(obj ? 'true' : 'false');
            break;
    }
}

function isPrimitive(obj) {
    var type = getType(obj);

    switch (type) {
        case 'string':
        case 'null':
        case 'number':
        case 'boolean':
            return true;
        default:
            return false;
    }
}

function isPrimitiveArray(obj) {
    if (getType(obj) !== 'array') {
        return false;
    }
    return obj.every(isPrimitive);
}

function isPrimitiveObject(obj) {
    if (getType(obj) !== 'hash') {
        return false;
    }
    const entries = Object.entries(obj);
    return entries.length === 1 && isPrimitive(entries[0][0]) && isPrimitive(entries[0][1]);
}

function convertArray(obj, ret) {
    if (obj.length === 0) {
        ret.push('[]');
    }
    for (var i = 0; i < obj.length; i++) {
        var ele = obj[i];
        var recurse = [];
        convert(ele, recurse);

        for (var j = 0; j < recurse.length; j++) {
            ret.push((j == 0 ? '- ' : spacing) + recurse[j]);
        }
    }
}

function convertHash(obj, ret) {
    for (var k in obj) {
        var recurse = [];
        if (obj.hasOwnProperty(k)) {
            var ele = obj[k];

            convert(ele, recurse, k);

            var type = getType(ele);
            if (
                type == 'string' ||
                type == 'null' ||
                type == 'number' ||
                type == 'boolean' ||
                isPrimitiveArray(ele) ||
                isPrimitiveObject(ele)
            ) {
                ret.push(normalizeString(k) + ': ' + recurse[0]);
            } else {
                ret.push(normalizeString(k) + ': ');
                for (var i = 0; i < recurse.length; i++) {
                    ret.push(spacing + recurse[i]);
                }
            }
        }
    }
}

function normalizeString(str) {
    if (str.match(/^[\w]+$/)) {
        return str;
    } else {
        return `"${str}"`;
    }

    // TODO this seeps like unnecessary escaping?

    // if (str.match(/^[\w]+$/)) {
    //     return str;
    // } else {
    //     return '"' + escape(str).replace(/%u/g, '\\u').replace(/%U/g, '\\U').replace(/%/g, '\\x') + '"';
    // }
}

function convertString(obj, ret) {
    ret.push(normalizeString(obj));
}

export default function json2yaml(obj) {
    if (typeof obj == 'string') {
        obj = JSON.parse(obj);
    }

    var ret = [];
    convert(obj, ret);
    return ret.join('\n').concat('\n');
}
