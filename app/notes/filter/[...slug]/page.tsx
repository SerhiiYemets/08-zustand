import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from "next";

interface NotesPageProps {
    params: Promise<{
        slug?: string[];
    }>;
}

export async function generateMetadata(
    { params }: NotesPageProps): Promise<Metadata> {
    const { slug } = await params;
    const tag = slug?.[0] ?? 'all';

    const title =
        tag === 'all'
            ? 'Note Hub — All Notes'
            : `Note Hub — Notes: ${tag}`;

    const description =
        tag === 'all'
            ? 'Browse all notes on Note Hub.'
            : `Browse notes filtered by: ${tag}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://notehub.com/notes/filter/${tag}`,
            siteName: 'NoteHub',
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: 'website',
        },
    };
}

export default async function NotesPage({ params }: NotesPageProps) {
    const { slug } = await params;
    const tag = slug?.[0] ?? 'all';

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['notes', tag],
        queryFn: () => fetchNotes(1, 8, undefined, tag === 'all' ? undefined : tag),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tag} />
        </HydrationBoundary>
    );
}