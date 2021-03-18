'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function unwrapExports(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
    return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';

const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;

var constants = {
    SEMVER_SPEC_VERSION,
    MAX_LENGTH,
    MAX_SAFE_INTEGER,
    MAX_SAFE_COMPONENT_LENGTH,
};

const debug =
    typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)
        ? (...args) => console.error('SEMVER', ...args)
        : () => {};

var debug_1 = debug;

var re_1 = createCommonjsModule(function (module, exports) {
    const { MAX_SAFE_COMPONENT_LENGTH } = constants;

    exports = module.exports = {};

    // The actual regexps go on exports.re
    const re = (exports.re = []);
    const src = (exports.src = []);
    const t = (exports.t = {});
    let R = 0;

    const createToken = (name, value, isGlobal) => {
        const index = R++;
        debug_1(index, value);
        t[name] = index;
        src[index] = value;
        re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    };

    // The following Regular Expressions can be used for tokenizing,
    // validating, and parsing SemVer version strings.

    // ## Numeric Identifier
    // A single `0`, or a non-zero digit followed by zero or more digits.

    createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
    createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');

    // ## Non-numeric Identifier
    // Zero or more digits, followed by a letter or hyphen, and then zero or
    // more letters, digits, or hyphens.

    createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');

    // ## Main Version
    // Three dot-separated numeric identifiers.

    createToken(
        'MAINVERSION',
        `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`,
    );

    createToken(
        'MAINVERSIONLOOSE',
        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
            `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
            `(${src[t.NUMERICIDENTIFIERLOOSE]})`,
    );

    // ## Pre-release Version Identifier
    // A numeric identifier, or a non-numeric identifier.

    createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);

    createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);

    // ## Pre-release Version
    // Hyphen, followed by one or more dot-separated pre-release version
    // identifiers.

    createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

    createToken(
        'PRERELEASELOOSE',
        `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`,
    );

    // ## Build Metadata Identifier
    // Any combination of digits, letters, or hyphens.

    createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');

    // ## Build Metadata
    // Plus sign, followed by one or more period-separated build metadata
    // identifiers.

    createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

    // ## Full Version String
    // A main version, followed optionally by a pre-release version and
    // build metadata.

    // Note that the only major, minor, patch, and pre-release sections of
    // the version string are capturing groups.  The build metadata is not a
    // capturing group, because it should not ever be used in version
    // comparison.

    createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);

    createToken('FULL', `^${src[t.FULLPLAIN]}$`);

    // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
    // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
    // common in the npm registry.
    createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);

    createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

    createToken('GTLT', '((?:<|>)?=?)');

    // Something like "2.*" or "1.2.x".
    // Note that "x.x" is a valid xRange identifer, meaning "any version"
    // Only the first item is strictly required.
    createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

    createToken(
        'XRANGEPLAIN',
        `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
            `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
            `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
            `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` +
            `)?)?`,
    );

    createToken(
        'XRANGEPLAINLOOSE',
        `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
            `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
            `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
            `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` +
            `)?)?`,
    );

    createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

    // Coercion.
    // Extract anything that could conceivably be a part of a valid semver
    createToken(
        'COERCE',
        `${'(^|[^\\d])' + '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
            `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
            `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
            `(?:$|[^\\d])`,
    );
    createToken('COERCERTL', src[t.COERCE], true);

    // Tilde ranges.
    // Meaning is "reasonably at or greater than"
    createToken('LONETILDE', '(?:~>?)');

    createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = '$1~';

    createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

    // Caret ranges.
    // Meaning is "at least and backwards compatible with"
    createToken('LONECARET', '(?:\\^)');

    createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = '$1^';

    createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

    // A simple gt/lt/eq thing, or just "" to indicate "any version"
    createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

    // An expression to strip any whitespace between the gtlt and the thing
    // it modifies, so that `> 1.2.3` ==> `>1.2.3`
    createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = '$1$2$3';

    // Something like `1.2.3 - 1.2.4`
    // Note that these all use the loose form, because they'll be
    // checked against either the strict or loose comparator form
    // later.
    createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);

    createToken(
        'HYPHENRANGELOOSE',
        `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`,
    );

    // Star ranges basically just allow anything at all.
    createToken('STAR', '(<|>)?=?\\s*\\*');
});
var re_2 = re_1.re;
var re_3 = re_1.src;
var re_4 = re_1.t;
var re_5 = re_1.tildeTrimReplace;
var re_6 = re_1.caretTrimReplace;
var re_7 = re_1.comparatorTrimReplace;

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b) => {
    const anum = numeric.test(a);
    const bnum = numeric.test(b);

    if (anum && bnum) {
        a = +a;
        b = +b;
    }

    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);

var identifiers = {
    compareIdentifiers,
    rcompareIdentifiers,
};

const { MAX_LENGTH: MAX_LENGTH$1, MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1 } = constants;
const { re, t } = re_1;

const { compareIdentifiers: compareIdentifiers$1 } = identifiers;
class SemVer {
    constructor(version, options) {
        if (!options || typeof options !== 'object') {
            options = {
                loose: !!options,
                includePrerelease: false,
            };
        }
        if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
                return version;
            } else {
                version = version.version;
            }
        } else if (typeof version !== 'string') {
            throw new TypeError(`Invalid Version: ${version}`);
        }

        if (version.length > MAX_LENGTH$1) {
            throw new TypeError(`version is longer than ${MAX_LENGTH$1} characters`);
        }

        debug_1('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;

        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

        if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
        }

        this.raw = version;

        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];

        if (this.major > MAX_SAFE_INTEGER$1 || this.major < 0) {
            throw new TypeError('Invalid major version');
        }

        if (this.minor > MAX_SAFE_INTEGER$1 || this.minor < 0) {
            throw new TypeError('Invalid minor version');
        }

        if (this.patch > MAX_SAFE_INTEGER$1 || this.patch < 0) {
            throw new TypeError('Invalid patch version');
        }

        // numberify any prerelease numeric ids
        if (!m[4]) {
            this.prerelease = [];
        } else {
            this.prerelease = m[4].split('.').map(id => {
                if (/^[0-9]+$/.test(id)) {
                    const num = +id;
                    if (num >= 0 && num < MAX_SAFE_INTEGER$1) {
                        return num;
                    }
                }
                return id;
            });
        }

        this.build = m[5] ? m[5].split('.') : [];
        this.format();
    }

    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
    }

    toString() {
        return this.version;
    }

    compare(other) {
        debug_1('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof SemVer)) {
            if (typeof other === 'string' && other === this.version) {
                return 0;
            }
            other = new SemVer(other, this.options);
        }

        if (other.version === this.version) {
            return 0;
        }

        return this.compareMain(other) || this.comparePre(other);
    }

    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }

        return (
            compareIdentifiers$1(this.major, other.major) ||
            compareIdentifiers$1(this.minor, other.minor) ||
            compareIdentifiers$1(this.patch, other.patch)
        );
    }

    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }

        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }

        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug_1('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers$1(a, b);
            }
        } while (++i);
    }

    compareBuild(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }

        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            debug_1('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers$1(a, b);
            }
        } while (++i);
    }

    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier) {
        switch (release) {
            case 'premajor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc('pre', identifier);
                break;
            case 'preminor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc('pre', identifier);
                break;
            case 'prepatch':
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc('patch', identifier);
                this.inc('pre', identifier);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case 'prerelease':
                if (this.prerelease.length === 0) {
                    this.inc('patch', identifier);
                }
                this.inc('pre', identifier);
                break;

            case 'major':
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                    this.major++;
                }
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'minor':
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) {
                    this.minor++;
                }
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'patch':
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) {
                    this.patch++;
                }
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case 'pre':
                if (this.prerelease.length === 0) {
                    this.prerelease = [0];
                } else {
                    let i = this.prerelease.length;
                    while (--i >= 0) {
                        if (typeof this.prerelease[i] === 'number') {
                            this.prerelease[i]++;
                            i = -2;
                        }
                    }
                    if (i === -1) {
                        // didn't increment anything
                        this.prerelease.push(0);
                    }
                }
                if (identifier) {
                    // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                    // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                    if (this.prerelease[0] === identifier) {
                        if (isNaN(this.prerelease[1])) {
                            this.prerelease = [identifier, 0];
                        }
                    } else {
                        this.prerelease = [identifier, 0];
                    }
                }
                break;

            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.format();
        this.raw = this.version;
        return this;
    }
}

var semver = SemVer;

const { MAX_LENGTH: MAX_LENGTH$2 } = constants;
const { re: re$1, t: t$1 } = re_1;

const parse = (version, options) => {
    if (!options || typeof options !== 'object') {
        options = {
            loose: !!options,
            includePrerelease: false,
        };
    }

    if (version instanceof semver) {
        return version;
    }

    if (typeof version !== 'string') {
        return null;
    }

    if (version.length > MAX_LENGTH$2) {
        return null;
    }

    const r = options.loose ? re$1[t$1.LOOSE] : re$1[t$1.FULL];
    if (!r.test(version)) {
        return null;
    }

    try {
        return new semver(version, options);
    } catch (er) {
        return null;
    }
};

var parse_1 = parse;

const valid = (version, options) => {
    const v = parse_1(version, options);
    return v ? v.version : null;
};
var valid_1 = valid;

const clean = (version, options) => {
    const s = parse_1(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null;
};
var clean_1 = clean;

const inc = (version, release, options, identifier) => {
    if (typeof options === 'string') {
        identifier = options;
        options = undefined;
    }

    try {
        return new semver(version, options).inc(release, identifier).version;
    } catch (er) {
        return null;
    }
};
var inc_1 = inc;

const compare = (a, b, loose) => new semver(a, loose).compare(new semver(b, loose));

var compare_1 = compare;

const eq = (a, b, loose) => compare_1(a, b, loose) === 0;
var eq_1 = eq;

const diff = (version1, version2) => {
    if (eq_1(version1, version2)) {
        return null;
    } else {
        const v1 = parse_1(version1);
        const v2 = parse_1(version2);
        const hasPre = v1.prerelease.length || v2.prerelease.length;
        const prefix = hasPre ? 'pre' : '';
        const defaultResult = hasPre ? 'prerelease' : '';
        for (const key in v1) {
            if (key === 'major' || key === 'minor' || key === 'patch') {
                if (v1[key] !== v2[key]) {
                    return prefix + key;
                }
            }
        }
        return defaultResult; // may be undefined
    }
};
var diff_1 = diff;

const major = (a, loose) => new semver(a, loose).major;
var major_1 = major;

const minor = (a, loose) => new semver(a, loose).minor;
var minor_1 = minor;

const patch = (a, loose) => new semver(a, loose).patch;
var patch_1 = patch;

const prerelease = (version, options) => {
    const parsed = parse_1(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
var prerelease_1 = prerelease;

const rcompare = (a, b, loose) => compare_1(b, a, loose);
var rcompare_1 = rcompare;

const compareLoose = (a, b) => compare_1(a, b, true);
var compareLoose_1 = compareLoose;

const compareBuild = (a, b, loose) => {
    const versionA = new semver(a, loose);
    const versionB = new semver(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
var compareBuild_1 = compareBuild;

const sort = (list, loose) => list.sort((a, b) => compareBuild_1(a, b, loose));
var sort_1 = sort;

const rsort = (list, loose) => list.sort((a, b) => compareBuild_1(b, a, loose));
var rsort_1 = rsort;

const gt = (a, b, loose) => compare_1(a, b, loose) > 0;
var gt_1 = gt;

const lt = (a, b, loose) => compare_1(a, b, loose) < 0;
var lt_1 = lt;

const neq = (a, b, loose) => compare_1(a, b, loose) !== 0;
var neq_1 = neq;

const gte = (a, b, loose) => compare_1(a, b, loose) >= 0;
var gte_1 = gte;

const lte = (a, b, loose) => compare_1(a, b, loose) <= 0;
var lte_1 = lte;

const cmp = (a, op, b, loose) => {
    switch (op) {
        case '===':
            if (typeof a === 'object') a = a.version;
            if (typeof b === 'object') b = b.version;
            return a === b;

        case '!==':
            if (typeof a === 'object') a = a.version;
            if (typeof b === 'object') b = b.version;
            return a !== b;

        case '':
        case '=':
        case '==':
            return eq_1(a, b, loose);

        case '!=':
            return neq_1(a, b, loose);

        case '>':
            return gt_1(a, b, loose);

        case '>=':
            return gte_1(a, b, loose);

        case '<':
            return lt_1(a, b, loose);

        case '<=':
            return lte_1(a, b, loose);

        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }
};
var cmp_1 = cmp;

const { re: re$2, t: t$2 } = re_1;

const coerce = (version, options) => {
    if (version instanceof semver) {
        return version;
    }

    if (typeof version === 'number') {
        version = String(version);
    }

    if (typeof version !== 'string') {
        return null;
    }

    options = options || {};

    let match = null;
    if (!options.rtl) {
        match = version.match(re$2[t$2.COERCE]);
    } else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        let next;
        while (
            (next = re$2[t$2.COERCERTL].exec(version)) &&
            (!match || match.index + match[0].length !== version.length)
        ) {
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
                match = next;
            }
            re$2[t$2.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        re$2[t$2.COERCERTL].lastIndex = -1;
    }

    if (match === null) return null;

    return parse_1(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options);
};
var coerce_1 = coerce;

// hoisted class for cyclic dependency
class Range {
    constructor(range, options) {
        if (!options || typeof options !== 'object') {
            options = {
                loose: !!options,
                includePrerelease: false,
            };
        }

        if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
                return range;
            } else {
                return new Range(range.raw, options);
            }
        }

        if (range instanceof comparator) {
            // just put it in the set and return
            this.raw = range.value;
            this.set = [[range]];
            this.format();
            return this;
        }

        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;

        // First, split based on boolean or ||
        this.raw = range;
        this.set = range
            .split(/\s*\|\|\s*/)
            // map the range to a 2d array of comparators
            .map(range => this.parseRange(range.trim()))
            // throw out any comparator lists that are empty
            // this generally means that it was not a valid range, which is allowed
            // in loose mode, but will still throw if the WHOLE range is invalid.
            .filter(c => c.length);

        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${range}`);
        }

        this.format();
    }

    format() {
        this.range = this.set
            .map(comps => {
                return comps.join(' ').trim();
            })
            .join('||')
            .trim();
        return this.range;
    }

    toString() {
        return this.range;
    }

    parseRange(range) {
        const loose = this.options.loose;
        range = range.trim();
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re$3[t$3.HYPHENRANGELOOSE] : re$3[t$3.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace);
        debug_1('hyphen replace', range);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = range.replace(re$3[t$3.COMPARATORTRIM], comparatorTrimReplace);
        debug_1('comparator trim', range, re$3[t$3.COMPARATORTRIM]);

        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re$3[t$3.TILDETRIM], tildeTrimReplace);

        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re$3[t$3.CARETTRIM], caretTrimReplace);

        // normalize spaces
        range = range.split(/\s+/).join(' ');

        // At this point, the range is completely trimmed and
        // ready to be split into comparators.

        const compRe = loose ? re$3[t$3.COMPARATORLOOSE] : re$3[t$3.COMPARATOR];
        return (
            range
                .split(' ')
                .map(comp => parseComparator(comp, this.options))
                .join(' ')
                .split(/\s+/)
                // in loose mode, throw out any that are not valid comparators
                .filter(this.options.loose ? comp => !!comp.match(compRe) : () => true)
                .map(comp => new comparator(comp, this.options))
        );
    }

    intersects(range, options) {
        if (!(range instanceof Range)) {
            throw new TypeError('a Range is required');
        }

        return this.set.some(thisComparators => {
            return (
                isSatisfiable(thisComparators, options) &&
                range.set.some(rangeComparators => {
                    return (
                        isSatisfiable(rangeComparators, options) &&
                        thisComparators.every(thisComparator => {
                            return rangeComparators.every(rangeComparator => {
                                return thisComparator.intersects(rangeComparator, options);
                            });
                        })
                    );
                })
            );
        });
    }

    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }

        if (typeof version === 'string') {
            try {
                version = new semver(version, this.options);
            } catch (er) {
                return false;
            }
        }

        for (let i = 0; i < this.set.length; i++) {
            if (testSet(this.set[i], version, this.options)) {
                return true;
            }
        }
        return false;
    }
}
var range = Range;

const { re: re$3, t: t$3, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = re_1;

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();

    while (result && remainingComparators.length) {
        result = remainingComparators.every(otherComparator => {
            return testComparator.intersects(otherComparator, options);
        });

        testComparator = remainingComparators.pop();
    }

    return result;
};

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
    debug_1('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug_1('caret', comp);
    comp = replaceTildes(comp, options);
    debug_1('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug_1('xrange', comp);
    comp = replaceStars(comp, options);
    debug_1('stars', comp);
    return comp;
};

const isX = id => !id || id.toLowerCase() === 'x' || id === '*';

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
const replaceTildes = (comp, options) =>
    comp
        .trim()
        .split(/\s+/)
        .map(comp => {
            return replaceTilde(comp, options);
        })
        .join(' ');

const replaceTilde = (comp, options) => {
    const r = options.loose ? re$3[t$3.TILDELOOSE] : re$3[t$3.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
        debug_1('tilde', comp, _, M, m, p, pr);
        let ret;

        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0`;
        } else if (pr) {
            debug_1('replaceTilde pr', pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0`;
        }

        debug_1('tilde return', ret);
        return ret;
    });
};

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
const replaceCarets = (comp, options) =>
    comp
        .trim()
        .split(/\s+/)
        .map(comp => {
            return replaceCaret(comp, options);
        })
        .join(' ');

const replaceCaret = (comp, options) => {
    debug_1('caret', comp, options);
    const r = options.loose ? re$3[t$3.CARETLOOSE] : re$3[t$3.CARET];
    return comp.replace(r, (_, M, m, p, pr) => {
        debug_1('caret', comp, _, M, m, p, pr);
        let ret;

        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0`;
        } else if (isX(p)) {
            if (M === '0') {
                ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0`;
            } else {
                ret = `>=${M}.${m}.0 <${+M + 1}.0.0`;
            }
        } else if (pr) {
            debug_1('replaceCaret pr', pr);
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0`;
            }
        } else {
            debug_1('no pr');
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}`;
                } else {
                    ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0`;
            }
        }

        debug_1('caret return', ret);
        return ret;
    });
};

const replaceXRanges = (comp, options) => {
    debug_1('replaceXRanges', comp, options);
    return comp
        .split(/\s+/)
        .map(comp => {
            return replaceXRange(comp, options);
        })
        .join(' ');
};

const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re$3[t$3.XRANGELOOSE] : re$3[t$3.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug_1('xRange', comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;

        if (gtlt === '=' && anyX) {
            gtlt = '';
        }

        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? '-0' : '';

        if (xM) {
            if (gtlt === '>' || gtlt === '<') {
                // nothing is allowed
                ret = '<0.0.0-0';
            } else {
                // nothing is forbidden
                ret = '*';
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;

            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }

            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0${pr}`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0${pr}`;
        }

        debug_1('xRange return', ret);

        return ret;
    });
};

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
    debug_1('replaceStars', comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re$3[t$3.STAR], '');
};

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
const hyphenReplace = ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) => {
    if (isX(fM)) {
        from = '';
    } else if (isX(fm)) {
        from = `>=${fM}.0.0`;
    } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0`;
    } else {
        from = `>=${from}`;
    }

    if (isX(tM)) {
        to = '';
    } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0`;
    } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0`;
    } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else {
        to = `<=${to}`;
    }

    return `${from} ${to}`.trim();
};

const testSet = (set, version, options) => {
    for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
            return false;
        }
    }

    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for (let i = 0; i < set.length; i++) {
            debug_1(set[i].semver);
            if (set[i].semver === comparator.ANY) {
                continue;
            }

            if (set[i].semver.prerelease.length > 0) {
                const allowed = set[i].semver;
                if (
                    allowed.major === version.major &&
                    allowed.minor === version.minor &&
                    allowed.patch === version.patch
                ) {
                    return true;
                }
            }
        }

        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }

    return true;
};

const ANY = Symbol('SemVer ANY');
// hoisted class for cyclic dependency
class Comparator {
    static get ANY() {
        return ANY;
    }
    constructor(comp, options) {
        if (!options || typeof options !== 'object') {
            options = {
                loose: !!options,
                includePrerelease: false,
            };
        }

        if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
                return comp;
            } else {
                comp = comp.value;
            }
        }

        debug_1('comparator', comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);

        if (this.semver === ANY) {
            this.value = '';
        } else {
            this.value = this.operator + this.semver.version;
        }

        debug_1('comp', this);
    }

    parse(comp) {
        const r = this.options.loose ? re$4[t$4.COMPARATORLOOSE] : re$4[t$4.COMPARATOR];
        const m = comp.match(r);

        if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }

        this.operator = m[1] !== undefined ? m[1] : '';
        if (this.operator === '=') {
            this.operator = '';
        }

        // if it literally is just '>' or '' then allow anything.
        if (!m[2]) {
            this.semver = ANY;
        } else {
            this.semver = new semver(m[2], this.options.loose);
        }
    }

    toString() {
        return this.value;
    }

    test(version) {
        debug_1('Comparator.test', version, this.options.loose);

        if (this.semver === ANY || version === ANY) {
            return true;
        }

        if (typeof version === 'string') {
            try {
                version = new semver(version, this.options);
            } catch (er) {
                return false;
            }
        }

        return cmp_1(version, this.operator, this.semver, this.options);
    }

    intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
            throw new TypeError('a Comparator is required');
        }

        if (!options || typeof options !== 'object') {
            options = {
                loose: !!options,
                includePrerelease: false,
            };
        }

        if (this.operator === '') {
            if (this.value === '') {
                return true;
            }
            return new range(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
            if (comp.value === '') {
                return true;
            }
            return new range(this.value, options).test(comp.semver);
        }

        const sameDirectionIncreasing =
            (this.operator === '>=' || this.operator === '>') && (comp.operator === '>=' || comp.operator === '>');
        const sameDirectionDecreasing =
            (this.operator === '<=' || this.operator === '<') && (comp.operator === '<=' || comp.operator === '<');
        const sameSemVer = this.semver.version === comp.semver.version;
        const differentDirectionsInclusive =
            (this.operator === '>=' || this.operator === '<=') && (comp.operator === '>=' || comp.operator === '<=');
        const oppositeDirectionsLessThan =
            cmp_1(this.semver, '<', comp.semver, options) &&
            (this.operator === '>=' || this.operator === '>') &&
            (comp.operator === '<=' || comp.operator === '<');
        const oppositeDirectionsGreaterThan =
            cmp_1(this.semver, '>', comp.semver, options) &&
            (this.operator === '<=' || this.operator === '<') &&
            (comp.operator === '>=' || comp.operator === '>');

        return (
            sameDirectionIncreasing ||
            sameDirectionDecreasing ||
            (sameSemVer && differentDirectionsInclusive) ||
            oppositeDirectionsLessThan ||
            oppositeDirectionsGreaterThan
        );
    }
}

var comparator = Comparator;

const { re: re$4, t: t$4 } = re_1;

const satisfies = (version, range$1, options) => {
    try {
        range$1 = new range(range$1, options);
    } catch (er) {
        return false;
    }
    return range$1.test(version);
};
var satisfies_1 = satisfies;

// Mostly just for testing and legacy API reasons
const toComparators = (range$1, options) =>
    new range(range$1, options).set.map(comp =>
        comp
            .map(c => c.value)
            .join(' ')
            .trim()
            .split(' '),
    );

var toComparators_1 = toComparators;

const maxSatisfying = (versions, range$1, options) => {
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
        rangeObj = new range(range$1, options);
    } catch (er) {
        return null;
    }
    versions.forEach(v => {
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new semver(max, options);
            }
        }
    });
    return max;
};
var maxSatisfying_1 = maxSatisfying;

const minSatisfying = (versions, range$1, options) => {
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
        rangeObj = new range(range$1, options);
    } catch (er) {
        return null;
    }
    versions.forEach(v => {
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new semver(min, options);
            }
        }
    });
    return min;
};
var minSatisfying_1 = minSatisfying;

const minVersion = (range$1, loose) => {
    range$1 = new range(range$1, loose);

    let minver = new semver('0.0.0');
    if (range$1.test(minver)) {
        return minver;
    }

    minver = new semver('0.0.0-0');
    if (range$1.test(minver)) {
        return minver;
    }

    minver = null;
    for (let i = 0; i < range$1.set.length; ++i) {
        const comparators = range$1.set[i];

        comparators.forEach(comparator => {
            // Clone to avoid manipulating the comparator's semver object.
            const compver = new semver(comparator.semver.version);
            switch (comparator.operator) {
                case '>':
                    if (compver.prerelease.length === 0) {
                        compver.patch++;
                    } else {
                        compver.prerelease.push(0);
                    }
                    compver.raw = compver.format();
                /* fallthrough */
                case '':
                case '>=':
                    if (!minver || gt_1(minver, compver)) {
                        minver = compver;
                    }
                    break;
                case '<':
                case '<=':
                    /* Ignore maximum versions */
                    break;
                /* istanbul ignore next */
                default:
                    throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
        });
    }

    if (minver && range$1.test(minver)) {
        return minver;
    }

    return null;
};
var minVersion_1 = minVersion;

const validRange = (range$1, options) => {
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new range(range$1, options).range || '*';
    } catch (er) {
        return null;
    }
};
var valid$1 = validRange;

const { ANY: ANY$1 } = comparator;

const outside = (version, range$1, hilo, options) => {
    version = new semver(version, options);
    range$1 = new range(range$1, options);

    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
        case '>':
            gtfn = gt_1;
            ltefn = lte_1;
            ltfn = lt_1;
            comp = '>';
            ecomp = '>=';
            break;
        case '<':
            gtfn = lt_1;
            ltefn = gte_1;
            ltfn = gt_1;
            comp = '<';
            ecomp = '<=';
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }

    // If it satisifes the range it is not outside
    if (satisfies_1(version, range$1, options)) {
        return false;
    }

    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.

    for (let i = 0; i < range$1.set.length; ++i) {
        const comparators = range$1.set[i];

        let high = null;
        let low = null;

        comparators.forEach(comparator$1 => {
            if (comparator$1.semver === ANY$1) {
                comparator$1 = new comparator('>=0.0.0');
            }
            high = high || comparator$1;
            low = low || comparator$1;
            if (gtfn(comparator$1.semver, high.semver, options)) {
                high = comparator$1;
            } else if (ltfn(comparator$1.semver, low.semver, options)) {
                low = comparator$1;
            }
        });

        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) {
            return false;
        }

        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
        }
    }
    return true;
};

var outside_1 = outside;

// Determine if version is greater than all the versions possible in the range.

const gtr = (version, range, options) => outside_1(version, range, '>', options);
var gtr_1 = gtr;

// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside_1(version, range, '<', options);
var ltr_1 = ltr;

const intersects = (r1, r2, options) => {
    r1 = new range(r1, options);
    r2 = new range(r2, options);
    return r1.intersects(r2);
};
var intersects_1 = intersects;

// just pre-load all the stuff that index.js lazily exports

var semver$1 = {
    re: re_1.re,
    src: re_1.src,
    tokens: re_1.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    SemVer: semver,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers,
    parse: parse_1,
    valid: valid_1,
    clean: clean_1,
    inc: inc_1,
    diff: diff_1,
    major: major_1,
    minor: minor_1,
    patch: patch_1,
    prerelease: prerelease_1,
    compare: compare_1,
    rcompare: rcompare_1,
    compareLoose: compareLoose_1,
    compareBuild: compareBuild_1,
    sort: sort_1,
    rsort: rsort_1,
    gt: gt_1,
    lt: lt_1,
    eq: eq_1,
    neq: neq_1,
    gte: gte_1,
    lte: lte_1,
    cmp: cmp_1,
    coerce: coerce_1,
    Comparator: comparator,
    Range: range,
    satisfies: satisfies_1,
    toComparators: toComparators_1,
    maxSatisfying: maxSatisfying_1,
    minSatisfying: minSatisfying_1,
    minVersion: minVersion_1,
    validRange: valid$1,
    outside: outside_1,
    gtr: gtr_1,
    ltr: ltr_1,
    intersects: intersects_1,
};
var semver_27 = semver$1.gte;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
// WARNING
// The values below are referenced by ComponentFilters (which are saved via localStorage).
// Do not change them or it will break previously saved user customizations.
// If new element types are added, use new numbers rather than re-ordering existing ones.
//
// Changing these types is also a backwards breaking change for the standalone shell,
// since the frontend and backend must share the same values-
// and the backend is embedded in certain environments (like React Native).
const ElementTypeClass = 1;
const ElementTypeContext = 2;
const ElementTypeFunction = 5;
const ElementTypeForwardRef = 6;
const ElementTypeHostComponent = 7;
const ElementTypeMemo = 8;
const ElementTypeOtherOrUnknown = 9;
const ElementTypeProfiler = 10;
const ElementTypeRoot = 11;
const ElementTypeSuspense = 12;
const ElementTypeSuspenseList = 13; // Different types of elements displayed in the Elements tree.
// These types may be used to visually distinguish types,
// or to enable/disable certain functionality.

// WARNING
// The values below are referenced by ComponentFilters (which are saved via localStorage).
// Do not change them or it will break previously saved user customizations.
// If new filter types are added, use new numbers rather than re-ordering existing ones.
const ComponentFilterElementType = 1;
const ComponentFilterDisplayName = 2;
const ComponentFilterLocation = 3;
const ComponentFilterHOC = 4;

var iterator = function (Yallist) {
    Yallist.prototype[Symbol.iterator] = function* () {
        for (let walker = this.head; walker; walker = walker.next) {
            yield walker.value;
        }
    };
};

var yallist = Yallist;

Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist(list) {
    var self = this;
    if (!(self instanceof Yallist)) {
        self = new Yallist();
    }

    self.tail = null;
    self.head = null;
    self.length = 0;

    if (list && typeof list.forEach === 'function') {
        list.forEach(function (item) {
            self.push(item);
        });
    } else if (arguments.length > 0) {
        for (var i = 0, l = arguments.length; i < l; i++) {
            self.push(arguments[i]);
        }
    }

    return self;
}

Yallist.prototype.removeNode = function (node) {
    if (node.list !== this) {
        throw new Error('removing node which does not belong to this list');
    }

    var next = node.next;
    var prev = node.prev;

    if (next) {
        next.prev = prev;
    }

    if (prev) {
        prev.next = next;
    }

    if (node === this.head) {
        this.head = next;
    }
    if (node === this.tail) {
        this.tail = prev;
    }

    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;

    return next;
};

Yallist.prototype.unshiftNode = function (node) {
    if (node === this.head) {
        return;
    }

    if (node.list) {
        node.list.removeNode(node);
    }

    var head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
        head.prev = node;
    }

    this.head = node;
    if (!this.tail) {
        this.tail = node;
    }
    this.length++;
};

Yallist.prototype.pushNode = function (node) {
    if (node === this.tail) {
        return;
    }

    if (node.list) {
        node.list.removeNode(node);
    }

    var tail = this.tail;
    node.list = this;
    node.prev = tail;
    if (tail) {
        tail.next = node;
    }

    this.tail = node;
    if (!this.head) {
        this.head = node;
    }
    this.length++;
};

Yallist.prototype.push = function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
        push(this, arguments[i]);
    }
    return this.length;
};

Yallist.prototype.unshift = function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
        unshift(this, arguments[i]);
    }
    return this.length;
};

Yallist.prototype.pop = function () {
    if (!this.tail) {
        return undefined;
    }

    var res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
        this.tail.next = null;
    } else {
        this.head = null;
    }
    this.length--;
    return res;
};

Yallist.prototype.shift = function () {
    if (!this.head) {
        return undefined;
    }

    var res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
        this.head.prev = null;
    } else {
        this.tail = null;
    }
    this.length--;
    return res;
};

Yallist.prototype.forEach = function (fn, thisp) {
    thisp = thisp || this;
    for (var walker = this.head, i = 0; walker !== null; i++) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
    }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
    thisp = thisp || this;
    for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
    }
};

Yallist.prototype.get = function (n) {
    for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
        // abort out of the list early if we hit a cycle
        walker = walker.next;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};

Yallist.prototype.getReverse = function (n) {
    for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
        // abort out of the list early if we hit a cycle
        walker = walker.prev;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};

Yallist.prototype.map = function (fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for (var walker = this.head; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
    }
    return res;
};

Yallist.prototype.mapReverse = function (fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for (var walker = this.tail; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
    }
    return res;
};

Yallist.prototype.reduce = function (fn, initial) {
    var acc;
    var walker = this.head;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
    } else {
        throw new TypeError('Reduce of empty list with no initial value');
    }

    for (var i = 0; walker !== null; i++) {
        acc = fn(acc, walker.value, i);
        walker = walker.next;
    }

    return acc;
};

Yallist.prototype.reduceReverse = function (fn, initial) {
    var acc;
    var walker = this.tail;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
    } else {
        throw new TypeError('Reduce of empty list with no initial value');
    }

    for (var i = this.length - 1; walker !== null; i--) {
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
    }

    return acc;
};

Yallist.prototype.toArray = function () {
    var arr = new Array(this.length);
    for (var i = 0, walker = this.head; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.next;
    }
    return arr;
};

Yallist.prototype.toArrayReverse = function () {
    var arr = new Array(this.length);
    for (var i = 0, walker = this.tail; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.prev;
    }
    return arr;
};

Yallist.prototype.slice = function (from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
        walker = walker.next;
    }
    for (; walker !== null && i < to; i++, walker = walker.next) {
        ret.push(walker.value);
    }
    return ret;
};

Yallist.prototype.sliceReverse = function (from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
        walker = walker.prev;
    }
    for (; walker !== null && i > from; i--, walker = walker.prev) {
        ret.push(walker.value);
    }
    return ret;
};

Yallist.prototype.splice = function (start, deleteCount /*, ...nodes */) {
    if (start > this.length) {
        start = this.length - 1;
    }
    if (start < 0) {
        start = this.length + start;
    }

    for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
        walker = walker.next;
    }

    var ret = [];
    for (var i = 0; walker && i < deleteCount; i++) {
        ret.push(walker.value);
        walker = this.removeNode(walker);
    }
    if (walker === null) {
        walker = this.tail;
    }

    if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
    }

    for (var i = 2; i < arguments.length; i++) {
        walker = insert(this, walker, arguments[i]);
    }
    return ret;
};

Yallist.prototype.reverse = function () {
    var head = this.head;
    var tail = this.tail;
    for (var walker = head; walker !== null; walker = walker.prev) {
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
};

function insert(self, node, value) {
    var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);

    if (inserted.next === null) {
        self.tail = inserted;
    }
    if (inserted.prev === null) {
        self.head = inserted;
    }

    self.length++;

    return inserted;
}

function push(self, item) {
    self.tail = new Node(item, self.tail, null, self);
    if (!self.head) {
        self.head = self.tail;
    }
    self.length++;
}

function unshift(self, item) {
    self.head = new Node(item, null, self.head, self);
    if (!self.tail) {
        self.tail = self.head;
    }
    self.length++;
}

function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
    }

    this.list = list;
    this.value = value;

    if (prev) {
        prev.next = this;
        this.prev = prev;
    } else {
        this.prev = null;
    }

    if (next) {
        next.prev = this;
        this.next = next;
    } else {
        this.next = null;
    }
}

try {
    // add if support for Symbol.iterator is present
    iterator(Yallist);
} catch (er) {}

// A linked list to keep track of recently-used-ness

const MAX = Symbol('max');
const LENGTH = Symbol('length');
const LENGTH_CALCULATOR = Symbol('lengthCalculator');
const ALLOW_STALE = Symbol('allowStale');
const MAX_AGE = Symbol('maxAge');
const DISPOSE = Symbol('dispose');
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
const LRU_LIST = Symbol('lruList');
const CACHE = Symbol('cache');
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

const naiveLength = () => 1;

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
    constructor(options) {
        if (typeof options === 'number') options = { max: options };

        if (!options) options = {};

        if (options.max && (typeof options.max !== 'number' || options.max < 0))
            throw new TypeError('max must be a non-negative number');
        // Kind of weird to have a default max of Infinity, but oh well.
        const max = (this[MAX] = options.max || Infinity);

        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== 'function' ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== 'number') throw new TypeError('maxAge must be a number');
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
    }

    // resize the cache when the max changes.
    set max(mL) {
        if (typeof mL !== 'number' || mL < 0) throw new TypeError('max must be a non-negative number');

        this[MAX] = mL || Infinity;
        trim(this);
    }
    get max() {
        return this[MAX];
    }

    set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
    }
    get allowStale() {
        return this[ALLOW_STALE];
    }

    set maxAge(mA) {
        if (typeof mA !== 'number') throw new TypeError('maxAge must be a non-negative number');

        this[MAX_AGE] = mA;
        trim(this);
    }
    get maxAge() {
        return this[MAX_AGE];
    }

    // resize the cache when the lengthCalculator changes.
    set lengthCalculator(lC) {
        if (typeof lC !== 'function') lC = naiveLength;

        if (lC !== this[LENGTH_CALCULATOR]) {
            this[LENGTH_CALCULATOR] = lC;
            this[LENGTH] = 0;
            this[LRU_LIST].forEach(hit => {
                hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
                this[LENGTH] += hit.length;
            });
        }
        trim(this);
    }
    get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
    }

    get length() {
        return this[LENGTH];
    }
    get itemCount() {
        return this[LRU_LIST].length;
    }

    rforEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].tail; walker !== null; ) {
            const prev = walker.prev;
            forEachStep(this, fn, walker, thisp);
            walker = prev;
        }
    }

    forEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].head; walker !== null; ) {
            const next = walker.next;
            forEachStep(this, fn, walker, thisp);
            walker = next;
        }
    }

    keys() {
        return this[LRU_LIST].toArray().map(k => k.key);
    }

    values() {
        return this[LRU_LIST].toArray().map(k => k.value);
    }

    reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
            this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
        }

        this[CACHE] = new Map(); // hash of items by key
        this[LRU_LIST] = new yallist(); // list of items in order of use recency
        this[LENGTH] = 0; // length of items in the list
    }

    dump() {
        return this[LRU_LIST].map(hit =>
            isStale(this, hit)
                ? false
                : {
                      k: hit.key,
                      v: hit.value,
                      e: hit.now + (hit.maxAge || 0),
                  },
        )
            .toArray()
            .filter(h => h);
    }

    dumpLru() {
        return this[LRU_LIST];
    }

    set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];

        if (maxAge && typeof maxAge !== 'number') throw new TypeError('maxAge must be a number');

        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);

        if (this[CACHE].has(key)) {
            if (len > this[MAX]) {
                del(this, this[CACHE].get(key));
                return false;
            }

            const node = this[CACHE].get(key);
            const item = node.value;

            // dispose of the old one before overwriting
            // split out into 2 ifs for better coverage tracking
            if (this[DISPOSE]) {
                if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
            }

            item.now = now;
            item.maxAge = maxAge;
            item.value = value;
            this[LENGTH] += len - item.length;
            item.length = len;
            this.get(key);
            trim(this);
            return true;
        }

        const hit = new Entry(key, value, len, now, maxAge);

        // oversized objects fall out of cache automatically.
        if (hit.length > this[MAX]) {
            if (this[DISPOSE]) this[DISPOSE](key, value);

            return false;
        }

        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
    }

    has(key) {
        if (!this[CACHE].has(key)) return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
    }

    get(key) {
        return get(this, key, true);
    }

    peek(key) {
        return get(this, key, false);
    }

    pop() {
        const node = this[LRU_LIST].tail;
        if (!node) return null;

        del(this, node);
        return node.value;
    }

    del(key) {
        del(this, this[CACHE].get(key));
    }

    load(arr) {
        // reset the cache
        this.reset();

        const now = Date.now();
        // A previous serialized cache has the most recent items first
        for (let l = arr.length - 1; l >= 0; l--) {
            const hit = arr[l];
            const expiresAt = hit.e || 0;
            if (expiresAt === 0)
                // the item was created without expiration in a non aged cache
                this.set(hit.k, hit.v);
            else {
                const maxAge = expiresAt - now;
                // dont add already expired items
                if (maxAge > 0) {
                    this.set(hit.k, hit.v, maxAge);
                }
            }
        }
    }

    prune() {
        this[CACHE].forEach((value, key) => get(this, key, false));
    }
}

const get = (self, key, doUse) => {
    const node = self[CACHE].get(key);
    if (node) {
        const hit = node.value;
        if (isStale(self, hit)) {
            del(self, node);
            if (!self[ALLOW_STALE]) return undefined;
        } else {
            if (doUse) {
                if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
                self[LRU_LIST].unshiftNode(node);
            }
        }
        return hit.value;
    }
};

const isStale = (self, hit) => {
    if (!hit || (!hit.maxAge && !self[MAX_AGE])) return false;

    const diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};

const trim = self => {
    if (self[LENGTH] > self[MAX]) {
        for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null; ) {
            // We know that we're about to delete this one, and also
            // what the next least recently used key will be, so just
            // go ahead and set it now.
            const prev = walker.prev;
            del(self, walker);
            walker = prev;
        }
    }
};

const del = (self, node) => {
    if (node) {
        const hit = node.value;
        if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);

        self[LENGTH] -= hit.length;
        self[CACHE].delete(hit.key);
        self[LRU_LIST].removeNode(node);
    }
};

class Entry {
    constructor(key, value, length, now, maxAge) {
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
    }
}

const forEachStep = (self, fn, node, thisp) => {
    let hit = node.value;
    if (isStale(self, hit)) {
        del(self, node);
        if (!self[ALLOW_STALE]) hit = undefined;
    }
    if (hit) fn.call(thisp, hit.value, hit.key, self);
};

var lruCache = LRUCache;

var reactIs_production_min = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, '__esModule', { value: !0 });
    var b = 'function' === typeof Symbol && Symbol.for,
        c = b ? Symbol.for('react.element') : 60103,
        d = b ? Symbol.for('react.portal') : 60106,
        e = b ? Symbol.for('react.fragment') : 60107,
        f = b ? Symbol.for('react.strict_mode') : 60108,
        g = b ? Symbol.for('react.profiler') : 60114,
        h = b ? Symbol.for('react.provider') : 60109,
        k = b ? Symbol.for('react.context') : 60110,
        l = b ? Symbol.for('react.async_mode') : 60111,
        m = b ? Symbol.for('react.concurrent_mode') : 60111,
        n = b ? Symbol.for('react.forward_ref') : 60112,
        p = b ? Symbol.for('react.suspense') : 60113,
        q = b ? Symbol.for('react.suspense_list') : 60120,
        r = b ? Symbol.for('react.memo') : 60115,
        t = b ? Symbol.for('react.lazy') : 60116,
        v = b ? Symbol.for('react.fundamental') : 60117,
        w = b ? Symbol.for('react.responder') : 60118,
        x = b ? Symbol.for('react.scope') : 60119;
    function y(a) {
        if ('object' === typeof a && null !== a) {
            var u = a.$$typeof;
            switch (u) {
                case c:
                    switch (((a = a.type), a)) {
                        case l:
                        case m:
                        case e:
                        case g:
                        case f:
                        case p:
                            return a;
                        default:
                            switch (((a = a && a.$$typeof), a)) {
                                case k:
                                case n:
                                case t:
                                case r:
                                case h:
                                    return a;
                                default:
                                    return u;
                            }
                    }
                case d:
                    return u;
            }
        }
    }
    function z(a) {
        return y(a) === m;
    }
    exports.typeOf = y;
    exports.AsyncMode = l;
    exports.ConcurrentMode = m;
    exports.ContextConsumer = k;
    exports.ContextProvider = h;
    exports.Element = c;
    exports.ForwardRef = n;
    exports.Fragment = e;
    exports.Lazy = t;
    exports.Memo = r;
    exports.Portal = d;
    exports.Profiler = g;
    exports.StrictMode = f;
    exports.Suspense = p;
    exports.isValidElementType = function (a) {
        return (
            'string' === typeof a ||
            'function' === typeof a ||
            a === e ||
            a === m ||
            a === g ||
            a === f ||
            a === p ||
            a === q ||
            ('object' === typeof a &&
                null !== a &&
                (a.$$typeof === t ||
                    a.$$typeof === r ||
                    a.$$typeof === h ||
                    a.$$typeof === k ||
                    a.$$typeof === n ||
                    a.$$typeof === v ||
                    a.$$typeof === w ||
                    a.$$typeof === x))
        );
    };
    exports.isAsyncMode = function (a) {
        return z(a) || y(a) === l;
    };
    exports.isConcurrentMode = z;
    exports.isContextConsumer = function (a) {
        return y(a) === k;
    };
    exports.isContextProvider = function (a) {
        return y(a) === h;
    };
    exports.isElement = function (a) {
        return 'object' === typeof a && null !== a && a.$$typeof === c;
    };
    exports.isForwardRef = function (a) {
        return y(a) === n;
    };
    exports.isFragment = function (a) {
        return y(a) === e;
    };
    exports.isLazy = function (a) {
        return y(a) === t;
    };
    exports.isMemo = function (a) {
        return y(a) === r;
    };
    exports.isPortal = function (a) {
        return y(a) === d;
    };
    exports.isProfiler = function (a) {
        return y(a) === g;
    };
    exports.isStrictMode = function (a) {
        return y(a) === f;
    };
    exports.isSuspense = function (a) {
        return y(a) === p;
    };
});

unwrapExports(reactIs_production_min);
var reactIs_production_min_1 = reactIs_production_min.typeOf;
var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
var reactIs_production_min_6 = reactIs_production_min.Element;
var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
var reactIs_production_min_8 = reactIs_production_min.Fragment;
var reactIs_production_min_9 = reactIs_production_min.Lazy;
var reactIs_production_min_10 = reactIs_production_min.Memo;
var reactIs_production_min_11 = reactIs_production_min.Portal;
var reactIs_production_min_12 = reactIs_production_min.Profiler;
var reactIs_production_min_13 = reactIs_production_min.StrictMode;
var reactIs_production_min_14 = reactIs_production_min.Suspense;
var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
var reactIs_production_min_20 = reactIs_production_min.isElement;
var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
var reactIs_production_min_22 = reactIs_production_min.isFragment;
var reactIs_production_min_23 = reactIs_production_min.isLazy;
var reactIs_production_min_24 = reactIs_production_min.isMemo;
var reactIs_production_min_25 = reactIs_production_min.isPortal;
var reactIs_production_min_26 = reactIs_production_min.isProfiler;
var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
var reactIs_production_min_28 = reactIs_production_min.isSuspense;

var reactIs_development = createCommonjsModule(function (module, exports) {
    if (process.env.NODE_ENV !== 'production') {
        (function () {
            Object.defineProperty(exports, '__esModule', { value: true });

            // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
            // nor polyfill, then a plain number is used for performance.
            var hasSymbol = typeof Symbol === 'function' && Symbol.for;
            var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
            var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
            var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
            var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
            var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
            var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
            var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
            // (unstable) APIs that have been removed. Can we remove the symbols?

            var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
            var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
            var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
            var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
            var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
            var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
            var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
            var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
            var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
            var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

            function isValidElementType(type) {
                return (
                    typeof type === 'string' ||
                    typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
                    type === REACT_FRAGMENT_TYPE ||
                    type === REACT_CONCURRENT_MODE_TYPE ||
                    type === REACT_PROFILER_TYPE ||
                    type === REACT_STRICT_MODE_TYPE ||
                    type === REACT_SUSPENSE_TYPE ||
                    type === REACT_SUSPENSE_LIST_TYPE ||
                    (typeof type === 'object' &&
                        type !== null &&
                        (type.$$typeof === REACT_LAZY_TYPE ||
                            type.$$typeof === REACT_MEMO_TYPE ||
                            type.$$typeof === REACT_PROVIDER_TYPE ||
                            type.$$typeof === REACT_CONTEXT_TYPE ||
                            type.$$typeof === REACT_FORWARD_REF_TYPE ||
                            type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
                            type.$$typeof === REACT_RESPONDER_TYPE ||
                            type.$$typeof === REACT_SCOPE_TYPE))
                );
            }

            /**
             * Forked from fbjs/warning:
             * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
             *
             * Only change is we use console.warn instead of console.error,
             * and do nothing when 'console' is not supported.
             * This really simplifies the code.
             * ---
             * Similar to invariant but only logs a warning if the condition is not met.
             * This can be used to log issues in development environments in critical
             * paths. Removing the logging code for production environments will keep the
             * same logic and follow the same code paths.
             */
            var lowPriorityWarningWithoutStack = function () {};

            {
                var printWarning = function (format) {
                    for (
                        var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
                        _key < _len;
                        _key++
                    ) {
                        args[_key - 1] = arguments[_key];
                    }

                    var argIndex = 0;
                    var message =
                        'Warning: ' +
                        format.replace(/%s/g, function () {
                            return args[argIndex++];
                        });

                    if (typeof console !== 'undefined') {
                        console.warn(message);
                    }

                    try {
                        // --- Welcome to debugging React ---
                        // This error was thrown as a convenience so that you can use this stack
                        // to find the callsite that caused this warning to fire.
                        throw new Error(message);
                    } catch (x) {}
                };

                lowPriorityWarningWithoutStack = function (condition, format) {
                    if (format === undefined) {
                        throw new Error(
                            '`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' +
                                'message argument',
                        );
                    }

                    if (!condition) {
                        for (
                            var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2;
                            _key2 < _len2;
                            _key2++
                        ) {
                            args[_key2 - 2] = arguments[_key2];
                        }

                        printWarning.apply(void 0, [format].concat(args));
                    }
                };
            }

            var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

            function typeOf(object) {
                if (typeof object === 'object' && object !== null) {
                    var $$typeof = object.$$typeof;

                    switch ($$typeof) {
                        case REACT_ELEMENT_TYPE:
                            var type = object.type;

                            switch (type) {
                                case REACT_ASYNC_MODE_TYPE:
                                case REACT_CONCURRENT_MODE_TYPE:
                                case REACT_FRAGMENT_TYPE:
                                case REACT_PROFILER_TYPE:
                                case REACT_STRICT_MODE_TYPE:
                                case REACT_SUSPENSE_TYPE:
                                    return type;

                                default:
                                    var $$typeofType = type && type.$$typeof;

                                    switch ($$typeofType) {
                                        case REACT_CONTEXT_TYPE:
                                        case REACT_FORWARD_REF_TYPE:
                                        case REACT_LAZY_TYPE:
                                        case REACT_MEMO_TYPE:
                                        case REACT_PROVIDER_TYPE:
                                            return $$typeofType;

                                        default:
                                            return $$typeof;
                                    }
                            }

                        case REACT_PORTAL_TYPE:
                            return $$typeof;
                    }
                }

                return undefined;
            } // AsyncMode is deprecated along with isAsyncMode

            var AsyncMode = REACT_ASYNC_MODE_TYPE;
            var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
            var ContextConsumer = REACT_CONTEXT_TYPE;
            var ContextProvider = REACT_PROVIDER_TYPE;
            var Element = REACT_ELEMENT_TYPE;
            var ForwardRef = REACT_FORWARD_REF_TYPE;
            var Fragment = REACT_FRAGMENT_TYPE;
            var Lazy = REACT_LAZY_TYPE;
            var Memo = REACT_MEMO_TYPE;
            var Portal = REACT_PORTAL_TYPE;
            var Profiler = REACT_PROFILER_TYPE;
            var StrictMode = REACT_STRICT_MODE_TYPE;
            var Suspense = REACT_SUSPENSE_TYPE;
            var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

            function isAsyncMode(object) {
                {
                    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                        hasWarnedAboutDeprecatedIsAsyncMode = true;
                        lowPriorityWarningWithoutStack$1(
                            false,
                            'The ReactIs.isAsyncMode() alias has been deprecated, ' +
                                'and will be removed in React 17+. Update your code to use ' +
                                'ReactIs.isConcurrentMode() instead. It has the exact same API.',
                        );
                    }
                }

                return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
            }
            function isConcurrentMode(object) {
                return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
            }
            function isContextConsumer(object) {
                return typeOf(object) === REACT_CONTEXT_TYPE;
            }
            function isContextProvider(object) {
                return typeOf(object) === REACT_PROVIDER_TYPE;
            }
            function isElement(object) {
                return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
            }
            function isForwardRef(object) {
                return typeOf(object) === REACT_FORWARD_REF_TYPE;
            }
            function isFragment(object) {
                return typeOf(object) === REACT_FRAGMENT_TYPE;
            }
            function isLazy(object) {
                return typeOf(object) === REACT_LAZY_TYPE;
            }
            function isMemo(object) {
                return typeOf(object) === REACT_MEMO_TYPE;
            }
            function isPortal(object) {
                return typeOf(object) === REACT_PORTAL_TYPE;
            }
            function isProfiler(object) {
                return typeOf(object) === REACT_PROFILER_TYPE;
            }
            function isStrictMode(object) {
                return typeOf(object) === REACT_STRICT_MODE_TYPE;
            }
            function isSuspense(object) {
                return typeOf(object) === REACT_SUSPENSE_TYPE;
            }

            exports.typeOf = typeOf;
            exports.AsyncMode = AsyncMode;
            exports.ConcurrentMode = ConcurrentMode;
            exports.ContextConsumer = ContextConsumer;
            exports.ContextProvider = ContextProvider;
            exports.Element = Element;
            exports.ForwardRef = ForwardRef;
            exports.Fragment = Fragment;
            exports.Lazy = Lazy;
            exports.Memo = Memo;
            exports.Portal = Portal;
            exports.Profiler = Profiler;
            exports.StrictMode = StrictMode;
            exports.Suspense = Suspense;
            exports.isValidElementType = isValidElementType;
            exports.isAsyncMode = isAsyncMode;
            exports.isConcurrentMode = isConcurrentMode;
            exports.isContextConsumer = isContextConsumer;
            exports.isContextProvider = isContextProvider;
            exports.isElement = isElement;
            exports.isForwardRef = isForwardRef;
            exports.isFragment = isFragment;
            exports.isLazy = isLazy;
            exports.isMemo = isMemo;
            exports.isPortal = isPortal;
            exports.isProfiler = isProfiler;
            exports.isStrictMode = isStrictMode;
            exports.isSuspense = isSuspense;
        })();
    }
});

unwrapExports(reactIs_development);
var reactIs_development_1 = reactIs_development.typeOf;
var reactIs_development_2 = reactIs_development.AsyncMode;
var reactIs_development_3 = reactIs_development.ConcurrentMode;
var reactIs_development_4 = reactIs_development.ContextConsumer;
var reactIs_development_5 = reactIs_development.ContextProvider;
var reactIs_development_6 = reactIs_development.Element;
var reactIs_development_7 = reactIs_development.ForwardRef;
var reactIs_development_8 = reactIs_development.Fragment;
var reactIs_development_9 = reactIs_development.Lazy;
var reactIs_development_10 = reactIs_development.Memo;
var reactIs_development_11 = reactIs_development.Portal;
var reactIs_development_12 = reactIs_development.Profiler;
var reactIs_development_13 = reactIs_development.StrictMode;
var reactIs_development_14 = reactIs_development.Suspense;
var reactIs_development_15 = reactIs_development.isValidElementType;
var reactIs_development_16 = reactIs_development.isAsyncMode;
var reactIs_development_17 = reactIs_development.isConcurrentMode;
var reactIs_development_18 = reactIs_development.isContextConsumer;
var reactIs_development_19 = reactIs_development.isContextProvider;
var reactIs_development_20 = reactIs_development.isElement;
var reactIs_development_21 = reactIs_development.isForwardRef;
var reactIs_development_22 = reactIs_development.isFragment;
var reactIs_development_23 = reactIs_development.isLazy;
var reactIs_development_24 = reactIs_development.isMemo;
var reactIs_development_25 = reactIs_development.isPortal;
var reactIs_development_26 = reactIs_development.isProfiler;
var reactIs_development_27 = reactIs_development.isStrictMode;
var reactIs_development_28 = reactIs_development.isSuspense;

var reactIs = createCommonjsModule(function (module) {
    if (process.env.NODE_ENV === 'production') {
        module.exports = reactIs_production_min;
    } else {
        module.exports = reactIs_development;
    }
});
var reactIs_1 = reactIs.isElement;
var reactIs_2 = reactIs.typeOf;
var reactIs_3 = reactIs.ContextConsumer;
var reactIs_4 = reactIs.ContextProvider;
var reactIs_5 = reactIs.ForwardRef;
var reactIs_6 = reactIs.Fragment;
var reactIs_7 = reactIs.Lazy;
var reactIs_8 = reactIs.Memo;
var reactIs_9 = reactIs.Portal;
var reactIs_10 = reactIs.Profiler;
var reactIs_11 = reactIs.StrictMode;
var reactIs_12 = reactIs.Suspense;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const TREE_OPERATION_ADD = 1;
const TREE_OPERATION_REMOVE = 2;
const TREE_OPERATION_REORDER_CHILDREN = 3;
const TREE_OPERATION_UPDATE_TREE_BASE_DURATION = 4;
const SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY = 'React::DevTools::recordChangeDescriptions';
const SESSION_STORAGE_RELOAD_AND_PROFILE_KEY = 'React::DevTools::reloadAndProfile';
//
// Extracting during build time avoids a temporarily invalid state for the inline target.
// Sometimes the inline target is rendered before root styles are applied,
// which would result in e.g. NaN itemSize being passed to react-window list.
//

let COMFORTABLE_LINE_HEIGHT;
let COMPACT_LINE_HEIGHT;

try {
    // $FlowFixMe
    const rawStyleString = require('!!raw-loader!react-devtools-shared/src/devtools/views/root.css').default;

    const extractVar = varName => {
        const regExp = new RegExp(`${varName}: ([0-9]+)`);
        const match = rawStyleString.match(regExp);
        return parseInt(match[1], 10);
    };

    COMFORTABLE_LINE_HEIGHT = extractVar('comfortable-line-height-data');
    COMPACT_LINE_HEIGHT = extractVar('compact-line-height-data');
} catch (error) {
    // We can't use the Webpack loader syntax in the context of Jest,
    // so tests need some reasonably meaningful fallback value.
    COMFORTABLE_LINE_HEIGHT = 15;
    COMPACT_LINE_HEIGHT = 10;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function sessionStorageGetItem(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const cachedDisplayNames = new WeakMap(); // On large trees, encoding takes significant time.
// Try to reuse the already encoded strings.

const encodedStringCache = new lruCache({
    max: 1000,
});
function getDisplayName(type, fallbackName = 'Anonymous') {
    const nameFromCache = cachedDisplayNames.get(type);

    if (nameFromCache != null) {
        return nameFromCache;
    }

    let displayName = fallbackName; // The displayName property is not guaranteed to be a string.
    // It's only safe to use for our purposes if it's a string.
    // github.com/facebook/react-devtools/issues/803

    if (typeof type.displayName === 'string') {
        displayName = type.displayName;
    } else if (typeof type.name === 'string' && type.name !== '') {
        displayName = type.name;
    }

    cachedDisplayNames.set(type, displayName);
    return displayName;
}
let uidCounter = 0;
function getUID() {
    return ++uidCounter;
}
function utfEncodeString(string) {
    const cached = encodedStringCache.get(string);

    if (cached !== undefined) {
        return cached;
    }

    const encoded = new Array(string.length);

    for (let i = 0; i < string.length; i++) {
        encoded[i] = string.codePointAt(i);
    }

    encodedStringCache.set(string, encoded);
    return encoded;
}
function getDefaultComponentFilters() {
    return [
        {
            type: ComponentFilterElementType,
            value: ElementTypeHostComponent,
            isEnabled: true,
        },
    ];
}
function getInObject(object, path) {
    return path.reduce((reduced, attr) => {
        if (reduced) {
            if (hasOwnProperty.call(reduced, attr)) {
                return reduced[attr];
            }

            if (typeof reduced[Symbol.iterator] === 'function') {
                // Convert iterable to array and return array[index]
                //
                // TRICKY
                // Don't use [...spread] syntax for this purpose.
                // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
                // Other types (e.g. typed arrays, Sets) will not spread correctly.
                return Array.from(reduced)[attr];
            }
        }

        return null;
    }, object);
}
function setInObject(object, path, value) {
    const length = path.length;
    const last = path[length - 1];

    if (object != null) {
        const parent = getInObject(object, path.slice(0, length - 1));

        if (parent) {
            parent[last] = value;
        }
    }
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
// import { cleanForBridge, copyToClipboard, copyWithSet } from './utils';
// import { inspectHooksOfFiber } from 'react-debug-tools';
// import { patch as patchConsole, registerRenderer as registerRendererWithConsole } from './console';
// import type { Fiber } from 'react-reconciler/src/ReactFiber';

const cleanForBridge = () => {};

const copyToClipboard = () => {};

const copyWithSet = () => {};

const inspectHooksOfFiber = () => null;

// Some environments (e.g. React Native / Hermes) don't support the performace API yet.
const getCurrentTime =
    typeof performance === 'object' && typeof performance.now === 'function'
        ? () => performance.now()
        : () => Date.now();
export function getInternalReactConstants(version) {
    const ReactSymbols = {
        CONCURRENT_MODE_NUMBER: 0xeacf,
        CONCURRENT_MODE_SYMBOL_STRING: 'Symbol(react.concurrent_mode)',
        DEPRECATED_ASYNC_MODE_SYMBOL_STRING: 'Symbol(react.async_mode)',
        CONTEXT_CONSUMER_NUMBER: 0xeace,
        CONTEXT_CONSUMER_SYMBOL_STRING: 'Symbol(react.context)',
        CONTEXT_PROVIDER_NUMBER: 0xeacd,
        CONTEXT_PROVIDER_SYMBOL_STRING: 'Symbol(react.provider)',
        FORWARD_REF_NUMBER: 0xead0,
        FORWARD_REF_SYMBOL_STRING: 'Symbol(react.forward_ref)',
        MEMO_NUMBER: 0xead3,
        MEMO_SYMBOL_STRING: 'Symbol(react.memo)',
        PROFILER_NUMBER: 0xead2,
        PROFILER_SYMBOL_STRING: 'Symbol(react.profiler)',
        STRICT_MODE_NUMBER: 0xeacc,
        STRICT_MODE_SYMBOL_STRING: 'Symbol(react.strict_mode)',
        SCOPE_NUMBER: 0xead7,
        SCOPE_SYMBOL_STRING: 'Symbol(react.scope)',
    };
    const ReactTypeOfSideEffect = {
        NoEffect: 0b00,
        PerformedWork: 0b01,
        Placement: 0b10,
    }; // **********************************************************
    // The section below is copied from files in React repo.
    // Keep it in sync, and add version guards if it changes.
    //
    // Technically these priority levels are invalid for versions before 16.9,
    // but 16.9 is the first version to report priority level to DevTools,
    // so we can avoid checking for earlier versions and support pre-16.9 canary releases in the process.

    const ReactPriorityLevels = {
        ImmediatePriority: 99,
        UserBlockingPriority: 98,
        NormalPriority: 97,
        LowPriority: 96,
        IdlePriority: 95,
        NoPriority: 90,
    };
    let ReactTypeOfWork = null; // **********************************************************
    // The section below is copied from files in React repo.
    // Keep it in sync, and add version guards if it changes.

    if (semver_27(version, '16.6.0-beta.0')) {
        ReactTypeOfWork = {
            ClassComponent: 1,
            ContextConsumer: 9,
            ContextProvider: 10,
            CoroutineComponent: -1,
            // Removed
            CoroutineHandlerPhase: -1,
            // Removed
            DehydratedSuspenseComponent: 18,
            // Behind a flag
            ForwardRef: 11,
            Fragment: 7,
            FunctionComponent: 0,
            HostComponent: 5,
            HostPortal: 4,
            HostRoot: 3,
            HostText: 6,
            IncompleteClassComponent: 17,
            IndeterminateComponent: 2,
            LazyComponent: 16,
            MemoComponent: 14,
            Mode: 8,
            Profiler: 12,
            SimpleMemoComponent: 15,
            SuspenseComponent: 13,
            SuspenseListComponent: 19,
            // Experimental
            YieldComponent: -1, // Removed
        };
    } else if (semver_27(version, '16.4.3-alpha')) {
        ReactTypeOfWork = {
            ClassComponent: 2,
            ContextConsumer: 11,
            ContextProvider: 12,
            CoroutineComponent: -1,
            // Removed
            CoroutineHandlerPhase: -1,
            // Removed
            DehydratedSuspenseComponent: -1,
            // Doesn't exist yet
            ForwardRef: 13,
            Fragment: 9,
            FunctionComponent: 0,
            HostComponent: 7,
            HostPortal: 6,
            HostRoot: 5,
            HostText: 8,
            IncompleteClassComponent: -1,
            // Doesn't exist yet
            IndeterminateComponent: 4,
            LazyComponent: -1,
            // Doesn't exist yet
            MemoComponent: -1,
            // Doesn't exist yet
            Mode: 10,
            Profiler: 15,
            SimpleMemoComponent: -1,
            // Doesn't exist yet
            SuspenseComponent: 16,
            SuspenseListComponent: -1,
            // Doesn't exist yet
            YieldComponent: -1, // Removed
        };
    } else {
        ReactTypeOfWork = {
            ClassComponent: 2,
            ContextConsumer: 12,
            ContextProvider: 13,
            CoroutineComponent: 7,
            CoroutineHandlerPhase: 8,
            DehydratedSuspenseComponent: -1,
            // Doesn't exist yet
            ForwardRef: 14,
            Fragment: 10,
            FunctionComponent: 1,
            HostComponent: 5,
            HostPortal: 4,
            HostRoot: 3,
            HostText: 6,
            IncompleteClassComponent: -1,
            // Doesn't exist yet
            IndeterminateComponent: 0,
            LazyComponent: -1,
            // Doesn't exist yet
            MemoComponent: -1,
            // Doesn't exist yet
            Mode: 11,
            Profiler: 15,
            SimpleMemoComponent: -1,
            // Doesn't exist yet
            SuspenseComponent: 16,
            SuspenseListComponent: -1,
            // Doesn't exist yet
            YieldComponent: 9,
        };
    } // **********************************************************
    // End of copied code.
    // **********************************************************

    function getTypeSymbol(type) {
        const symbolOrNumber = typeof type === 'object' && type !== null ? type.$$typeof : type; // $FlowFixMe Flow doesn't know about typeof "symbol"

        return typeof symbolOrNumber === 'symbol' ? symbolOrNumber.toString() : symbolOrNumber;
    }

    const {
        ClassComponent,
        IncompleteClassComponent,
        FunctionComponent,
        IndeterminateComponent,
        ForwardRef,
        HostRoot,
        HostComponent,
        HostPortal,
        HostText,
        Fragment,
        MemoComponent,
        SimpleMemoComponent,
        SuspenseComponent,
        SuspenseListComponent,
    } = ReactTypeOfWork;
    const {
        CONCURRENT_MODE_NUMBER,
        CONCURRENT_MODE_SYMBOL_STRING,
        DEPRECATED_ASYNC_MODE_SYMBOL_STRING,
        CONTEXT_PROVIDER_NUMBER,
        CONTEXT_PROVIDER_SYMBOL_STRING,
        CONTEXT_CONSUMER_NUMBER,
        CONTEXT_CONSUMER_SYMBOL_STRING,
        STRICT_MODE_NUMBER,
        STRICT_MODE_SYMBOL_STRING,
        PROFILER_NUMBER,
        PROFILER_SYMBOL_STRING,
        SCOPE_NUMBER,
        SCOPE_SYMBOL_STRING,
        FORWARD_REF_NUMBER,
        FORWARD_REF_SYMBOL_STRING,
        MEMO_NUMBER,
        MEMO_SYMBOL_STRING,
    } = ReactSymbols;

    function resolveFiberType(type) {
        const typeSymbol = getTypeSymbol(type);

        switch (typeSymbol) {
            case MEMO_NUMBER:
            case MEMO_SYMBOL_STRING:
                // recursively resolving memo type in case of memo(forwardRef(Component))
                return resolveFiberType(type.type);

            case FORWARD_REF_NUMBER:
            case FORWARD_REF_SYMBOL_STRING:
                return type.render;

            default:
                return type;
        }
    } // NOTICE Keep in sync with shouldFilterFiber() and other get*ForFiber methods

    function getDisplayNameForFiber(fiber) {
        const { type, tag } = fiber;
        let resolvedType = type;

        if (typeof type === 'object' && type !== null) {
            resolvedType = resolveFiberType(type);
        }

        let resolvedContext = null;

        switch (tag) {
            case ClassComponent:
            case IncompleteClassComponent:
                return getDisplayName(resolvedType);

            case FunctionComponent:
            case IndeterminateComponent:
                return getDisplayName(resolvedType);

            case ForwardRef:
                // Mirror https://github.com/facebook/react/blob/7c21bf72ace77094fd1910cc350a548287ef8350/packages/shared/getComponentName.js#L27-L37
                return (type && type.displayName) || getDisplayName(resolvedType, 'Anonymous');

            case HostRoot:
                return null;

            case HostComponent:
                return type;

            case HostPortal:
            case HostText:
            case Fragment:
                return null;

            case MemoComponent:
            case SimpleMemoComponent:
                return getDisplayName(resolvedType, 'Anonymous');

            case SuspenseComponent:
                return 'Suspense';

            case SuspenseListComponent:
                return 'SuspenseList';

            default:
                const typeSymbol = getTypeSymbol(type);

                switch (typeSymbol) {
                    case CONCURRENT_MODE_NUMBER:
                    case CONCURRENT_MODE_SYMBOL_STRING:
                    case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
                        return null;

                    case CONTEXT_PROVIDER_NUMBER:
                    case CONTEXT_PROVIDER_SYMBOL_STRING:
                        // 16.3.0 exposed the context object as "context"
                        // PR #12501 changed it to "_context" for 16.3.1+
                        // NOTE Keep in sync with inspectElementRaw()
                        resolvedContext = fiber.type._context || fiber.type.context;
                        return `${resolvedContext.displayName || 'Context'}.Provider`;

                    case CONTEXT_CONSUMER_NUMBER:
                    case CONTEXT_CONSUMER_SYMBOL_STRING:
                        // 16.3-16.5 read from "type" because the Consumer is the actual context object.
                        // 16.6+ should read from "type._context" because Consumer can be different (in DEV).
                        // NOTE Keep in sync with inspectElementRaw()
                        resolvedContext = fiber.type._context || fiber.type; // NOTE: TraceUpdatesBackendManager depends on the name ending in '.Consumer'
                        // If you change the name, figure out a more resilient way to detect it.

                        return `${resolvedContext.displayName || 'Context'}.Consumer`;

                    case STRICT_MODE_NUMBER:
                    case STRICT_MODE_SYMBOL_STRING:
                        return null;

                    case PROFILER_NUMBER:
                    case PROFILER_SYMBOL_STRING:
                        return `Profiler(${fiber.memoizedProps.id})`;

                    case SCOPE_NUMBER:
                    case SCOPE_SYMBOL_STRING:
                        return 'Scope';

                    default:
                        // Unknown element type.
                        // This may mean a new element type that has not yet been added to DevTools.
                        return null;
                }
        }
    }

    return {
        getDisplayNameForFiber,
        getTypeSymbol,
        ReactPriorityLevels,
        ReactTypeOfWork,
        ReactSymbols,
        ReactTypeOfSideEffect,
    };
}
export function attach(hook, rendererID, renderer, global) {
    const {
        getDisplayNameForFiber,
        getTypeSymbol,
        ReactPriorityLevels,
        ReactTypeOfWork,
        ReactSymbols,
        ReactTypeOfSideEffect,
    } = getInternalReactConstants(renderer.version);
    const { NoEffect, PerformedWork, Placement } = ReactTypeOfSideEffect;
    const {
        FunctionComponent,
        ClassComponent,
        ContextConsumer,
        DehydratedSuspenseComponent,
        Fragment,
        ForwardRef,
        HostRoot,
        HostPortal,
        HostComponent,
        HostText,
        IncompleteClassComponent,
        IndeterminateComponent,
        MemoComponent,
        SimpleMemoComponent,
        SuspenseComponent,
        SuspenseListComponent,
    } = ReactTypeOfWork;
    const {
        ImmediatePriority,
        UserBlockingPriority,
        NormalPriority,
        LowPriority,
        IdlePriority,
        NoPriority,
    } = ReactPriorityLevels;
    const {
        CONCURRENT_MODE_NUMBER,
        CONCURRENT_MODE_SYMBOL_STRING,
        DEPRECATED_ASYNC_MODE_SYMBOL_STRING,
        CONTEXT_CONSUMER_NUMBER,
        CONTEXT_CONSUMER_SYMBOL_STRING,
        CONTEXT_PROVIDER_NUMBER,
        CONTEXT_PROVIDER_SYMBOL_STRING,
        PROFILER_NUMBER,
        PROFILER_SYMBOL_STRING,
        STRICT_MODE_NUMBER,
        STRICT_MODE_SYMBOL_STRING,
    } = ReactSymbols;
    const { overrideHookState, overrideProps, setSuspenseHandler, scheduleUpdate } = renderer;
    const supportsTogglingSuspense = typeof setSuspenseHandler === 'function' && typeof scheduleUpdate === 'function'; // Patching the console enables DevTools to do a few useful things:
    // * Append component stacks to warnings and error messages
    // * Disable logging during re-renders to inspect hooks (see inspectHooksOfFiber)
    //
    // Don't patch in test environments because we don't want to interfere with Jest's own console overrides.

    if (process.env.NODE_ENV !== 'test');

    const hideElementsWithDisplayNames = new Set();
    const hideElementsWithPaths = new Set();
    const hideElementsWithTypes = new Set(); // Highlight updates

    let traceUpdatesEnabled = false;
    const traceUpdatesForNodes = new Set();

    function applyComponentFilters(componentFilters) {
        hideElementsWithTypes.clear();
        hideElementsWithDisplayNames.clear();
        hideElementsWithPaths.clear();
        componentFilters.forEach(componentFilter => {
            if (!componentFilter.isEnabled) {
                return;
            }

            switch (componentFilter.type) {
                case ComponentFilterDisplayName:
                    if (componentFilter.isValid && componentFilter.value !== '') {
                        hideElementsWithDisplayNames.add(new RegExp(componentFilter.value, 'i'));
                    }

                    break;

                case ComponentFilterElementType:
                    hideElementsWithTypes.add(componentFilter.value);
                    break;

                case ComponentFilterLocation:
                    if (componentFilter.isValid && componentFilter.value !== '') {
                        hideElementsWithPaths.add(new RegExp(componentFilter.value, 'i'));
                    }

                    break;

                case ComponentFilterHOC:
                    hideElementsWithDisplayNames.add(new RegExp('\\('));
                    break;

                default:
                    console.warn(`Invalid component filter type "${componentFilter.type}"`);
                    break;
            }
        });
    } // The renderer interface can't read saved component filters directly,
    // because they are stored in localStorage within the context of the extension.
    // Instead it relies on the extension to pass filters through.

    if (window.__REACT_DEVTOOLS_COMPONENT_FILTERS__ != null) {
        applyComponentFilters(window.__REACT_DEVTOOLS_COMPONENT_FILTERS__);
    } else {
        // Unfortunately this feature is not expected to work for React Native for now.
        // It would be annoying for us to spam YellowBox warnings with unactionable stuff,
        // so for now just skip this message...
        //console.warn('⚛️ DevTools: Could not locate saved component filters');
        // Fallback to assuming the default filters in this case.
        applyComponentFilters(getDefaultComponentFilters());
    } // If necessary, we can revisit optimizing this operation.
    // For example, we could add a new recursive unmount tree operation.
    // The unmount operations are already significantly smaller than mount opreations though.
    // This is something to keep in mind for later.

    function updateComponentFilters(componentFilters) {
        if (isProfiling) {
            // Re-mounting a tree while profiling is in progress might break a lot of assumptions.
            // If necessary, we could support this- but it doesn't seem like a necessary use case.
            throw Error('Cannot modify filter preferences while profiling');
        } // Recursively unmount all roots.

        hook.getFiberRoots(rendererID).forEach(root => {
            currentRootID = getFiberID(getPrimaryFiber(root.current));
            unmountFiberChildrenRecursively(root.current);
            recordUnmount(root.current, false);
            currentRootID = -1;
        });
        applyComponentFilters(componentFilters); // Reset psuedo counters so that new path selections will be persisted.

        rootDisplayNameCounter.clear(); // Recursively re-mount all roots with new filter criteria applied.

        hook.getFiberRoots(rendererID).forEach(root => {
            currentRootID = getFiberID(getPrimaryFiber(root.current));
            setRootPseudoKey(currentRootID, root.current);
            mountFiberRecursively(root.current, null, false, false);
            flushPendingEvents();
            currentRootID = -1;
        });
    } // NOTICE Keep in sync with get*ForFiber methods

    function shouldFilterFiber(fiber) {
        const { _debugSource, tag, type } = fiber;

        switch (tag) {
            case DehydratedSuspenseComponent:
                // TODO: ideally we would show dehydrated Suspense immediately.
                // However, it has some special behavior (like disconnecting
                // an alternate and turning into real Suspense) which breaks DevTools.
                // For now, ignore it, and only show it once it gets hydrated.
                // https://github.com/bvaughn/react-devtools-experimental/issues/197
                return true;

            case HostPortal:
            case HostText:
            case Fragment:
                return true;

            case HostRoot:
                // It is never valid to filter the root element.
                return false;

            default:
                const typeSymbol = getTypeSymbol(type);

                switch (typeSymbol) {
                    case CONCURRENT_MODE_NUMBER:
                    case CONCURRENT_MODE_SYMBOL_STRING:
                    case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
                    case STRICT_MODE_NUMBER:
                    case STRICT_MODE_SYMBOL_STRING:
                        return true;
                }
        }

        const elementType = getElementTypeForFiber(fiber);

        if (hideElementsWithTypes.has(elementType)) {
            return true;
        }

        if (hideElementsWithDisplayNames.size > 0) {
            const displayName = getDisplayNameForFiber(fiber);

            if (displayName != null) {
                // eslint-disable-next-line no-for-of-loops/no-for-of-loops
                for (const displayNameRegExp of hideElementsWithDisplayNames) {
                    if (displayNameRegExp.test(displayName)) {
                        return true;
                    }
                }
            }
        }

        if (_debugSource != null && hideElementsWithPaths.size > 0) {
            const { fileName } = _debugSource; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

            for (const pathRegExp of hideElementsWithPaths) {
                if (pathRegExp.test(fileName)) {
                    return true;
                }
            }
        }

        return false;
    } // NOTICE Keep in sync with shouldFilterFiber() and other get*ForFiber methods

    function getElementTypeForFiber(fiber) {
        const { type, tag } = fiber;

        switch (tag) {
            case ClassComponent:
            case IncompleteClassComponent:
                return ElementTypeClass;

            case FunctionComponent:
            case IndeterminateComponent:
                return ElementTypeFunction;

            case ForwardRef:
                return ElementTypeForwardRef;

            case HostRoot:
                return ElementTypeRoot;

            case HostComponent:
                return ElementTypeHostComponent;

            case HostPortal:
            case HostText:
            case Fragment:
                return ElementTypeOtherOrUnknown;

            case MemoComponent:
            case SimpleMemoComponent:
                return ElementTypeMemo;

            case SuspenseComponent:
                return ElementTypeSuspense;

            case SuspenseListComponent:
                return ElementTypeSuspenseList;

            default:
                const typeSymbol = getTypeSymbol(type);

                switch (typeSymbol) {
                    case CONCURRENT_MODE_NUMBER:
                    case CONCURRENT_MODE_SYMBOL_STRING:
                    case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
                        return ElementTypeOtherOrUnknown;

                    case CONTEXT_PROVIDER_NUMBER:
                    case CONTEXT_PROVIDER_SYMBOL_STRING:
                        return ElementTypeContext;

                    case CONTEXT_CONSUMER_NUMBER:
                    case CONTEXT_CONSUMER_SYMBOL_STRING:
                        return ElementTypeContext;

                    case STRICT_MODE_NUMBER:
                    case STRICT_MODE_SYMBOL_STRING:
                        return ElementTypeOtherOrUnknown;

                    case PROFILER_NUMBER:
                    case PROFILER_SYMBOL_STRING:
                        return ElementTypeProfiler;

                    default:
                        return ElementTypeOtherOrUnknown;
                }
        }
    } // This is a slightly annoying indirection.
    // It is currently necessary because DevTools wants to use unique objects as keys for instances.
    // However fibers have two versions.
    // We use this set to remember first encountered fiber for each conceptual instance.

    function getPrimaryFiber(fiber) {
        if (primaryFibers.has(fiber)) {
            return fiber;
        }

        const { alternate } = fiber;

        if (alternate != null && primaryFibers.has(alternate)) {
            return alternate;
        }

        primaryFibers.add(fiber);
        return fiber;
    }

    const fiberToIDMap = new Map();
    const idToFiberMap = new Map();
    const primaryFibers = new Set(); // When profiling is supported, we store the latest tree base durations for each Fiber.
    // This is so that we can quickly capture a snapshot of those values if profiling starts.
    // If we didn't store these values, we'd have to crawl the tree when profiling started,
    // and use a slow path to find each of the current Fibers.

    const idToTreeBaseDurationMap = new Map(); // When profiling is supported, we store the latest tree base durations for each Fiber.
    // This map enables us to filter these times by root when sending them to the frontend.

    const idToRootMap = new Map(); // When a mount or update is in progress, this value tracks the root that is being operated on.

    let currentRootID = -1;

    function getFiberID(primaryFiber) {
        if (!fiberToIDMap.has(primaryFiber)) {
            const id = getUID();
            fiberToIDMap.set(primaryFiber, id);
            idToFiberMap.set(id, primaryFiber);
        }

        return fiberToIDMap.get(primaryFiber);
    }

    function getChangeDescription(prevFiber, nextFiber) {
        switch (getElementTypeForFiber(nextFiber)) {
            case ElementTypeClass:
            case ElementTypeFunction:
            case ElementTypeMemo:
            case ElementTypeForwardRef:
                if (prevFiber === null) {
                    return {
                        context: null,
                        didHooksChange: false,
                        isFirstMount: true,
                        props: null,
                        state: null,
                    };
                } else {
                    return {
                        context: getContextChangedKeys(nextFiber),
                        didHooksChange: didHooksChange(prevFiber.memoizedState, nextFiber.memoizedState),
                        isFirstMount: false,
                        props: getChangedKeys(prevFiber.memoizedProps, nextFiber.memoizedProps),
                        state: getChangedKeys(prevFiber.memoizedState, nextFiber.memoizedState),
                    };
                }

            default:
                return null;
        }
    }

    function updateContextsForFiber(fiber) {
        switch (getElementTypeForFiber(fiber)) {
            case ElementTypeClass:
                if (idToContextsMap !== null) {
                    const id = getFiberID(getPrimaryFiber(fiber));
                    const contexts = getContextsForFiber(fiber);

                    if (contexts !== null) {
                        idToContextsMap.set(id, contexts);
                    }
                }

                break;
        }
    } // Differentiates between a null context value and no context.

    const NO_CONTEXT = {};

    function getContextsForFiber(fiber) {
        switch (getElementTypeForFiber(fiber)) {
            case ElementTypeClass:
                const instance = fiber.stateNode;
                let legacyContext = NO_CONTEXT;
                let modernContext = NO_CONTEXT;

                if (instance != null) {
                    if (instance.constructor && instance.constructor.contextType != null) {
                        modernContext = instance.context;
                    } else {
                        legacyContext = instance.context;

                        if (legacyContext && Object.keys(legacyContext).length === 0) {
                            legacyContext = NO_CONTEXT;
                        }
                    }
                }

                return [legacyContext, modernContext];

            default:
                return null;
        }
    } // Record all contexts at the time profiling is started.
    // Fibers only store the current context value,
    // so we need to track them separatenly in order to determine changed keys.

    function crawlToInitializeContextsMap(fiber) {
        updateContextsForFiber(fiber);
        let current = fiber.child;

        while (current !== null) {
            crawlToInitializeContextsMap(current);
            current = current.sibling;
        }
    }

    function getContextChangedKeys(fiber) {
        switch (getElementTypeForFiber(fiber)) {
            case ElementTypeClass:
                if (idToContextsMap !== null) {
                    const id = getFiberID(getPrimaryFiber(fiber));
                    const prevContexts = idToContextsMap.has(id) ? idToContextsMap.get(id) : null;
                    const nextContexts = getContextsForFiber(fiber);

                    if (prevContexts == null || nextContexts == null) {
                        return null;
                    }

                    const [prevLegacyContext, prevModernContext] = prevContexts;
                    const [nextLegacyContext, nextModernContext] = nextContexts;

                    if (nextLegacyContext !== NO_CONTEXT) {
                        return getChangedKeys(prevLegacyContext, nextLegacyContext);
                    } else if (nextModernContext !== NO_CONTEXT) {
                        return prevModernContext !== nextModernContext;
                    }
                }

                break;
        }

        return null;
    }

    function didHooksChange(prev, next) {
        if (next == null) {
            return false;
        } // We can't report anything meaningful for hooks changes.

        if (
            next.hasOwnProperty('baseState') &&
            next.hasOwnProperty('memoizedState') &&
            next.hasOwnProperty('next') &&
            next.hasOwnProperty('queue')
        ) {
            while (next !== null) {
                if (next.memoizedState !== prev.memoizedState) {
                    return true;
                } else {
                    next = next.next;
                    prev = prev.next;
                }
            }
        }

        return false;
    }

    function getChangedKeys(prev, next) {
        if (prev == null || next == null) {
            return null;
        } // We can't report anything meaningful for hooks changes.

        if (
            next.hasOwnProperty('baseState') &&
            next.hasOwnProperty('memoizedState') &&
            next.hasOwnProperty('next') &&
            next.hasOwnProperty('queue')
        ) {
            return null;
        }

        const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
        const changedKeys = []; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

        for (const key of keys) {
            if (prev[key] !== next[key]) {
                changedKeys.push(key);
            }
        }

        return changedKeys;
    } // eslint-disable-next-line no-unused-vars

    function didFiberRender(prevFiber, nextFiber) {
        switch (nextFiber.tag) {
            case ClassComponent:
            case FunctionComponent:
            case ContextConsumer:
            case MemoComponent:
            case SimpleMemoComponent:
                // For types that execute user code, we check PerformedWork effect.
                // We don't reflect bailouts (either referential or sCU) in DevTools.
                // eslint-disable-next-line no-bitwise
                return (nextFiber.effectTag & PerformedWork) === PerformedWork;
            // Note: ContextConsumer only gets PerformedWork effect in 16.3.3+
            // so it won't get highlighted with React 16.3.0 to 16.3.2.

            default:
                // For host components and other types, we compare inputs
                // to determine whether something is an update.
                return (
                    prevFiber.memoizedProps !== nextFiber.memoizedProps ||
                    prevFiber.memoizedState !== nextFiber.memoizedState ||
                    prevFiber.ref !== nextFiber.ref
                );
        }
    }

    const pendingOperations = [];
    const pendingRealUnmountedIDs = [];
    const pendingSimulatedUnmountedIDs = [];
    let pendingOperationsQueue = [];
    const pendingStringTable = new Map();
    let pendingStringTableLength = 0;
    let pendingUnmountedRootID = null;

    function pushOperation(op) {
        // === react-app-action-changes ===
        // if (__DEV__) {
        {
            // === end of react-app-action-changes ===
            if (!Number.isInteger(op)) {
                console.error('pushOperation() was called but the value is not an integer.', op);
            }
        }

        pendingOperations.push(op);
    }

    function flushPendingEvents(root) {
        if (
            pendingOperations.length === 0 &&
            pendingRealUnmountedIDs.length === 0 &&
            pendingSimulatedUnmountedIDs.length === 0 &&
            pendingUnmountedRootID === null
        ) {
            // If we aren't profiling, we can just bail out here.
            // No use sending an empty update over the bridge.
            //
            // The Profiler stores metadata for each commit and reconstructs the app tree per commit using:
            // (1) an initial tree snapshot and
            // (2) the operations array for each commit
            // Because of this, it's important that the operations and metadata arrays align,
            // So it's important not to ommit even empty operations while profiing is active.
            if (!isProfiling) {
                return;
            }
        }

        const numUnmountIDs =
            pendingRealUnmountedIDs.length +
            pendingSimulatedUnmountedIDs.length +
            (pendingUnmountedRootID === null ? 0 : 1);
        const operations = new Array( // Identify which renderer this update is coming from.
            2 + // [rendererID, rootFiberID]
                // How big is the string table?
                1 + // [stringTableLength]
                // Then goes the actual string table.
                pendingStringTableLength + // All unmounts are batched in a single message.
                // [TREE_OPERATION_REMOVE, removedIDLength, ...ids]
                (numUnmountIDs > 0 ? 2 + numUnmountIDs : 0) + // Regular operations
                pendingOperations.length,
        ); // Identify which renderer this update is coming from.
        // This enables roots to be mapped to renderers,
        // Which in turn enables fiber props, states, and hooks to be inspected.

        let i = 0;
        operations[i++] = rendererID;
        operations[i++] = currentRootID; // Use this ID in case the root was unmounted!
        // Now fill in the string table.
        // [stringTableLength, str1Length, ...str1, str2Length, ...str2, ...]

        operations[i++] = pendingStringTableLength;
        pendingStringTable.forEach((value, key) => {
            operations[i++] = key.length;
            const encodedKey = utfEncodeString(key);

            for (let j = 0; j < encodedKey.length; j++) {
                operations[i + j] = encodedKey[j];
            }

            i += key.length;
        });

        if (numUnmountIDs > 0) {
            // All unmounts except roots are batched in a single message.
            operations[i++] = TREE_OPERATION_REMOVE; // The first number is how many unmounted IDs we're gonna send.

            operations[i++] = numUnmountIDs; // Fill in the real unmounts in the reverse order.
            // They were inserted parents-first by React, but we want children-first.
            // So we traverse our array backwards.

            for (let j = pendingRealUnmountedIDs.length - 1; j >= 0; j--) {
                operations[i++] = pendingRealUnmountedIDs[j];
            } // Fill in the simulated unmounts (hidden Suspense subtrees) in their order.
            // (We want children to go before parents.)
            // They go *after* the real unmounts because we know for sure they won't be
            // children of already pushed "real" IDs. If they were, we wouldn't be able
            // to discover them during the traversal, as they would have been deleted.

            for (let j = 0; j < pendingSimulatedUnmountedIDs.length; j++) {
                operations[i + j] = pendingSimulatedUnmountedIDs[j];
            }

            i += pendingSimulatedUnmountedIDs.length; // The root ID should always be unmounted last.

            if (pendingUnmountedRootID !== null) {
                operations[i] = pendingUnmountedRootID;
                i++;
            }
        } // Fill in the rest of the operations.

        for (let j = 0; j < pendingOperations.length; j++) {
            operations[i + j] = pendingOperations[j];
        }

        i += pendingOperations.length; // Let the frontend know about tree operations.
        // The first value in this array will identify which root it corresponds to,
        // so we do no longer need to dispatch a separate root-committed event.

        if (pendingOperationsQueue !== null) {
            // Until the frontend has been connected, store the tree operations.
            // This will let us avoid walking the tree later when the frontend connects,
            // and it enables the Profiler's reload-and-profile functionality to work as well.
            pendingOperationsQueue.push(operations);
        } else {
            // If we've already connected to the frontend, just pass the operations through.
            hook.emit('operations', operations);
        }

        pendingOperations.length = 0;
        pendingRealUnmountedIDs.length = 0;
        pendingSimulatedUnmountedIDs.length = 0;
        pendingUnmountedRootID = null;
        pendingStringTable.clear();
        pendingStringTableLength = 0;
    }

    function getStringID(str) {
        if (str === null) {
            return 0;
        }

        const existingID = pendingStringTable.get(str);

        if (existingID !== undefined) {
            return existingID;
        }

        const stringID = pendingStringTable.size + 1;
        pendingStringTable.set(str, stringID); // The string table total length needs to account
        // both for the string length, and for the array item
        // that contains the length itself. Hence + 1.

        pendingStringTableLength += str.length + 1;
        return stringID;
    }

    function recordMount(fiber, parentFiber) {
        const isRoot = fiber.tag === HostRoot;
        const id = getFiberID(getPrimaryFiber(fiber));
        const hasOwnerMetadata = fiber.hasOwnProperty('_debugOwner');
        const isProfilingSupported = fiber.hasOwnProperty('treeBaseDuration');

        if (isRoot) {
            pushOperation(TREE_OPERATION_ADD);
            pushOperation(id);
            pushOperation(ElementTypeRoot);
            pushOperation(isProfilingSupported ? 1 : 0);
            pushOperation(hasOwnerMetadata ? 1 : 0);

            if (isProfiling) {
                if (displayNamesByRootID !== null) {
                    displayNamesByRootID.set(id, getDisplayNameForRoot(fiber));
                }
            }
        } else {
            const { key } = fiber;
            const displayName = getDisplayNameForFiber(fiber);
            const elementType = getElementTypeForFiber(fiber);
            const { _debugOwner } = fiber;
            const ownerID = _debugOwner != null ? getFiberID(getPrimaryFiber(_debugOwner)) : 0;
            const parentID = parentFiber ? getFiberID(getPrimaryFiber(parentFiber)) : 0;
            const displayNameStringID = getStringID(displayName); // This check is a guard to handle a React element that has been modified
            // in such a way as to bypass the default stringification of the "key" property.

            const keyString = key === null ? null : '' + key;
            const keyStringID = getStringID(keyString);
            pushOperation(TREE_OPERATION_ADD);
            pushOperation(id);
            pushOperation(elementType);
            pushOperation(parentID);
            pushOperation(ownerID);
            pushOperation(displayNameStringID);
            pushOperation(keyStringID);
        }

        if (isProfilingSupported) {
            idToRootMap.set(id, currentRootID);
            recordProfilingDurations(fiber);
        }
    }

    function recordUnmount(fiber, isSimulated) {
        if (trackedPathMatchFiber !== null) {
            // We're in the process of trying to restore previous selection.
            // If this fiber matched but is being unmounted, there's no use trying.
            // Reset the state so we don't keep holding onto it.
            if (fiber === trackedPathMatchFiber || fiber === trackedPathMatchFiber.alternate) {
                setTrackedPath(null);
            }
        }

        const isRoot = fiber.tag === HostRoot;
        const primaryFiber = getPrimaryFiber(fiber);

        if (!fiberToIDMap.has(primaryFiber)) {
            // If we've never seen this Fiber, it might be because
            // it is inside a non-current Suspense fragment tree,
            // and so the store is not even aware of it.
            // In that case we can just ignore it, or otherwise
            // there will be errors later on.
            primaryFibers.delete(primaryFiber); // TODO: this is fragile and can obscure actual bugs.

            return;
        }

        const id = getFiberID(primaryFiber);

        if (isRoot) {
            // Roots must be removed only after all children (pending and simultated) have been removed.
            // So we track it separately.
            pendingUnmountedRootID = id;
        } else if (!shouldFilterFiber(fiber)) {
            // To maintain child-first ordering,
            // we'll push it into one of these queues,
            // and later arrange them in the correct order.
            if (isSimulated) {
                pendingSimulatedUnmountedIDs.push(id);
            } else {
                pendingRealUnmountedIDs.push(id);
            }
        }

        fiberToIDMap.delete(primaryFiber);
        idToFiberMap.delete(id);
        primaryFibers.delete(primaryFiber);
        const isProfilingSupported = fiber.hasOwnProperty('treeBaseDuration');

        if (isProfilingSupported) {
            idToRootMap.delete(id);
            idToTreeBaseDurationMap.delete(id);
        }
    }

    function mountFiberRecursively(fiber, parentFiber, traverseSiblings, traceNearestHostComponentUpdate) {
        // Also remember whether to do the same for siblings.

        const mightSiblingsBeOnTrackedPath = updateTrackedPathStateBeforeMount(fiber);
        const shouldIncludeInTree = !shouldFilterFiber(fiber);

        if (shouldIncludeInTree) {
            recordMount(fiber, parentFiber);
        }

        if (traceUpdatesEnabled) {
            if (traceNearestHostComponentUpdate) {
                const elementType = getElementTypeForFiber(fiber); // If an ancestor updated, we should mark the nearest host nodes for highlighting.

                if (elementType === ElementTypeHostComponent) {
                    traceUpdatesForNodes.add(fiber.stateNode);
                    traceNearestHostComponentUpdate = false;
                }
            } // We intentionally do not re-enable the traceNearestHostComponentUpdate flag in this branch,
            // because we don't want to highlight every host node inside of a newly mounted subtree.
        }

        const isTimedOutSuspense = fiber.tag === ReactTypeOfWork.SuspenseComponent && fiber.memoizedState !== null;

        if (isTimedOutSuspense) {
            // Special case: if Suspense mounts in a timed-out state,
            // get the fallback child from the inner fragment and mount
            // it as if it was our own child. Updates handle this too.
            const primaryChildFragment = fiber.child;
            const fallbackChildFragment = primaryChildFragment ? primaryChildFragment.sibling : null;
            const fallbackChild = fallbackChildFragment ? fallbackChildFragment.child : null;

            if (fallbackChild !== null) {
                mountFiberRecursively(
                    fallbackChild,
                    shouldIncludeInTree ? fiber : parentFiber,
                    true,
                    traceNearestHostComponentUpdate,
                );
            }
        } else {
            if (fiber.child !== null) {
                mountFiberRecursively(
                    fiber.child,
                    shouldIncludeInTree ? fiber : parentFiber,
                    true,
                    traceNearestHostComponentUpdate,
                );
            }
        } // We're exiting this Fiber now, and entering its siblings.
        // If we have selection to restore, we might need to re-activate tracking.

        updateTrackedPathStateAfterMount(mightSiblingsBeOnTrackedPath);

        if (traverseSiblings && fiber.sibling !== null) {
            mountFiberRecursively(fiber.sibling, parentFiber, true, traceNearestHostComponentUpdate);
        }
    } // We use this to simulate unmounting for Suspense trees
    // when we switch from primary to fallback.

    function unmountFiberChildrenRecursively(fiber) {
        const isTimedOutSuspense = fiber.tag === ReactTypeOfWork.SuspenseComponent && fiber.memoizedState !== null;
        let child = fiber.child;

        if (isTimedOutSuspense) {
            // If it's showing fallback tree, let's traverse it instead.
            const primaryChildFragment = fiber.child;
            const fallbackChildFragment = primaryChildFragment ? primaryChildFragment.sibling : null; // Skip over to the real Fiber child.

            child = fallbackChildFragment ? fallbackChildFragment.child : null;
        }

        while (child !== null) {
            // Record simulated unmounts children-first.
            // We skip nodes without return because those are real unmounts.
            if (child.return !== null) {
                unmountFiberChildrenRecursively(child);
                recordUnmount(child, true);
            }

            child = child.sibling;
        }
    }

    function recordProfilingDurations(fiber) {
        const id = getFiberID(getPrimaryFiber(fiber));
        const { actualDuration, treeBaseDuration } = fiber;
        idToTreeBaseDurationMap.set(id, treeBaseDuration || 0);

        if (isProfiling) {
            const { alternate } = fiber; // It's important to update treeBaseDuration even if the current Fiber did not render,
            // becuase it's possible that one of its descednants did.

            if (alternate == null || treeBaseDuration !== alternate.treeBaseDuration) {
                // Tree base duration updates are included in the operations typed array.
                // So we have to convert them from milliseconds to microseconds so we can send them as ints.
                const convertedTreeBaseDuration = Math.floor((treeBaseDuration || 0) * 1000);
                pushOperation(TREE_OPERATION_UPDATE_TREE_BASE_DURATION);
                pushOperation(id);
                pushOperation(convertedTreeBaseDuration);
            }

            if (alternate == null || didFiberRender(alternate, fiber)) {
                if (actualDuration != null) {
                    // The actual duration reported by React includes time spent working on children.
                    // This is useful information, but it's also useful to be able to exclude child durations.
                    // The frontend can't compute this, since the immediate children may have been filtered out.
                    // So we need to do this on the backend.
                    // Note that this calculated self duration is not the same thing as the base duration.
                    // The two are calculated differently (tree duration does not accumulate).
                    let selfDuration = actualDuration;
                    let child = fiber.child;

                    while (child !== null) {
                        selfDuration -= child.actualDuration || 0;
                        child = child.sibling;
                    } // If profiling is active, store durations for elements that were rendered during the commit.
                    // Note that we should do this for any fiber we performed work on, regardless of its actualDuration value.
                    // In some cases actualDuration might be 0 for fibers we worked on (particularly if we're using Date.now)
                    // In other cases (e.g. Memo) actualDuration might be greater than 0 even if we "bailed out".

                    const metadata = currentCommitProfilingMetadata;
                    metadata.durations.push(id, actualDuration, selfDuration);
                    metadata.maxActualDuration = Math.max(metadata.maxActualDuration, actualDuration);

                    if (recordChangeDescriptions) {
                        const changeDescription = getChangeDescription(alternate, fiber);

                        if (changeDescription !== null) {
                            if (metadata.changeDescriptions !== null) {
                                metadata.changeDescriptions.set(id, changeDescription);
                            }
                        }

                        updateContextsForFiber(fiber);
                    }
                }
            }
        }
    }

    function recordResetChildren(fiber, childSet) {
        // The frontend only really cares about the displayName, key, and children.
        // The first two don't really change, so we are only concerned with the order of children here.
        // This is trickier than a simple comparison though, since certain types of fibers are filtered.
        const nextChildren = []; // This is a naive implimentation that shallowly recurses children.
        // We might want to revisit this if it proves to be too inefficient.

        let child = childSet;

        while (child !== null) {
            findReorderedChildrenRecursively(child, nextChildren);
            child = child.sibling;
        }

        const numChildren = nextChildren.length;

        if (numChildren < 2) {
            // No need to reorder.
            return;
        }

        pushOperation(TREE_OPERATION_REORDER_CHILDREN);
        pushOperation(getFiberID(getPrimaryFiber(fiber)));
        pushOperation(numChildren);

        for (let i = 0; i < nextChildren.length; i++) {
            pushOperation(nextChildren[i]);
        }
    }

    function findReorderedChildrenRecursively(fiber, nextChildren) {
        if (!shouldFilterFiber(fiber)) {
            nextChildren.push(getFiberID(getPrimaryFiber(fiber)));
        } else {
            let child = fiber.child;

            while (child !== null) {
                findReorderedChildrenRecursively(child, nextChildren);
                child = child.sibling;
            }
        }
    } // Returns whether closest unfiltered fiber parent needs to reset its child list.

    function updateFiberRecursively(nextFiber, prevFiber, parentFiber, traceNearestHostComponentUpdate) {
        if (traceUpdatesEnabled) {
            const elementType = getElementTypeForFiber(nextFiber);

            if (traceNearestHostComponentUpdate) {
                // If an ancestor updated, we should mark the nearest host nodes for highlighting.
                if (elementType === ElementTypeHostComponent) {
                    traceUpdatesForNodes.add(nextFiber.stateNode);
                    traceNearestHostComponentUpdate = false;
                }
            } else {
                if (
                    elementType === ElementTypeFunction ||
                    elementType === ElementTypeClass ||
                    elementType === ElementTypeContext
                ) {
                    // Otherwise if this is a traced ancestor, flag for the nearest host descendant(s).
                    traceNearestHostComponentUpdate = didFiberRender(prevFiber, nextFiber);
                }
            }
        }

        if (
            mostRecentlyInspectedElement !== null &&
            mostRecentlyInspectedElement.id === getFiberID(getPrimaryFiber(nextFiber)) &&
            didFiberRender(prevFiber, nextFiber)
        ) {
            // If this Fiber has updated, clear cached inspected data.
            // If it is inspected again, it may need to be re-run to obtain updated hooks values.
            hasElementUpdatedSinceLastInspected = true;
        }

        const shouldIncludeInTree = !shouldFilterFiber(nextFiber);
        const isSuspense = nextFiber.tag === SuspenseComponent;
        let shouldResetChildren = false; // The behavior of timed-out Suspense trees is unique.
        // Rather than unmount the timed out content (and possibly lose important state),
        // React re-parents this content within a hidden Fragment while the fallback is showing.
        // This behavior doesn't need to be observable in the DevTools though.
        // It might even result in a bad user experience for e.g. node selection in the Elements panel.
        // The easiest fix is to strip out the intermediate Fragment fibers,
        // so the Elements panel and Profiler don't need to special case them.
        // Suspense components only have a non-null memoizedState if they're timed-out.

        const prevDidTimeout = isSuspense && prevFiber.memoizedState !== null;
        const nextDidTimeOut = isSuspense && nextFiber.memoizedState !== null; // The logic below is inspired by the codepaths in updateSuspenseComponent()
        // inside ReactFiberBeginWork in the React source code.

        if (prevDidTimeout && nextDidTimeOut) {
            // Fallback -> Fallback:
            // 1. Reconcile fallback set.
            const nextFiberChild = nextFiber.child;
            const nextFallbackChildSet = nextFiberChild ? nextFiberChild.sibling : null; // Note: We can't use nextFiber.child.sibling.alternate
            // because the set is special and alternate may not exist.

            const prevFiberChild = prevFiber.child;
            const prevFallbackChildSet = prevFiberChild ? prevFiberChild.sibling : null;

            if (
                nextFallbackChildSet != null &&
                prevFallbackChildSet != null &&
                updateFiberRecursively(
                    nextFallbackChildSet,
                    prevFallbackChildSet,
                    nextFiber,
                    traceNearestHostComponentUpdate,
                )
            ) {
                shouldResetChildren = true;
            }
        } else if (prevDidTimeout && !nextDidTimeOut) {
            // Fallback -> Primary:
            // 1. Unmount fallback set
            // Note: don't emulate fallback unmount because React actually did it.
            // 2. Mount primary set
            const nextPrimaryChildSet = nextFiber.child;

            if (nextPrimaryChildSet !== null) {
                mountFiberRecursively(nextPrimaryChildSet, nextFiber, true, traceNearestHostComponentUpdate);
            }

            shouldResetChildren = true;
        } else if (!prevDidTimeout && nextDidTimeOut) {
            // Primary -> Fallback:
            // 1. Hide primary set
            // This is not a real unmount, so it won't get reported by React.
            // We need to manually walk the previous tree and record unmounts.
            unmountFiberChildrenRecursively(prevFiber); // 2. Mount fallback set

            const nextFiberChild = nextFiber.child;
            const nextFallbackChildSet = nextFiberChild ? nextFiberChild.sibling : null;

            if (nextFallbackChildSet != null) {
                mountFiberRecursively(nextFallbackChildSet, nextFiber, true, traceNearestHostComponentUpdate);
                shouldResetChildren = true;
            }
        } else {
            // Common case: Primary -> Primary.
            // This is the same codepath as for non-Suspense fibers.
            if (nextFiber.child !== prevFiber.child) {
                // If the first child is different, we need to traverse them.
                // Each next child will be either a new child (mount) or an alternate (update).
                let nextChild = nextFiber.child;
                let prevChildAtSameIndex = prevFiber.child;

                while (nextChild) {
                    // We already know children will be referentially different because
                    // they are either new mounts or alternates of previous children.
                    // Schedule updates and mounts depending on whether alternates exist.
                    // We don't track deletions here because they are reported separately.
                    if (nextChild.alternate) {
                        const prevChild = nextChild.alternate;

                        if (
                            updateFiberRecursively(
                                nextChild,
                                prevChild,
                                shouldIncludeInTree ? nextFiber : parentFiber,
                                traceNearestHostComponentUpdate,
                            )
                        ) {
                            // If a nested tree child order changed but it can't handle its own
                            // child order invalidation (e.g. because it's filtered out like host nodes),
                            // propagate the need to reset child order upwards to this Fiber.
                            shouldResetChildren = true;
                        } // However we also keep track if the order of the children matches
                        // the previous order. They are always different referentially, but
                        // if the instances line up conceptually we'll want to know that.

                        if (prevChild !== prevChildAtSameIndex) {
                            shouldResetChildren = true;
                        }
                    } else {
                        mountFiberRecursively(
                            nextChild,
                            shouldIncludeInTree ? nextFiber : parentFiber,
                            false,
                            traceNearestHostComponentUpdate,
                        );
                        shouldResetChildren = true;
                    } // Try the next child.

                    nextChild = nextChild.sibling; // Advance the pointer in the previous list so that we can
                    // keep comparing if they line up.

                    if (!shouldResetChildren && prevChildAtSameIndex !== null) {
                        prevChildAtSameIndex = prevChildAtSameIndex.sibling;
                    }
                } // If we have no more children, but used to, they don't line up.

                if (prevChildAtSameIndex !== null) {
                    shouldResetChildren = true;
                }
            } else {
                if (traceUpdatesEnabled) {
                    // If we're tracing updates and we've bailed out before reaching a host node,
                    // we should fall back to recursively marking the nearest host descendates for highlight.
                    if (traceNearestHostComponentUpdate) {
                        const hostFibers = findAllCurrentHostFibers(getFiberID(getPrimaryFiber(nextFiber)));
                        hostFibers.forEach(hostFiber => {
                            traceUpdatesForNodes.add(hostFiber.stateNode);
                        });
                    }
                }
            }
        }

        if (shouldIncludeInTree) {
            const isProfilingSupported = nextFiber.hasOwnProperty('treeBaseDuration');

            if (isProfilingSupported) {
                recordProfilingDurations(nextFiber);
            }
        }

        if (shouldResetChildren) {
            // We need to crawl the subtree for closest non-filtered Fibers
            // so that we can display them in a flat children set.
            if (shouldIncludeInTree) {
                // Normally, search for children from the rendered child.
                let nextChildSet = nextFiber.child;

                if (nextDidTimeOut) {
                    // Special case: timed-out Suspense renders the fallback set.
                    const nextFiberChild = nextFiber.child;
                    nextChildSet = nextFiberChild ? nextFiberChild.sibling : null;
                }

                if (nextChildSet != null) {
                    recordResetChildren(nextFiber, nextChildSet);
                } // We've handled the child order change for this Fiber.
                // Since it's included, there's no need to invalidate parent child order.

                return false;
            } else {
                // Let the closest unfiltered parent Fiber reset its child order instead.
                return true;
            }
        } else {
            return false;
        }
    }

    function cleanup() {
        // We don't patch any methods so there is no cleanup.
    }

    function flushInitialOperations() {
        const localPendingOperationsQueue = pendingOperationsQueue;
        pendingOperationsQueue = null;

        if (localPendingOperationsQueue !== null && localPendingOperationsQueue.length > 0) {
            // We may have already queued up some operations before the frontend connected
            // If so, let the frontend know about them.
            localPendingOperationsQueue.forEach(operations => {
                hook.emit('operations', operations);
            });
        } else {
            // Before the traversals, remember to start tracking
            // our path in case we have selection to restore.
            if (trackedPath !== null) {
                mightBeOnTrackedPath = true;
            } // If we have not been profiling, then we can just walk the tree and build up its current state as-is.

            hook.getFiberRoots(rendererID).forEach(root => {
                currentRootID = getFiberID(getPrimaryFiber(root.current));
                setRootPseudoKey(currentRootID, root.current); // Checking root.memoizedInteractions handles multi-renderer edge-case-
                // where some v16 renderers support profiling and others don't.

                if (isProfiling && root.memoizedInteractions != null) {
                    // If profiling is active, store commit time and duration, and the current interactions.
                    // The frontend may request this information after profiling has stopped.
                    currentCommitProfilingMetadata = {
                        changeDescriptions: recordChangeDescriptions ? new Map() : null,
                        durations: [],
                        commitTime: getCurrentTime() - profilingStartTime,
                        interactions: Array.from(root.memoizedInteractions).map(interaction => ({
                            ...interaction,
                            timestamp: interaction.timestamp - profilingStartTime,
                        })),
                        maxActualDuration: 0,
                        priorityLevel: null,
                    };
                }

                mountFiberRecursively(root.current, null, false, false);
                flushPendingEvents();
                currentRootID = -1;
            });
        }
    }

    function handleCommitFiberUnmount(fiber) {
        // This is not recursive.
        // We can't traverse fibers after unmounting so instead
        // we rely on React telling us about each unmount.
        recordUnmount(fiber, false);
    }

    function handleCommitFiberRoot(root, priorityLevel) {
        const current = root.current;
        const alternate = current.alternate;
        currentRootID = getFiberID(getPrimaryFiber(current)); // Before the traversals, remember to start tracking
        // our path in case we have selection to restore.

        if (trackedPath !== null) {
            mightBeOnTrackedPath = true;
        }

        if (traceUpdatesEnabled) {
            traceUpdatesForNodes.clear();
        } // Checking root.memoizedInteractions handles multi-renderer edge-case-
        // where some v16 renderers support profiling and others don't.

        const isProfilingSupported = root.memoizedInteractions != null;

        if (isProfiling && isProfilingSupported) {
            // If profiling is active, store commit time and duration, and the current interactions.
            // The frontend may request this information after profiling has stopped.
            currentCommitProfilingMetadata = {
                changeDescriptions: recordChangeDescriptions ? new Map() : null,
                durations: [],
                commitTime: getCurrentTime() - profilingStartTime,
                interactions: Array.from(root.memoizedInteractions).map(interaction => ({
                    ...interaction,
                    timestamp: interaction.timestamp - profilingStartTime,
                })),
                maxActualDuration: 0,
                priorityLevel: priorityLevel == null ? null : formatPriorityLevel(priorityLevel),
            };
        }

        if (alternate) {
            // TODO: relying on this seems a bit fishy.
            const wasMounted = alternate.memoizedState != null && alternate.memoizedState.element != null;
            const isMounted = current.memoizedState != null && current.memoizedState.element != null;

            if (!wasMounted && isMounted) {
                // Mount a new root.
                setRootPseudoKey(currentRootID, current);
                mountFiberRecursively(current, null, false, false);
            } else if (wasMounted && isMounted) {
                // Update an existing root.
                updateFiberRecursively(current, alternate, null, false);
            } else if (wasMounted && !isMounted) {
                // Unmount an existing root.
                removeRootPseudoKey(currentRootID);
                recordUnmount(current, false);
            }
        } else {
            // Mount a new root.
            setRootPseudoKey(currentRootID, current);
            mountFiberRecursively(current, null, false, false);
        }

        if (isProfiling && isProfilingSupported) {
            const commitProfilingMetadata = rootToCommitProfilingMetadataMap.get(currentRootID);

            if (commitProfilingMetadata != null) {
                commitProfilingMetadata.push(currentCommitProfilingMetadata);
            } else {
                rootToCommitProfilingMetadataMap.set(currentRootID, [currentCommitProfilingMetadata]);
            }
        } // We're done here.

        flushPendingEvents();

        if (traceUpdatesEnabled) {
            hook.emit('traceUpdates', traceUpdatesForNodes);
        }

        currentRootID = -1;
    }

    function findAllCurrentHostFibers(id) {
        const fibers = [];
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (!fiber) {
            return fibers;
        } // Next we'll drill down this component to find all HostComponent/Text.

        let node = fiber;

        while (true) {
            if (node.tag === HostComponent || node.tag === HostText) {
                fibers.push(node);
            } else if (node.child) {
                node.child.return = node;
                node = node.child;
                continue;
            }

            if (node === fiber) {
                return fibers;
            }

            while (!node.sibling) {
                if (!node.return || node.return === fiber) {
                    return fibers;
                }

                node = node.return;
            }

            node.sibling.return = node.return;
            node = node.sibling;
        } // Flow needs the return here, but ESLint complains about it.
        // eslint-disable-next-line no-unreachable

        return fibers;
    }

    function findNativeNodesForFiberID(id) {
        try {
            let fiber = findCurrentFiberUsingSlowPathById(id);

            if (fiber === null) {
                return null;
            } // Special case for a timed-out Suspense.

            const isTimedOutSuspense = fiber.tag === SuspenseComponent && fiber.memoizedState !== null;

            if (isTimedOutSuspense) {
                // A timed-out Suspense's findDOMNode is useless.
                // Try our best to find the fallback directly.
                const maybeFallbackFiber = fiber.child && fiber.child.sibling;

                if (maybeFallbackFiber != null) {
                    fiber = maybeFallbackFiber;
                }
            }

            const hostFibers = findAllCurrentHostFibers(id);
            return hostFibers.map(hostFiber => hostFiber.stateNode).filter(Boolean);
        } catch (err) {
            // The fiber might have unmounted by now.
            return null;
        }
    }

    function getDisplayNameForFiberID(id) {
        const fiber = idToFiberMap.get(id);
        return fiber != null ? getDisplayNameForFiber(fiber) : null;
    }

    function getFiberIDForNative(hostInstance, findNearestUnfilteredAncestor = false) {
        let fiber = renderer.findFiberByHostInstance(hostInstance);

        if (fiber != null) {
            if (findNearestUnfilteredAncestor) {
                while (fiber !== null && shouldFilterFiber(fiber)) {
                    fiber = fiber.return;
                }
            }

            return getFiberID(getPrimaryFiber(fiber));
        }

        return null;
    }

    const MOUNTING = 1;
    const MOUNTED = 2;
    const UNMOUNTED = 3; // This function is copied from React and should be kept in sync:
    // https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberTreeReflection.js

    function isFiberMountedImpl(fiber) {
        let node = fiber;

        if (!fiber.alternate) {
            // If there is no alternate, this might be a new tree that isn't inserted
            // yet. If it is, then it will have a pending insertion effect on it.
            if ((node.effectTag & Placement) !== NoEffect) {
                return MOUNTING;
            }

            while (node.return) {
                node = node.return;

                if ((node.effectTag & Placement) !== NoEffect) {
                    return MOUNTING;
                }
            }
        } else {
            while (node.return) {
                node = node.return;
            }
        }

        if (node.tag === HostRoot) {
            // TODO: Check if this was a nested HostRoot when used with
            // renderContainerIntoSubtree.
            return MOUNTED;
        } // If we didn't hit the root, that means that we're in an disconnected tree
        // that has been unmounted.

        return UNMOUNTED;
    } // This function is copied from React and should be kept in sync:
    // https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberTreeReflection.js
    // It would be nice if we updated React to inject this function directly (vs just indirectly via findDOMNode).
    // BEGIN copied code

    function findCurrentFiberUsingSlowPathById(id) {
        const fiber = idToFiberMap.get(id);

        if (fiber == null) {
            console.warn(`Could not find Fiber with id "${id}"`);
            return null;
        }

        const alternate = fiber.alternate;

        if (!alternate) {
            // If there is no alternate, then we only need to check if it is mounted.
            const state = isFiberMountedImpl(fiber);

            if (state === UNMOUNTED) {
                throw Error('Unable to find node on an unmounted component.');
            }

            if (state === MOUNTING) {
                return null;
            }

            return fiber;
        } // If we have two possible branches, we'll walk backwards up to the root
        // to see what path the root points to. On the way we may hit one of the
        // special cases and we'll deal with them.

        let a = fiber;
        let b = alternate;

        while (true) {
            const parentA = a.return;

            if (parentA === null) {
                // We're at the root.
                break;
            }

            const parentB = parentA.alternate;

            if (parentB === null) {
                // There is no alternate. This is an unusual case. Currently, it only
                // happens when a Suspense component is hidden. An extra fragment fiber
                // is inserted in between the Suspense fiber and its children. Skip
                // over this extra fragment fiber and proceed to the next parent.
                const nextParent = parentA.return;

                if (nextParent !== null) {
                    a = b = nextParent;
                    continue;
                } // If there's no parent, we're at the root.

                break;
            } // If both copies of the parent fiber point to the same child, we can
            // assume that the child is current. This happens when we bailout on low
            // priority: the bailed out fiber's child reuses the current child.

            if (parentA.child === parentB.child) {
                let child = parentA.child;

                while (child) {
                    if (child === a) {
                        // We've determined that A is the current branch.
                        if (isFiberMountedImpl(parentA) !== MOUNTED) {
                            throw Error('Unable to find node on an unmounted component.');
                        }

                        return fiber;
                    }

                    if (child === b) {
                        // We've determined that B is the current branch.
                        if (isFiberMountedImpl(parentA) !== MOUNTED) {
                            throw Error('Unable to find node on an unmounted component.');
                        }

                        return alternate;
                    }

                    child = child.sibling;
                } // We should never have an alternate for any mounting node. So the only
                // way this could possibly happen is if this was unmounted, if at all.

                throw Error('Unable to find node on an unmounted component.');
            }

            if (a.return !== b.return) {
                // The return pointer of A and the return pointer of B point to different
                // fibers. We assume that return pointers never criss-cross, so A must
                // belong to the child set of A.return, and B must belong to the child
                // set of B.return.
                a = parentA;
                b = parentB;
            } else {
                // The return pointers point to the same fiber. We'll have to use the
                // default, slow path: scan the child sets of each parent alternate to see
                // which child belongs to which set.
                //
                // Search parent A's child set
                let didFindChild = false;
                let child = parentA.child;

                while (child) {
                    if (child === a) {
                        didFindChild = true;
                        a = parentA;
                        b = parentB;
                        break;
                    }

                    if (child === b) {
                        didFindChild = true;
                        b = parentA;
                        a = parentB;
                        break;
                    }

                    child = child.sibling;
                }

                if (!didFindChild) {
                    // Search parent B's child set
                    child = parentB.child;

                    while (child) {
                        if (child === a) {
                            didFindChild = true;
                            a = parentB;
                            b = parentA;
                            break;
                        }

                        if (child === b) {
                            didFindChild = true;
                            b = parentB;
                            a = parentA;
                            break;
                        }

                        child = child.sibling;
                    }

                    if (!didFindChild) {
                        throw Error(
                            'Child was not found in either parent set. This indicates a bug ' +
                                'in React related to the return pointer. Please file an issue.',
                        );
                    }
                }
            }

            if (a.alternate !== b) {
                throw Error(
                    "Return fibers should always be each others' alternates. " +
                        'This error is likely caused by a bug in React. Please file an issue.',
                );
            }
        } // If the root is not a host container, we're in a disconnected tree. I.e.
        // unmounted.

        if (a.tag !== HostRoot) {
            throw Error('Unable to find node on an unmounted component.');
        }

        if (a.stateNode.current === a) {
            // We've determined that A is the current branch.
            return fiber;
        } // Otherwise B has to be current branch.

        return alternate;
    } // END copied code

    function prepareViewAttributeSource(id, path) {
        const isCurrent = isMostRecentlyInspectedElementCurrent(id);

        if (isCurrent) {
            window.$attribute = getInObject(mostRecentlyInspectedElement, path);
        }
    }

    function prepareViewElementSource(id) {
        const fiber = idToFiberMap.get(id);

        if (fiber == null) {
            console.warn(`Could not find Fiber with id "${id}"`);
            return;
        }

        const { elementType, tag, type } = fiber;

        switch (tag) {
            case ClassComponent:
            case IncompleteClassComponent:
            case IndeterminateComponent:
            case FunctionComponent:
                global.$type = type;
                break;

            case ForwardRef:
                global.$type = type.render;
                break;

            case MemoComponent:
            case SimpleMemoComponent:
                global.$type = elementType != null && elementType.type != null ? elementType.type : type;
                break;

            default:
                global.$type = null;
                break;
        }
    }

    function getOwnersList(id) {
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (fiber == null) {
            return null;
        }

        const { _debugOwner } = fiber;
        const owners = [
            {
                displayName: getDisplayNameForFiber(fiber) || 'Anonymous',
                id,
                type: getElementTypeForFiber(fiber),
            },
        ];

        if (_debugOwner) {
            let owner = _debugOwner;

            while (owner !== null) {
                owners.unshift({
                    displayName: getDisplayNameForFiber(owner) || 'Anonymous',
                    id: getFiberID(getPrimaryFiber(owner)),
                    type: getElementTypeForFiber(owner),
                });
                owner = owner._debugOwner || null;
            }
        }

        return owners;
    } // Fast path props lookup for React Native style editor.
    // Could use inspectElementRaw() but that would require shallow rendering hooks components,
    // and could also mess with memoization.

    function getInstanceAndStyle(id) {
        let instance = null;
        let style = null;
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (fiber !== null) {
            instance = fiber.stateNode;

            if (fiber.memoizedProps !== null) {
                style = fiber.memoizedProps.style;
            }
        }

        return {
            instance,
            style,
        };
    }

    function inspectElementRaw(id) {
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (fiber == null) {
            return null;
        }

        const { _debugOwner, _debugSource, dependencies, stateNode, memoizedProps, memoizedState, tag, type } = fiber;
        const elementType = getElementTypeForFiber(fiber);
        const usesHooks =
            (tag === FunctionComponent || tag === SimpleMemoComponent || tag === ForwardRef) &&
            (!!memoizedState || !!dependencies);
        const typeSymbol = getTypeSymbol(type);
        let canViewSource = false;
        let context = null;

        if (
            tag === ClassComponent ||
            tag === FunctionComponent ||
            tag === IncompleteClassComponent ||
            tag === IndeterminateComponent ||
            tag === MemoComponent ||
            tag === ForwardRef ||
            tag === SimpleMemoComponent
        ) {
            canViewSource = true;

            if (stateNode && stateNode.context != null) {
                // Don't show an empty context object for class components that don't use the context API.
                const shouldHideContext = elementType === ElementTypeClass && !(type.contextTypes || type.contextType);

                if (!shouldHideContext) {
                    context = stateNode.context;
                }
            }
        } else if (typeSymbol === CONTEXT_CONSUMER_NUMBER || typeSymbol === CONTEXT_CONSUMER_SYMBOL_STRING) {
            // 16.3-16.5 read from "type" because the Consumer is the actual context object.
            // 16.6+ should read from "type._context" because Consumer can be different (in DEV).
            // NOTE Keep in sync with getDisplayNameForFiber()
            const consumerResolvedContext = type._context || type; // Global context value.

            context = consumerResolvedContext._currentValue || null; // Look for overridden value.

            let current = fiber.return;

            while (current !== null) {
                const currentType = current.type;
                const currentTypeSymbol = getTypeSymbol(currentType);

                if (
                    currentTypeSymbol === CONTEXT_PROVIDER_NUMBER ||
                    currentTypeSymbol === CONTEXT_PROVIDER_SYMBOL_STRING
                ) {
                    // 16.3.0 exposed the context object as "context"
                    // PR #12501 changed it to "_context" for 16.3.1+
                    // NOTE Keep in sync with getDisplayNameForFiber()
                    const providerResolvedContext = currentType._context || currentType.context;

                    if (providerResolvedContext === consumerResolvedContext) {
                        context = current.memoizedProps.value;
                        break;
                    }
                }

                current = current.return;
            }
        }

        let hasLegacyContext = false;

        if (context !== null) {
            hasLegacyContext = !!type.contextTypes; // To simplify hydration and display logic for context, wrap in a value object.
            // Otherwise simple values (e.g. strings, booleans) become harder to handle.

            context = {
                value: context,
            };
        }

        let owners = null;

        if (_debugOwner) {
            owners = [];
            let owner = _debugOwner;

            while (owner !== null) {
                owners.push({
                    displayName: getDisplayNameForFiber(owner) || 'Anonymous',
                    id: getFiberID(getPrimaryFiber(owner)),
                    type: getElementTypeForFiber(owner),
                });
                owner = owner._debugOwner || null;
            }
        }

        const isTimedOutSuspense = tag === SuspenseComponent && memoizedState !== null;
        let hooks = null;

        if (usesHooks) {
            const originalConsoleMethods = {}; // Temporarily disable all console logging before re-running the hook.

            for (const method in console) {
                try {
                    originalConsoleMethods[method] = console[method]; // $FlowFixMe property error|warn is not writable.

                    console[method] = () => {};
                } catch (error) {}
            }

            try {
                hooks = inspectHooksOfFiber(fiber, renderer.currentDispatcherRef);
            } finally {
                // Restore original console functionality.
                for (const method in originalConsoleMethods) {
                    try {
                        // $FlowFixMe property error|warn is not writable.
                        console[method] = originalConsoleMethods[method];
                    } catch (error) {}
                }
            }
        }

        return {
            id,
            // Does the current renderer support editable hooks?
            canEditHooks: typeof overrideHookState === 'function',
            // Does the current renderer support editable function props?
            canEditFunctionProps: typeof overrideProps === 'function',
            canToggleSuspense:
                supportsTogglingSuspense && // If it's showing the real content, we can always flip fallback.
                (!isTimedOutSuspense || // If it's showing fallback because we previously forced it to,
                    // allow toggling it back to remove the fallback override.
                    forceFallbackForSuspenseIDs.has(id)),
            // Can view component source location.
            canViewSource,
            // Does the component have legacy context attached to it.
            hasLegacyContext,
            displayName: getDisplayNameForFiber(fiber),
            type: elementType,
            // Inspectable properties.
            // TODO Review sanitization approach for the below inspectable values.
            context,
            hooks,
            props: memoizedProps,
            state: usesHooks ? null : memoizedState,
            // List of owners
            owners,
            // Location of component in source coude.
            source: _debugSource || null,
        };
    }

    let mostRecentlyInspectedElement = null;
    let hasElementUpdatedSinceLastInspected = false;
    let currentlyInspectedPaths = {};

    function isMostRecentlyInspectedElementCurrent(id) {
        return (
            mostRecentlyInspectedElement !== null &&
            mostRecentlyInspectedElement.id === id &&
            !hasElementUpdatedSinceLastInspected
        );
    } // Track the intersection of currently inspected paths,
    // so that we can send their data along if the element is re-rendered.

    function mergeInspectedPaths(path) {
        let current = currentlyInspectedPaths;
        path.forEach(key => {
            if (!current[key]) {
                current[key] = {};
            }

            current = current[key];
        });
    }

    function updateSelectedElement(inspectedElement) {
        const { hooks, id, props } = inspectedElement;
        const fiber = idToFiberMap.get(id);

        if (fiber == null) {
            console.warn(`Could not find Fiber with id "${id}"`);
            return;
        }

        const { elementType, stateNode, tag, type } = fiber;

        switch (tag) {
            case ClassComponent:
            case IncompleteClassComponent:
            case IndeterminateComponent:
                global.$r = stateNode;
                break;

            case FunctionComponent:
                global.$r = {
                    hooks,
                    props,
                    type,
                };
                break;

            case ForwardRef:
                global.$r = {
                    props,
                    type: type.render,
                };
                break;

            case MemoComponent:
            case SimpleMemoComponent:
                global.$r = {
                    props,
                    type: elementType != null && elementType.type != null ? elementType.type : type,
                };
                break;

            default:
                global.$r = null;
                break;
        }
    }

    function storeAsGlobal(id, path, count) {
        const isCurrent = isMostRecentlyInspectedElementCurrent(id);

        if (isCurrent) {
            const value = getInObject(mostRecentlyInspectedElement, path);
            const key = `$reactTemp${count}`;
            window[key] = value;
            console.log(key);
            console.log(value);
        }
    }

    function copyElementPath(id, path) {
        const isCurrent = isMostRecentlyInspectedElementCurrent(id);

        if (isCurrent) {
            copyToClipboard(getInObject(mostRecentlyInspectedElement, path));
        }
    }

    function inspectElement(id, path) {
        const isCurrent = isMostRecentlyInspectedElementCurrent(id);

        if (isCurrent) {
            if (path != null) {
                mergeInspectedPaths(path);

                if (path[0] === 'hooks'); // If this element has not been updated since it was last inspected,
                // we can just return the subset of data in the newly-inspected path.

                return {
                    id,
                    type: 'hydrated-path',
                    path,
                    value: cleanForBridge(getInObject(mostRecentlyInspectedElement, path)),
                };
            } else {
                // If this element has not been updated since it was last inspected, we don't need to re-run it.
                // Instead we can just return the ID to indicate that it has not changed.
                return {
                    id,
                    type: 'no-change',
                };
            }
        } else {
            hasElementUpdatedSinceLastInspected = false;

            if (mostRecentlyInspectedElement === null || mostRecentlyInspectedElement.id !== id) {
                currentlyInspectedPaths = {};
            }

            mostRecentlyInspectedElement = inspectElementRaw(id);

            if (mostRecentlyInspectedElement === null) {
                return {
                    id,
                    type: 'not-found',
                };
            }

            if (path != null) {
                mergeInspectedPaths(path);
            } // Any time an inspected element has an update,
            // we should update the selected $r value as wel.
            // Do this before dehyration (cleanForBridge).

            updateSelectedElement(mostRecentlyInspectedElement); // Clone before cleaning so that we preserve the full data.
            // This will enable us to send patches without re-inspecting if hydrated paths are requested.
            // (Reducing how often we shallow-render is a better DX for function components that use hooks.)

            const cleanedInspectedElement = { ...mostRecentlyInspectedElement };
            cleanedInspectedElement.context = cleanForBridge();
            cleanedInspectedElement.hooks = cleanForBridge();
            cleanedInspectedElement.props = cleanForBridge();
            cleanedInspectedElement.state = cleanForBridge();
            return {
                id,
                type: 'full-data',
                value: cleanedInspectedElement,
            };
        }
    }

    function logElementToConsole(id) {
        const result = isMostRecentlyInspectedElementCurrent(id) ? mostRecentlyInspectedElement : inspectElementRaw(id);

        if (result === null) {
            console.warn(`Could not find Fiber with id "${id}"`);
            return;
        }

        const supportsGroup = typeof console.groupCollapsed === 'function';

        if (supportsGroup) {
            console.groupCollapsed(
                `[Click to expand] %c<${result.displayName || 'Component'} />`, // --dom-tag-name-color is the CSS variable Chrome styles HTML elements with in the console.
                'color: var(--dom-tag-name-color); font-weight: normal;',
            );
        }

        if (result.props !== null) {
            console.log('Props:', result.props);
        }

        if (result.state !== null) {
            console.log('State:', result.state);
        }

        if (result.hooks !== null) {
            console.log('Hooks:', result.hooks);
        }

        const nativeNodes = findNativeNodesForFiberID(id);

        if (nativeNodes !== null) {
            console.log('Nodes:', nativeNodes);
        }

        if (result.source !== null) {
            console.log('Location:', result.source);
        }

        if (window.chrome || /firefox/i.test(navigator.userAgent)) {
            console.log('Right-click any value to save it as a global variable for further inspection.');
        }

        if (supportsGroup) {
            console.groupEnd();
        }
    }

    function setInHook(id, index, path, value) {
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (fiber !== null) {
            if (typeof overrideHookState === 'function') {
                overrideHookState(fiber, index, path, value);
            }
        }
    }

    function setInProps(id, path, value) {
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (fiber !== null) {
            const instance = fiber.stateNode;

            if (instance === null) {
                if (typeof overrideProps === 'function') {
                    overrideProps(fiber, path, value);
                }
            } else {
                fiber.pendingProps = copyWithSet(instance.props);
                instance.forceUpdate();
            }
        }
    }

    function setInState(id, path, value) {
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (fiber !== null) {
            const instance = fiber.stateNode;
            setInObject(instance.state, path, value);
            instance.forceUpdate();
        }
    }

    function setInContext(id, path, value) {
        // To simplify hydration and display of primative context values (e.g. number, string)
        // the inspectElement() method wraps context in a {value: ...} object.
        // We need to remove the first part of the path (the "value") before continuing.
        path = path.slice(1);
        const fiber = findCurrentFiberUsingSlowPathById(id);

        if (fiber !== null) {
            const instance = fiber.stateNode;

            if (path.length === 0) {
                // Simple context value
                instance.context = value;
            } else {
                setInObject(instance.context, path, value);
            }

            instance.forceUpdate();
        }
    }

    let currentCommitProfilingMetadata = null;
    let displayNamesByRootID = null;
    let idToContextsMap = null;
    let initialTreeBaseDurationsMap = null;
    let initialIDToRootMap = null;
    let isProfiling = false;
    let profilingStartTime = 0;
    let recordChangeDescriptions = false;
    let rootToCommitProfilingMetadataMap = null;

    function getProfilingData() {
        const dataForRoots = [];

        if (rootToCommitProfilingMetadataMap === null) {
            throw Error('getProfilingData() called before any profiling data was recorded');
        }

        rootToCommitProfilingMetadataMap.forEach((commitProfilingMetadata, rootID) => {
            const commitData = [];
            const initialTreeBaseDurations = [];
            const allInteractions = new Map();
            const interactionCommits = new Map();
            const displayName = (displayNamesByRootID !== null && displayNamesByRootID.get(rootID)) || 'Unknown';

            if (initialTreeBaseDurationsMap != null) {
                initialTreeBaseDurationsMap.forEach((treeBaseDuration, id) => {
                    if (initialIDToRootMap != null && initialIDToRootMap.get(id) === rootID) {
                        // We don't need to convert milliseconds to microseconds in this case,
                        // because the profiling summary is JSON serialized.
                        initialTreeBaseDurations.push([id, treeBaseDuration]);
                    }
                });
            }

            commitProfilingMetadata.forEach((commitProfilingData, commitIndex) => {
                const {
                    changeDescriptions,
                    durations,
                    interactions,
                    maxActualDuration,
                    priorityLevel,
                    commitTime,
                } = commitProfilingData;
                const interactionIDs = [];
                interactions.forEach(interaction => {
                    if (!allInteractions.has(interaction.id)) {
                        allInteractions.set(interaction.id, interaction);
                    }

                    interactionIDs.push(interaction.id);
                    const commitIndices = interactionCommits.get(interaction.id);

                    if (commitIndices != null) {
                        commitIndices.push(commitIndex);
                    } else {
                        interactionCommits.set(interaction.id, [commitIndex]);
                    }
                });
                const fiberActualDurations = [];
                const fiberSelfDurations = [];

                for (let i = 0; i < durations.length; i += 3) {
                    const fiberID = durations[i];
                    fiberActualDurations.push([fiberID, durations[i + 1]]);
                    fiberSelfDurations.push([fiberID, durations[i + 2]]);
                }

                commitData.push({
                    changeDescriptions: changeDescriptions !== null ? Array.from(changeDescriptions.entries()) : null,
                    duration: maxActualDuration,
                    fiberActualDurations,
                    fiberSelfDurations,
                    interactionIDs,
                    priorityLevel,
                    timestamp: commitTime,
                });
            });
            dataForRoots.push({
                commitData,
                displayName,
                initialTreeBaseDurations,
                interactionCommits: Array.from(interactionCommits.entries()),
                interactions: Array.from(allInteractions.entries()),
                rootID,
            });
        });
        return {
            dataForRoots,
            rendererID,
        };
    }

    function startProfiling(shouldRecordChangeDescriptions) {
        if (isProfiling) {
            return;
        }

        recordChangeDescriptions = shouldRecordChangeDescriptions; // Capture initial values as of the time profiling starts.
        // It's important we snapshot both the durations and the id-to-root map,
        // since either of these may change during the profiling session
        // (e.g. when a fiber is re-rendered or when a fiber gets removed).

        displayNamesByRootID = new Map();
        initialTreeBaseDurationsMap = new Map(idToTreeBaseDurationMap);
        initialIDToRootMap = new Map(idToRootMap);
        idToContextsMap = new Map();
        hook.getFiberRoots(rendererID).forEach(root => {
            const rootID = getFiberID(getPrimaryFiber(root.current));
            displayNamesByRootID.set(rootID, getDisplayNameForRoot(root.current));

            if (shouldRecordChangeDescriptions) {
                // Record all contexts at the time profiling is started.
                // Fibers only store the current context value,
                // so we need to track them separatenly in order to determine changed keys.
                crawlToInitializeContextsMap(root.current);
            }
        });
        isProfiling = true;
        profilingStartTime = getCurrentTime();
        rootToCommitProfilingMetadataMap = new Map();
    }

    function stopProfiling() {
        isProfiling = false;
        recordChangeDescriptions = false;
    } // Automatically start profiling so that we don't miss timing info from initial "mount".

    if (sessionStorageGetItem(SESSION_STORAGE_RELOAD_AND_PROFILE_KEY) === 'true') {
        startProfiling(sessionStorageGetItem(SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY) === 'true');
    } // React will switch between these implementations depending on whether
    // we have any manually suspended Fibers or not.

    function shouldSuspendFiberAlwaysFalse() {
        return false;
    }

    const forceFallbackForSuspenseIDs = new Set();

    function shouldSuspendFiberAccordingToSet(fiber) {
        const id = getFiberID(getPrimaryFiber(fiber));
        return forceFallbackForSuspenseIDs.has(id);
    }

    function overrideSuspense(id, forceFallback) {
        if (typeof setSuspenseHandler !== 'function' || typeof scheduleUpdate !== 'function') {
            throw new Error('Expected overrideSuspense() to not get called for earlier React versions.');
        }

        if (forceFallback) {
            forceFallbackForSuspenseIDs.add(id);

            if (forceFallbackForSuspenseIDs.size === 1) {
                // First override is added. Switch React to slower path.
                setSuspenseHandler(shouldSuspendFiberAccordingToSet);
            }
        } else {
            forceFallbackForSuspenseIDs.delete(id);

            if (forceFallbackForSuspenseIDs.size === 0) {
                // Last override is gone. Switch React back to fast path.
                setSuspenseHandler(shouldSuspendFiberAlwaysFalse);
            }
        }

        const fiber = idToFiberMap.get(id);

        if (fiber != null) {
            scheduleUpdate(fiber);
        }
    } // Remember if we're trying to restore the selection after reload.
    // In that case, we'll do some extra checks for matching mounts.

    let trackedPath = null;
    let trackedPathMatchFiber = null;
    let trackedPathMatchDepth = -1;
    let mightBeOnTrackedPath = false;

    function setTrackedPath(path) {
        if (path === null) {
            trackedPathMatchFiber = null;
            trackedPathMatchDepth = -1;
            mightBeOnTrackedPath = false;
        }

        trackedPath = path;
    } // We call this before traversing a new mount.
    // It remembers whether this Fiber is the next best match for tracked path.
    // The return value signals whether we should keep matching siblings or not.

    function updateTrackedPathStateBeforeMount(fiber) {
        if (trackedPath === null || !mightBeOnTrackedPath) {
            // Fast path: there's nothing to track so do nothing and ignore siblings.
            return false;
        }

        const returnFiber = fiber.return;
        const returnAlternate = returnFiber !== null ? returnFiber.alternate : null; // By now we know there's some selection to restore, and this is a new Fiber.
        // Is this newly mounted Fiber a direct child of the current best match?
        // (This will also be true for new roots if we haven't matched anything yet.)

        if (
            trackedPathMatchFiber === returnFiber ||
            (trackedPathMatchFiber === returnAlternate && returnAlternate !== null)
        ) {
            // Is this the next Fiber we should select? Let's compare the frames.
            const actualFrame = getPathFrame(fiber);
            const expectedFrame = trackedPath[trackedPathMatchDepth + 1];

            if (expectedFrame === undefined) {
                throw new Error('Expected to see a frame at the next depth.');
            }

            if (
                actualFrame.index === expectedFrame.index &&
                actualFrame.key === expectedFrame.key &&
                actualFrame.displayName === expectedFrame.displayName
            ) {
                // We have our next match.
                trackedPathMatchFiber = fiber;
                trackedPathMatchDepth++; // Are we out of frames to match?

                if (trackedPathMatchDepth === trackedPath.length - 1) {
                    // There's nothing that can possibly match afterwards.
                    // Don't check the children.
                    mightBeOnTrackedPath = false;
                } else {
                    // Check the children, as they might reveal the next match.
                    mightBeOnTrackedPath = true;
                } // In either case, since we have a match, we don't need
                // to check the siblings. They'll never match.

                return false;
            }
        } // This Fiber's parent is on the path, but this Fiber itself isn't.
        // There's no need to check its children--they won't be on the path either.

        mightBeOnTrackedPath = false; // However, one of its siblings may be on the path so keep searching.

        return true;
    }

    function updateTrackedPathStateAfterMount(mightSiblingsBeOnTrackedPath) {
        // updateTrackedPathStateBeforeMount() told us whether to match siblings.
        // Now that we're entering siblings, let's use that information.
        mightBeOnTrackedPath = mightSiblingsBeOnTrackedPath;
    } // Roots don't have a real persistent identity.
    // A root's "pseudo key" is "childDisplayName:indexWithThatName".
    // For example, "App:0" or, in case of similar roots, "Story:0", "Story:1", etc.
    // We will use this to try to disambiguate roots when restoring selection between reloads.

    const rootPseudoKeys = new Map();
    const rootDisplayNameCounter = new Map();

    function setRootPseudoKey(id, fiber) {
        const name = getDisplayNameForRoot(fiber);
        const counter = rootDisplayNameCounter.get(name) || 0;
        rootDisplayNameCounter.set(name, counter + 1);
        const pseudoKey = `${name}:${counter}`;
        rootPseudoKeys.set(id, pseudoKey);
    }

    function removeRootPseudoKey(id) {
        const pseudoKey = rootPseudoKeys.get(id);

        if (pseudoKey === undefined) {
            throw new Error('Expected root pseudo key to be known.');
        }

        const name = pseudoKey.substring(0, pseudoKey.lastIndexOf(':'));
        const counter = rootDisplayNameCounter.get(name);

        if (counter === undefined) {
            throw new Error('Expected counter to be known.');
        }

        if (counter > 1) {
            rootDisplayNameCounter.set(name, counter - 1);
        } else {
            rootDisplayNameCounter.delete(name);
        }

        rootPseudoKeys.delete(id);
    }

    function getDisplayNameForRoot(fiber) {
        let preferredDisplayName = null;
        let fallbackDisplayName = null;
        let child = fiber.child; // Go at most three levels deep into direct children
        // while searching for a child that has a displayName.

        for (let i = 0; i < 3; i++) {
            if (child === null) {
                break;
            }

            const displayName = getDisplayNameForFiber(child);

            if (displayName !== null) {
                // Prefer display names that we get from user-defined components.
                // We want to avoid using e.g. 'Suspense' unless we find nothing else.
                if (typeof child.type === 'function') {
                    // There's a few user-defined tags, but we'll prefer the ones
                    // that are usually explicitly named (function or class components).
                    preferredDisplayName = displayName;
                } else if (fallbackDisplayName === null) {
                    fallbackDisplayName = displayName;
                }
            }

            if (preferredDisplayName !== null) {
                break;
            }

            child = child.child;
        }

        return preferredDisplayName || fallbackDisplayName || 'Anonymous';
    }

    function getPathFrame(fiber) {
        const { key } = fiber;
        let displayName = getDisplayNameForFiber(fiber);
        const index = fiber.index;

        switch (fiber.tag) {
            case HostRoot:
                // Roots don't have a real displayName, index, or key.
                // Instead, we'll use the pseudo key (childDisplayName:indexWithThatName).
                const id = getFiberID(getPrimaryFiber(fiber));
                const pseudoKey = rootPseudoKeys.get(id);

                if (pseudoKey === undefined) {
                    throw new Error('Expected mounted root to have known pseudo key.');
                }

                displayName = pseudoKey;
                break;

            case HostComponent:
                displayName = fiber.type;
                break;
        }

        return {
            displayName,
            key,
            index,
        };
    } // Produces a serializable representation that does a best effort
    // of identifying a particular Fiber between page reloads.
    // The return path will contain Fibers that are "invisible" to the store
    // because their keys and indexes are important to restoring the selection.

    function getPathForElement(id) {
        let fiber = idToFiberMap.get(id);

        if (fiber == null) {
            return null;
        }

        const keyPath = [];

        while (fiber !== null) {
            keyPath.push(getPathFrame(fiber));
            fiber = fiber.return;
        }

        keyPath.reverse();
        return keyPath;
    }

    function getBestMatchForTrackedPath() {
        if (trackedPath === null) {
            // Nothing to match.
            return null;
        }

        if (trackedPathMatchFiber === null) {
            // We didn't find anything.
            return null;
        } // Find the closest Fiber store is aware of.

        let fiber = trackedPathMatchFiber;

        while (fiber !== null && shouldFilterFiber(fiber)) {
            fiber = fiber.return;
        }

        if (fiber === null) {
            return null;
        }

        return {
            id: getFiberID(getPrimaryFiber(fiber)),
            isFullMatch: trackedPathMatchDepth === trackedPath.length - 1,
        };
    }

    const formatPriorityLevel = priorityLevel => {
        if (priorityLevel == null) {
            return 'Unknown';
        }

        switch (priorityLevel) {
            case ImmediatePriority:
                return 'Immediate';

            case UserBlockingPriority:
                return 'User-Blocking';

            case NormalPriority:
                return 'Normal';

            case LowPriority:
                return 'Low';

            case IdlePriority:
                return 'Idle';

            case NoPriority:
            default:
                return 'Unknown';
        }
    };

    function setTraceUpdatesEnabled(isEnabled) {
        traceUpdatesEnabled = isEnabled;
    }

    return {
        // === react-app-actions changes ===
        findCurrentFiberUsingSlowPathById,
        getFiberID,
        getPrimaryFiber,
        // === end of react-app-actions changes ===
        cleanup,
        copyElementPath,
        findNativeNodesForFiberID,
        flushInitialOperations,
        getBestMatchForTrackedPath,
        getDisplayNameForFiberID,
        getFiberIDForNative,
        getInstanceAndStyle,
        getOwnersList,
        getPathForElement,
        getProfilingData,
        handleCommitFiberRoot,
        handleCommitFiberUnmount,
        inspectElement,
        logElementToConsole,
        prepareViewAttributeSource,
        prepareViewElementSource,
        overrideSuspense,
        renderer,
        setInContext,
        setInHook,
        setInProps,
        setInState,
        setTraceUpdatesEnabled,
        setTrackedPath,
        startProfiling,
        stopProfiling,
        storeAsGlobal,
        updateComponentFilters,
    };
}
