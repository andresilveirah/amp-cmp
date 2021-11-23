const npm = require('npm');
const { spawn } = require('child_process');

const server = spawn('npm', ['run', 'server'])
const ui = spawn('npm', ['run', 'ui'])

// const jest = spawn('jest', ['--testPathPattern', './tests/integration', '--verbose', '--colors'])

npm.load(
    () => npm.run(
        "jest-integration", 
        (result) => { 
            server.kill()
            ui.kill()

            if(result && result.errno) {
                process.exit(1);
            }
            process.exit();
        }
    ) 
)

// server.kill()
// ui.kill()