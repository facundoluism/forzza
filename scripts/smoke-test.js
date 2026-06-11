#!/usr/bin/env node
// scripts/smoke-test.js
// Run: node scripts/smoke-test.js --url https://forzza.app

const args = process.argv.slice(2)
const urlIdx = args.indexOf('--url')
const BASE_URL = urlIdx >= 0 ? args[urlIdx + 1] : 'http://localhost:3000'

async function check(name, url, expectedStatus = 200) {
  try {
    const res = await fetch(url)
    if (res.status === expectedStatus) {
      console.log(`✅ ${name} (${res.status})`)
      return true
    } else {
      console.error(`❌ ${name}: expected ${expectedStatus}, got ${res.status}`)
      return false
    }
  } catch (e) {
    console.error(`❌ ${name}: ${e.message}`)
    return false
  }
}

async function main() {
  console.log(`🔍 Smoke test against: ${BASE_URL}\n`)

  let allPass = true

  allPass &= await check('Landing page', `${BASE_URL}/`)
  allPass &= await check('Coaches page', `${BASE_URL}/coaches`)
  allPass &= await check('Upgrade page', `${BASE_URL}/upgrade`)
  allPass &= await check('Legales terminos', `${BASE_URL}/legales/terminos`)
  allPass &= await check('Legales privacidad', `${BASE_URL}/legales/privacidad`)
  allPass &= await check('Manifest', `${BASE_URL}/manifest.json`)
  allPass &= await check('Robots.txt', `${BASE_URL}/robots.txt`)
  allPass &= await check('Login redirect (auth protected)', `${BASE_URL}/coach/alumnos`, 307)
  allPass &= await check('Admin redirect (auth protected)', `${BASE_URL}/admin/dashboard`, 307)

  if (allPass) {
    console.log('\n✅ All smoke tests passed.')
    process.exit(0)
  } else {
    console.error('\n🚫 Some smoke tests failed.')
    process.exit(1)
  }
}

main()
