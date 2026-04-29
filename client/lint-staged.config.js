export default {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.vue': ['prettier --write', 'eslint --fix'],
  'package.json': ['prettier --write'],
  '*.{html,css,scss}': ['prettier --write'],
  '{!(package)*.json,.!(browserslist)*rc}': ['prettier --write--parser json']
}
