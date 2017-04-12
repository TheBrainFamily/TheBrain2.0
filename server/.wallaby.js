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
    // process.env.NODE_PATH += `:${require('path').join(wallaby.localProjectDir, 'node_modules')}`;
    const path = require('path');
    return {
        debug: false,
        testFramework: 'jest',
        files: [
            'src/**/*.js',
            // {pattern: 'modules/**/node_modules', ignore: true},
            {pattern: 'src/**/*.spec.js', ignore: true},
            // {pattern: 'modules/*(browser|ui)*', ignore: true},
            // {pattern: 'modules/@(browser|ui)/**/*.js', ignore: true},
        ],
        tests: [
            'src/**/*.spec.js',
        ],
        compilers: {'**/*.js': wallaby.compilers.babel()},
        env: {type: 'node'},
        workers: {initial: 1, regular: 1, recycle: true},
        // preprocessors: {
        //     'modules/**/*.js': file => '!global.$_$wp && (global.$_$wp = global.$_$wpe = global.$_$w = global.$_$wf = () => {});' + file.content
        // },
        setup: () => {
            // wallaby.testFramework.addFile(`${wallaby.localProjectDir}/.config/mocha.bootstrap.js`);
            // wallaby.testFramework.timeout(10000);
        },
    }
};