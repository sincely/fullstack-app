import { execSync } from 'child_process'
import { existsSync } from 'fs'

const isProduction = process.env.NODE_ENV === 'production'
const hasGitDir = existsSync('.git')

if (isProduction || !hasGitDir) {
  process.exit(0)
}

execSync('husky install', { stdio: 'inherit' })
