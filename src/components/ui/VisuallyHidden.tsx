/**
 * VisuallyHidden Component
 *
 * Hides content visually while keeping it accessible to screen readers.
 * Use this for content that provides context for assistive technology
 * but isn't needed visually (e.g., additional button labels, form hints).
 *
 * Based on the "visually-hidden" pattern from the a11y project.
 */

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function VisuallyHidden({
  children,
  as: Component = 'span'
}: VisuallyHiddenProps) {
  return (
    <Component className="visually-hidden">
      {children}
    </Component>
  );
}
