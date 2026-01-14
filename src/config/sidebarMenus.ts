
export interface MenuItem {
    label: string;
    icon: string; // Key for the icon component map
    path?: string; // URL path to navigate to
    action?: string; // Action identifier (e.g., 'open_export_modal')
    params?: Record<string, string>; // Query parameters
}

export interface MenuSection {
    title: string;
    items: MenuItem[];
}

export type SidebarConfig = Record<string, MenuSection[]>;

export const SIDEBAR_CONFIG: SidebarConfig = {
    finetune: [
        {
            title: 'Training',
            items: [
                { label: 'Configuration', icon: 'Settings2', params: { tab: 'settings' } },
                { label: 'Training Dashboard', icon: 'Activity', params: { tab: 'training' } }
            ]
        },
        {
            title: 'Data',
            items: [
                { label: 'Data Management', icon: 'Database', params: { tab: 'data' } },
                { label: 'Annotation Studio', icon: 'PenTool', params: { tab: 'annotation' } }
            ]
        }
    ],
    data: [
        {
            title: 'Data Batch',
            items: [
                { label: 'Overview', icon: 'Settings', path: '/data/:taskId/overview' },
                { label: 'Data Browser', icon: 'Database', path: '/data/:taskId/browser' },
                { label: 'Linked Tasks', icon: 'Activity', path: '/data/:taskId/tasks' }
            ]
        },
        {
            title: 'Training (TODO)',
            items: [
                { label: 'Label Management (TODO)', icon: 'Settings', path: '/data/:taskId/overview' },
            ]
        },
        // {
        //     title: 'System',
        //     items: [
        //         { label: 'Export Batch', icon: 'Database', action: 'open_export_modal' }
        //     ]
        // }
    ],
    particle: [
        {
            title: 'Workstation',
            items: [
                { label: 'Particle Recognition', icon: 'Layers', path: '/:taskId/particles' }
            ]
        },
        {
            title: 'Analysis',
            items: [
                { label: 'Attribute', icon: 'BarChart3', path: '/:taskId/analysis/attribute' },
                { label: 'Correlation Analysis', icon: 'Activity', path: '/:taskId/analysis/correlation' },
                { label: 'Image Comparison', icon: 'BarChart3', path: '/:taskId/analysis/comparison' },
                { label: 'Task Comparison', icon: 'BarChart3', path: '/:taskId/analysis/task_comparison' },
                { label: 'Reports', icon: 'FileText', path: '/:taskId/reports' }
            ]
        },
        {
            title: 'Training (TODO)',
            items: [
                { label: 'Label Studio (TODO)', icon: 'Pen', action: 'open_export_modal' }
            ]
        },
        // {
        //     title: 'System',
        //     items: [
        //         { label: 'Save to Dataset', icon: 'Database', action: 'open_export_modal' }
        //     ]
        // }
    ],
    fiber: [
        {
            title: 'Workstation',
            items: [
                { label: 'Fiber Analysis', icon: 'Activity', path: '/:taskId/fibers' }
            ]
        },
        {
            title: 'Analysis',
            items: [
                { label: 'Analysis Hub', icon: 'BarChart3', path: '/:taskId/analysis' },
                { label: 'Reports', icon: 'FileText', path: '/:taskId/reports' }
            ]
        },
        {
            title: 'System',
            items: [
                { label: 'Save to Dataset', icon: 'Database', action: 'open_export_modal' }
            ]
        }
    ]
};
