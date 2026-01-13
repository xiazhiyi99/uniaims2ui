import { useState } from 'react';
import { Book, Search, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Importing styles for code highlighting

import { DOC_CONTENT, DOC_SECTIONS } from './docData';


// Custom component for interactive image comparison
const HoverImage = ({ original, result, alt }: { original: string, result: string, alt: string }) => {
    console.log('HoverImage Props:', { original, result });
    return (
        <div className="relative rounded-xl overflow-hidden border border-border group cursor-crosshair max-w-lg mx-auto my-6 shadow-sm">
            <div className="aspect-[4/3] relative bg-muted/20">
                <img
                    src={original}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                    src={result}
                    alt={alt + " Result"}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-10">
                    <span className="group-hover:hidden">Original</span>
                    <span className="hidden group-hover:inline">Result</span>
                </div>
            </div>
        </div>
    );
};

export const DocsView = () => {
    const [activeSection, setActiveSection] = useState('Introduction');
    const [searchQuery, setSearchQuery] = useState('');

    const content = DOC_CONTENT[activeSection] || `
# ${activeSection}

*Documentation for this section is coming soon.*

Please check back later or contact support if you need immediate assistance with **${activeSection}**.
`;

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
                                    {section.items.map((item) => {

                                        if (typeof item === 'string') {
                                            return (
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
                                            );
                                        } else {
                                            // Nested Group
                                            return (
                                                <li key={item.label}>
                                                    <div className="px-3 py-1.5 text-xs font-semibold text-foreground/70 flex items-center gap-2">
                                                        {item.label}
                                                    </div>
                                                    <ul className="pl-2 space-y-1 mt-0.5 border-l border-border/50 ml-3">
                                                        {item.items.map((subItem) => (
                                                            <li key={subItem}>
                                                                <button
                                                                    onClick={() => setActiveSection(subItem)}
                                                                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${activeSection === subItem
                                                                        ? 'bg-primary/10 text-primary font-medium'
                                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                                                        }`}
                                                                >
                                                                    {subItem}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            );
                                        }
                                    })}
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

                        {/* Markdown Render Area */}
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:tracking-tight prose-a:text-primary prose-img:rounded-xl">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                    code(props) {
                                        const { children, className, node, ...rest } = props
                                        const match = /language-([\w-]+)/.exec(className || '')
                                        if (match && match[1] === 'hover-image') {

                                            try {
                                                const data = JSON.parse(String(children).replace(/\n$/, ''))
                                                return <HoverImage {...data} />
                                            } catch (e) {
                                                return <pre className="text-red-500 text-xs p-2 border border-red-200 rounded">Error parsing hover-image data</pre>
                                            }
                                        }
                                        return <code className={className} {...rest}>{children}</code>
                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-16 pt-8 border-t border-border flex justify-between text-sm text-muted-foreground">
                            <span>Last updated: Oct 24, 2023</span>
                            <a href="#" className="hover:text-foreground transition-colors">Edit this page on GitHub</a>
                        </div>
                    </div>
                </main>

                {/* On this page (Table of Contents) - Simplified placeholder */}
                <aside className="w-64 hidden xl:block py-10 pl-8 text-sm">
                    <h4 className="font-bold text-foreground mb-4">On this page</h4>
                    <ul className="space-y-3 text-muted-foreground border-l border-border ml-1">
                        <li className="pl-4 hover:text-foreground cursor-pointer border-l-2 border-transparent hover:border-primary -ml-[2px]">Overview</li>
                        <li className="pl-4 hover:text-foreground cursor-pointer border-l-2 border-transparent hover:border-primary -ml-[2px]">{activeSection} Details</li>
                    </ul>
                </aside>
            </div>
        </div>
    );
};
