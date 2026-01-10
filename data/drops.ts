
export interface Drop {
    id: string;
    title: string;
    description: string;
    releaseDate: string; // ISO String
    imageUrl: string;
    price: number;
    notifyMe: boolean;
}

export const drops: Drop[] = [
    {
        id: '1',
        title: 'Air Max 90 "Future"',
        description: 'A futuristic take on the classic silhouette with metallic accents and sustainable materials.',
        releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        price: 160,
        notifyMe: false,
    },
    {
        id: '2',
        title: 'Dunk Low "Panda 2.0"',
        description: 'The iconic black and white colorway returns with improved leather quality.',
        releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
        imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2',
        price: 110,
        notifyMe: true,
    },
    {
        id: '3',
        title: 'Travis Scott x Jordan 1',
        description: 'The highly anticipated collaboration featuring the signature reverse swoosh.',
        releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
        price: 190,
        notifyMe: false,
    },
    {
        id: '4',
        title: 'Yeezy Boost 350 "Onyx"',
        description: 'Sleek all-black design for ultimate versatility and comfort.',
        releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db',
        price: 230,
        notifyMe: false,
    },
];
