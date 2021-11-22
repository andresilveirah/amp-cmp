const { spawn } = require('child_process');

const server = spawn('npm', ['run', 'server'])
const ui = spawn('npm', ['run', 'ui'])

const jest = spawn('jest', ['--testPathPattern', './tests/integration', '--verbose', '--colors'])