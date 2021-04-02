module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-case': [2, 'always', ['lower-case', 'snake-case', 'upper-case', 'kebab-case']]
    }
}
