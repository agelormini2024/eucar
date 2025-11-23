const { execSync } = require('child_process');
try {
  const output = execSync('npm test -- create-recibo-action.test.ts --verbose 2>&1', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  console.log(output);
} catch (e) {
  console.log(e.stdout || e.stderr || e.message);
}
