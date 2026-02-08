/**
 * Contrast Calculation Test
 *
 * Verifies that our contrast calculations match known WCAG values.
 * Run with: node test-contrast.mjs
 */

import { wcagContrast } from 'culori';

console.log('Testing WCAG Contrast Calculations\n');
console.log('='.repeat(50));

// Test 1: Black on white (maximum contrast)
const blackOnWhite = wcagContrast('#000000', '#FFFFFF');
console.log('\nTest 1: Black on White');
console.log(`  Expected: 21:1`);
console.log(`  Actual:   ${blackOnWhite.toFixed(2)}:1`);
console.log(`  Status:   ${blackOnWhite === 21 ? '✓ PASS' : '✗ FAIL'}`);

// Test 2: White on black (should be same as black on white)
const whiteOnBlack = wcagContrast('#FFFFFF', '#000000');
console.log('\nTest 2: White on Black');
console.log(`  Expected: 21:1`);
console.log(`  Actual:   ${whiteOnBlack.toFixed(2)}:1`);
console.log(`  Status:   ${whiteOnBlack === 21 ? '✓ PASS' : '✗ FAIL'}`);

// Test 3: #767676 on white (famous AA boundary gray)
const boundaryGray = wcagContrast('#767676', '#FFFFFF');
console.log('\nTest 3: #767676 on White (AA Boundary Gray)');
console.log(`  Expected: ~4.54:1 (just above AA threshold of 4.5:1)`);
console.log(`  Actual:   ${boundaryGray.toFixed(2)}:1`);
console.log(`  Status:   ${boundaryGray >= 4.5 && boundaryGray < 4.6 ? '✓ PASS' : '✗ FAIL'}`);

// Test 4: Same color (minimum contrast)
const sameColor = wcagContrast('#FF0000', '#FF0000');
console.log('\nTest 4: Same Color (Red on Red)');
console.log(`  Expected: 1:1`);
console.log(`  Actual:   ${sameColor.toFixed(2)}:1`);
console.log(`  Status:   ${sameColor === 1 ? '✓ PASS' : '✗ FAIL'}`);

// Test 5: Our default palette primary on white
const primaryOnWhite = wcagContrast('#2563EB', '#FFFFFF');
console.log('\nTest 5: Default Primary (#2563EB) on White');
console.log(`  Actual:   ${primaryOnWhite.toFixed(2)}:1`);
console.log(`  Passes AA (4.5:1):  ${primaryOnWhite >= 4.5 ? '✓ Yes' : '✗ No'}`);
console.log(`  Passes AAA (7:1):   ${primaryOnWhite >= 7 ? '✓ Yes' : '✗ No'}`);

// Test 6: Our default palette text on white
const textOnWhite = wcagContrast('#111827', '#FFFFFF');
console.log('\nTest 6: Default Text (#111827) on White');
console.log(`  Actual:   ${textOnWhite.toFixed(2)}:1`);
console.log(`  Passes AA (4.5:1):  ${textOnWhite >= 4.5 ? '✓ Yes' : '✗ No'}`);
console.log(`  Passes AAA (7:1):   ${textOnWhite >= 7 ? '✓ Yes' : '✗ No'}`);

// Test 7: Our default palette accent on white
const accentOnWhite = wcagContrast('#7C3AED', '#FFFFFF');
console.log('\nTest 7: Default Accent (#7C3AED) on White');
console.log(`  Actual:   ${accentOnWhite.toFixed(2)}:1`);
console.log(`  Passes AA (4.5:1):  ${accentOnWhite >= 4.5 ? '✓ Yes' : '✗ No'}`);
console.log(`  Passes AAA (7:1):   ${accentOnWhite >= 7 ? '✓ Yes' : '✗ No'}`);

console.log('\n' + '='.repeat(50));
console.log('\nAll basic tests completed!');
