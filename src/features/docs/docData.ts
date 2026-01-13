// @ts-ignore
import introContent from './content/getting-started/introduction.md?raw';
// @ts-ignore
import installContent from './content/getting-started/installation.md?raw';
// @ts-ignore
import particleContent from './content/core-concepts/particle-analysis/particle-analysis.md?raw';
// @ts-ignore
import sphericalContent from './content/core-concepts/particle-analysis/spherical/spherical.md?raw';
// @ts-ignore
import irregularContent from './content/core-concepts/particle-analysis/irregular/irregular.md?raw';

export const DOC_CONTENT: Record<string, string> = {
    'Introduction': introContent,
    'Installation': installContent,
    'Particle Overview': particleContent,
    'Spherical Mode': sphericalContent,
    'Irregular Mode': irregularContent,
};

export type DocSectionItem = string | { label: string; items: string[] };

export const DOC_SECTIONS: { title: string; items: DocSectionItem[] }[] = [
    {
        title: 'Getting Started',
        items: ['Introduction', 'Installation', 'Quick Start Guide', 'System Requirements']
    },
    {
        title: 'Core Concepts',
        items: [
            {
                label: 'Particle Analysis',
                items: ['Particle Overview', 'Spherical Mode', 'Irregular Mode']
            },
            'Fiber Analysis',
            'Model Architecture',
            'Workspace Management'
        ]
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



