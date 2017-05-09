// module.exports = function (wallaby) {
//     return {
//         files: [
//             // 'imports/server/methods/**/!(*.tests).js',
//             // 'tests/stubs/**/!(*.tests).js',
//         ],
//
//         tests: [
//             '*.test.js',
//         ],
//
//         compilers: {
//             '**/*.js': wallaby.compilers.babel()
//         },
//
//         env: {
//             type: 'node'
//         },
//
//         testFramework: 'mocha'
//     }
// };

module.exports = (wallaby) => {
    const path = require('path');
    process.env.NODE_PATH = `${path.join(wallaby.localProjectDir, 'src')}`;
    return {
        // debug: true,
        testFramework: 'jest',
        files: [
            'src/**/*.js',
            'package.json',
            'aws_config.json',
            // {pattern: 'modules/**/node_modules', ignore: true},
            {pattern: 'src/**/*.spec.js', ignore: true},
            // {pattern: 'modules/*(browser|ui)*', ignore: true},
            // {pattern: 'modules/@(browser|ui)/**/*.js', ignore: true},
        ],
        tests: [
            'src/**/*.spec.js',
        ],
        compilers: {'**/*.js': wallaby.compilers.babel()},
        env: {type: 'node', params: {
            env: "NODE_ENV=TESTING"
            }
        },
        // workers: {recycle: tru}
        workers: {initial: 1, regular: 1, recycle: false},
        // preprocessors: {
        //     'modules/**/*.js': file => '!global.$_$wp && (global.$_$wp = global.$_$wpe = global.$_$w = global.$_$wf = () => {});' + file.content
        // },
        setup: () => {
            // wallaby.testFramework.addFile(`${wallaby.localProjectDir}/.config/mocha.bootstrap.js`);
            // wallaby.testFramework.timeout(10000);
        },
    }
};
//
//
// module.exports = function (wallaby) {
//     return {
//         testFramework: 'jest',
//         env: {type: 'node'},
//         files: [
//             'src/**/*.js',
//             'package.json',
//             {pattern: 'src/**/*.spec.js', ignore: true},
//         ],
//
//         tests: [
//             'src/**/*.spec.js'
//         ],
//         compilers: {'**/*.js': wallaby.compilers.babel()},
//         workers: {
//             initial: 1,
//             regular: 1,
//             recycle: true
//         },
//     };
// };