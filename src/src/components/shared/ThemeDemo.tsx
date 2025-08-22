import React from 'react';
import { getComponentClasses, getButtonClasses, cn, cssVariables } from '@/lib/theme';

/**
 * Demo component showcasing the Tailwind v4 theme system
 * This demonstrates the automatic theme variable generation from @theme directive
 */
export default function ThemeDemo() {
    return (
        <div className="space-y-8 p-6">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">Tailwind v4 Theme System Demo</h2>
                <p className="text-text-secondary">
                    This demonstrates the new Tailwind v4 theme variables using the @theme directive
                    that automatically generate utility classes and support light/dark mode.
                </p>
            </div>

            {/* Text Colors */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">Text Colors</h3>
                <div className="space-y-1">
                    <p className="text-text-primary">Primary text color (text-text-primary)</p>
                    <p className="text-text-secondary">Secondary text color (text-text-secondary)</p>
                    <p className="text-text-tertiary">Tertiary text color (text-text-tertiary)</p>
                    <p className="text-text-muted">Muted text color (text-text-muted)</p>
                </div>
            </div>

            {/* Primary Colors */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">Primary Colors</h3>
                <div className="space-y-2">
                    <span className="text-primary">Primary color (text-primary)</span>
                    <div className="space-x-2">
                        <button className={cn(getButtonClasses('primary'), 'px-4 py-2 rounded')}>
                            Primary Button
                        </button>
                        <button className={cn(getButtonClasses('secondary'), 'px-4 py-2 rounded')}>
                            Secondary Button
                        </button>
                        <button className={cn(getButtonClasses('ghost'), 'px-4 py-2 rounded')}>
                            Ghost Button
                        </button>
                    </div>
                    <div className="p-4 bg-primary-light rounded">
                        Primary light background (bg-primary-light)
                    </div>
                </div>
            </div>

            {/* Surface Colors */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">Surface Colors</h3>
                <div className="space-y-2">
                    <div className="p-4 bg-surface border border-border-light rounded">
                        Default surface (bg-surface border-border-light)
                    </div>
                    <div className="p-4 bg-surface-elevated border border-border rounded">
                        Elevated surface (bg-surface-elevated border-border)
                    </div>
                    <div className="p-4 bg-surface-hover border border-border-strong rounded">
                        Hover surface (bg-surface-hover border-border-strong)
                    </div>
                </div>
            </div>

            {/* Status Colors */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">Status Colors</h3>
                <div className="space-x-4">
                    <span className="text-success">Success (text-success)</span>
                    <span className="text-warning">Warning (text-warning)</span>
                    <span className="text-error">Error (text-error)</span>
                    <span className="text-info">Info (text-info)</span>
                </div>
            </div>

            {/* Component Classes */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">Pre-built Component Classes</h3>
                <div className="space-y-2">
                    <div className={cn(getComponentClasses('card'), 'p-4')}>
                        Card component using getComponentClasses('card')
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Input field..."
                        className={cn(getComponentClasses('input'), 'px-3 py-2 rounded')}
                    />
                    
                    <a href="#" className={cn(getComponentClasses('link'))}>
                        Themed link using component classes
                    </a>
                    
                    <hr className={cn(getComponentClasses('divider'), 'my-4')} />
                </div>
            </div>

            {/* CSS Variables for JavaScript */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">CSS Variables for JavaScript</h3>
                <div className="p-4 bg-surface-elevated rounded border border-border">
                    <p className="text-text-secondary mb-2">
                        These CSS variables can be used in inline styles or JavaScript:
                    </p>
                    <code className="block text-sm bg-surface-hover p-2 rounded border border-border-light">
                        <span style={{ color: cssVariables.primary }}>
                            color: {cssVariables.primary}
                        </span>
                        <br />
                        <span style={{ color: cssVariables.textSecondary }}>
                            color: {cssVariables.textSecondary}
                        </span>
                    </code>
                </div>
            </div>

            {/* Tailwind v4 Features */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">Tailwind v4 Theme Features</h3>
                <div className="bg-surface-elevated p-4 rounded border border-border">
                    <ul className="space-y-2 text-text-secondary">
                        <li>• Uses <code className="px-1 bg-surface-hover rounded">@theme</code> directive for theme variables</li>
                        <li>• Automatic utility class generation from theme variables</li>
                        <li>• OKLCH color space for better color consistency</li>
                        <li>• Built-in light/dark mode support via CSS media queries</li>
                        <li>• No need to manually define color mappings in tailwind.config.ts</li>
                        <li>• Theme variables are accessible as CSS variables in JavaScript</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
