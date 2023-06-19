export default function getProjectDirectory() {
  const projName = process.argv[2];
  if (projName === '.' || projName === undefined || projName === null) return '.';
  if (!projName.includes('/')) return projName;
  return projName.split('/')[0];
}
