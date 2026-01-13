export const BATCH_DETAILS = {
    id: 'DB-2023-001',
    name: 'Graphene Oxide Sample Set A',
    uploadDate: '2023-10-24',
    uploader: 'Xia Zhiyi',
    description: 'High resolution SEM images of graphene oxide flakes on silicon substrate. Taken at 5kV.',
    tags: ['graphene', '2D-material', 'sem'],
    imageCount: 124,
    images: Array.from({ length: 20 }).map((_, i) => ({
        id: `IMG-${i + 1}`,
        name: `sample_a_${i + 1}.tif`,
        size: '4.2 MB',
        date: '2023-10-24 14:30'
    })),
    linkedTasks: [
        { id: 'T-1029', name: 'Graphene Particle Analysis', type: 'particle', status: 'completed', date: '2023-10-25' },
        { id: 'FT-005', name: 'Graphene Segmentation Finetune', type: 'training', status: 'completed', date: '2023-10-26' }
    ]
};
