/**
 * SkipNav Component
 *
 * Provides a "Skip to main content" link for keyboard users.
 * This is a critical accessibility feature that allows users to bypass
 * repetitive navigation and jump directly to the main content.
 *
 * The link is visually hidden until focused, ensuring it doesn't
 * interfere with the visual design while remaining accessible.
 */

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="skip-nav"
    >
      Skip to main content
    </a>
  );
}
