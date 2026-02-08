import { SimpleGenerateButton } from '@/components/palette/SimpleGenerateButton';
import { ColorPalette } from '@/components/palette/ColorPalette';
import { DesignPreview } from '@/components/preview/DesignPreview';
import { ContrastMatrix } from '@/components/matrix/ContrastMatrix';
import { ExportPanel } from '@/components/export/ExportPanel';
import { ColorBlindnessSimulator } from '@/components/palette/ColorBlindnessSimulator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Minimal Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="font-normal text-gray-900 dark:text-gray-100">
            Accessible Color Palette Generator
          </h1>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <section className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-7xl font-extralight leading-tight mb-6 text-gray-900 dark:text-gray-100">
            Build WCAG Compliant<br />Color systems
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
            Create accessible color palettes with automatic contrast checking,
            suggestions for fixes, and export to multiple formats. Perfect for designers
            and developers building inclusive digital experiences.
          </p>
        </section>

        {/* Color Palette */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="mb-8 flex items-center gap-6">
            <SimpleGenerateButton />
            <ColorBlindnessSimulator />
          </div>
          <ColorPalette />
        </section>

        {/* Preview */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Here&apos;s an example of how your layout will look
          </p>
          <DesignPreview />
        </section>

        {/* Contrast Matrix */}
        {/* <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <ContrastMatrix />
        </section> */}

        {/* Export */}
        <section className="py-12">
          <ExportPanel />
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Built with accessibility in mind. WCAG 2.2 AA compliant.
          </p>
        </div>
      </footer>
    </div>
  );
}
