import { useState } from 'react';
import { Book, FileText, Search, ChevronRight } from 'lucide-react';

const DOC_SECTIONS = [
    {
        title: 'Getting Started',
        items: ['Introduction', 'Installation', 'Quick Start Guide', 'System Requirements']
    },
    {
        title: 'Core Concepts',
        items: ['Particle Analysis', 'Fiber Analysis', 'Model Architecture', 'Workspace Management']
    },
    {
        title: 'Advanced Features',
        items: ['Fine-tuning Models', 'Custom Datasets', 'API Integration', 'Reporting Tools']
    },
    {
        title: 'Troubleshooting',
        items: ['Common Errors', 'Performance Optimization', 'FAQ', 'Support']
    }
];

export const DocsView = () => {
    const [activeSection, setActiveSection] = useState('Introduction');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border flex items-center px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl mr-8">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        <Book size={20} />
                    </div>
                    UniAIMS Docs
                </div>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">v2.4.0</span>
                    <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Back to App</a>
                </div>
            </header>

            <div className="flex-1 flex max-w-7xl mx-auto w-full">
                {/* Sidebar Navigation */}
                <aside className="w-64 border-r border-border hidden md:block overflow-y-auto max-h-[calc(100vh-4rem)] sticky top-16 py-8 pr-4">
                    <div className="space-y-8">
                        {DOC_SECTIONS.map((section) => (
                            <div key={section.title}>
                                <h3 className="font-bold text-sm text-foreground mb-3 px-2">{section.title}</h3>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item}>
                                            <button
                                                onClick={() => setActiveSection(item)}
                                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${activeSection === item
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 py-10 px-8">
                    <div className="max-w-3xl">
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Docs</span>
                            <ChevronRight size={14} />
                            <span>Guide</span>
                            <ChevronRight size={14} />
                            <span className="text-foreground font-medium">{activeSection}</span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight mb-6">{activeSection}</h1>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                Welcome to the comprehensive documentation for the Unified AI Materials Science (UniAIMS) platform. This guide covers everything from initial setup to advanced model fine-tuning.
                            </p>

                            <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-6 my-8 rounded-r-xl">
                                <h4 className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400 mb-2">
                                    <FileText size={18} />
                                    Note
                                </h4>
                                <p className="text-blue-600 dark:text-blue-300 text-sm">
                                    This is a mock documentation page. In a production environment, this would likely be rendered from Markdown files or hosted on a separate documentation platform like GitBook or Docusaurus.
                                </p>
                            </div>

                            <h2 className="text-2xl font-bold mt-10 mb-4"> Overview</h2>
                            <p className="mb-4 text-muted-foreground">
                                UniAIMS allows researchers to automate the analysis of SEM (Scanning Electron Microscope) imagery. By leveraging state-of-the-art deep learning models, we provide tools for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                                <li><strong>Particle Size Distribution:</strong> Automatically detect and measure nano-particles.</li>
                                <li><strong>Fiber Orientation & Diameter:</strong> Analyze fibrous materials like carbon nanotubes.</li>
                                <li><strong>Custom Model Training:</strong> Fine-tune base models on your specific datasets for improved accuracy.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-10 mb-4">Quick Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                <a href="#" className="block p-6 border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group">
                                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Installation Guide</h3>
                                    <p className="text-sm text-muted-foreground">Step-by-step instructions to set up the environment.</p>
                                </a>
                                <a href="#" className="block p-6 border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group">
                                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">API Reference</h3>
                                    <p className="text-sm text-muted-foreground">Detailed endpoints for backend integration.</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

                {/* On this page (Table of Contents) */}
                <aside className="w-64 hidden xl:block py-10 pl-8 text-sm">
                    <h4 className="font-bold text-foreground mb-4">On this page</h4>
                    <ul className="space-y-3 text-muted-foreground border-l border-border ml-1">
                        <li className="pl-4 hover:text-foreground cursor-pointer border-l-2 border-transparent hover:border-primary -ml-[2px]">Overview</li>
                        <li className="pl-4 hover:text-foreground cursor-pointer border-l-2 border-transparent hover:border-primary -ml-[2px]">Core Features</li>
                        <li className="pl-4 hover:text-foreground cursor-pointer border-l-2 border-transparent hover:border-primary -ml-[2px]">Quick Links</li>
                        <li className="pl-4 hover:text-foreground cursor-pointer border-l-2 border-transparent hover:border-primary -ml-[2px]">Examples</li>
                    </ul>
                </aside>
            </div>
        </div>
    );
};
