
import { test,expect, devices } from '@playwright/test'

console.log('Available emulated devices in Playwright:');
console.log(Object.keys(devices));
