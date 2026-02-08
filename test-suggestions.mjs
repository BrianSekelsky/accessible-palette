/**
 * Auto-fix Suggestion Test
 *
 * Tests the findNearestAccessible algorithm with various color pairs.
 * Run with: node test-suggestions.mjs
 */

import { oklch, formatHex, wcagContrast } from 'culori';

console.log('Testing Auto-fix Suggestions\n');
console.log('='.repeat(60));

// Simplified version of the algorithm for testing
function findNearestAccessible(foregroundHex, backgroundHex, targetRatio) {
  const fgColor = `#${foregroundHex}`;
  const bgColor = `#${backgroundHex}`;

  const fg = oklch(fgColor);
  if (!fg || fg.l === undefined) return null;

  const currentRatio = wcagContrast(fgColor, bgColor);
  if (currentRatio >= targetRatio) return foregroundHex;

  const bg = oklch(bgColor);
  const bgLightness = bg?.l ?? 0.5;
  const shouldDarken = fg.l > bgLightness;

  // Binary search
  let result = searchLightness(fg, bgColor, targetRatio, shouldDarken);
  if (!result) {
    result = searchLightness(fg, bgColor, targetRatio, !shouldDarken);
  }

  if (!result) return null;

  const hexResult = formatHex(result);
  return hexResult ? hexResult.replace('#', '').toUpperCase() : null;
}

function searchLightness(fg, bgColor, targetRatio, shouldDarken) {
  const MAX_ITERATIONS = 50;
  const LIGHTNESS_PRECISION = 0.001;

  let low = shouldDarken ? 0 : fg.l;
  let high = shouldDarken ? fg.l : 1;
  let bestColor = null;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS && high - low > LIGHTNESS_PRECISION) {
    iterations++;

    const mid = (low + high) / 2;
    const testColor = { ...fg, l: mid };
    const testHex = formatHex(testColor);

    if (!testHex) break;

    const ratio = wcagContrast(testHex, bgColor);

    if (ratio >= targetRatio) {
      bestColor = testColor;
      if (shouldDarken) {
        low = mid;
      } else {
        high = mid;
      }
    } else {
      if (shouldDarken) {
        high = mid;
      } else {
        low = mid;
      }
    }
  }

  return bestColor;
}

// Test cases
const tests = [
  {
    name: 'Light purple on white (failing AA)',
    fg: '7C3AED',
    bg: 'FFFFFF',
    target: 4.5,
    expectedImprovement: true,
  },
  {
    name: 'Light blue on white (failing AA)',
    fg: '60A5FA',
    bg: 'FFFFFF',
    target: 4.5,
    expectedImprovement: true,
  },
  {
    name: 'Light gray on white (failing AA)',
    fg: 'D1D5DB',
    bg: 'FFFFFF',
    target: 4.5,
    expectedImprovement: true,
  },
  {
    name: 'Dark text on white (already passing)',
    fg: '111827',
    bg: 'FFFFFF',
    target: 4.5,
    expectedImprovement: false,
  },
  {
    name: 'Light text on dark (failing AA)',
    fg: 'D1D5DB',
    bg: '1F2937',
    target: 4.5,
    expectedImprovement: true,
  },
];

for (const test of tests) {
  console.log(`\nTest: ${test.name}`);
  console.log(`  Original: #${test.fg} on #${test.bg}`);

  const originalRatio = wcagContrast(`#${test.fg}`, `#${test.bg}`);
  console.log(`  Original ratio: ${originalRatio.toFixed(2)}:1`);
  console.log(`  Target: ${test.target}:1`);

  const fixed = findNearestAccessible(test.fg, test.bg, test.target);

  if (!fixed) {
    console.log(`  ✗ Could not find accessible color`);
    continue;
  }

  if (fixed === test.fg) {
    console.log(`  ✓ Already accessible (no fix needed)`);
    continue;
  }

  const fixedRatio = wcagContrast(`#${fixed}`, `#${test.bg}`);
  console.log(`  Fixed: #${fixed}`);
  console.log(`  Fixed ratio: ${fixedRatio.toFixed(2)}:1`);

  if (fixedRatio >= test.target) {
    console.log(`  ✓ PASS - Fixed color meets target`);
  } else {
    console.log(`  ✗ FAIL - Fixed color still below target`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('\nAll tests completed!');
