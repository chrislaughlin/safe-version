#!/usr/bin/env node

const execa = require('execa');
const Listr = require('listr');

const version = process.argv.slice(2) ? process.argv.slice(2)[0] : '';

console.log(`VERSION: "${version}"`);

const tasks = new Listr([
    {
        title: `Getting Current Version`,
        task: () => execa.shell('echo $npm_package_version').then(result => {
            console.log(`Current Version:  ${result.stdout}`)
        })
    },
    {
        title: `Bumping version`,
        task: () => {
            if (version === '' || version === undefined) {
                throw new Error('No version provided, use [major, minor, patch]')
            }
        }
    },
    {
        title: 'Git checks',
        task: () => {
            return new Listr([
                {
                    title: 'Checking git status',
                    task: () => execa.stdout('git', ['status', '--porcelain']).then(result => {
                        if (result !== '') {
                            throw new Error('Unclean working tree. Commit or stash changes first.');
                        }
                    })
                },
                {
                    title: 'Checking remote history',
                    task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD'])
                        .then(result => {
                            if (result !== '0') {
                                throw new Error('Remote history differ. Please pull changes.');
                            }
                        })
                }
            ]);
        }
    },
    {
        title: `Versioning Package: ${version}`,
        task: () => execa('npm', ['version', version]).then(() => {
            return execa.shell('echo $npm_package_version').then(result => {
                console.log(`New Version:  ${result.stdout}`)
            })
        })
    }
]);

tasks.run().catch(err => {
    console.error(err);
});