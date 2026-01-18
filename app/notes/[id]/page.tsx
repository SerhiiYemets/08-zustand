import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api";
import type { Metadata } from "next";

interface NoteDetailsProps {
    params: { id: string };
}

export async function generateMetadata(
    { params }: NoteDetailsProps
): Promise<Metadata> {
    const { id } = params;
    const note = await fetchNoteById(id);

    return {
        title: `Note: ${note.title}`,
        description: note.content.substring(0, 160),
        openGraph: {
            title: `Note: ${note.title}`,
            description: note.content.substring(0, 160),
            url: `https://notehub.com/notes/${id}`,
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                    width: 1200,
                    height: 630,
                    alt: note.title,
                },
            ],
        },
    };
}

const NoteDetails = async ({ params }: NoteDetailsProps) => {
    const { id } = params;
    const queryClient = new QueryClient();
    
    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient id={id} />
        </HydrationBoundary>
    );
};

export default NoteDetails;