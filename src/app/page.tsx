import { PaletteDebug } from '@/components/PaletteDebug';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Accessible Color Palette Generator</h1>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-8">
        <section aria-labelledby="intro-heading">
          <h2 id="intro-heading" className="text-xl font-semibold mb-4">
            Build WCAG 2.2 Compliant Color Systems
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
            Create accessible color palettes with automatic contrast checking, suggestions for fixes,
            and export to multiple formats. Perfect for designers and developers building inclusive
            digital experiences.
          </p>
        </section>

        <section aria-labelledby="tool-section" className="mt-8">
          <h2 id="tool-section" className="visually-hidden">
            Color Palette Tool
          </h2>
          <PaletteDebug />
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with accessibility in mind. WCAG 2.2 AA compliant.
          </p>
        </div>
      </footer>
    </div>
  );
}
