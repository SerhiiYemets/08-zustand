"use client";

import { useState, useEffect } from "react";
import css from "./NotesClient.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteForm from "@/components/NoteForm/NoteForm";

interface NotesClientProps {
    tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const perPage = 8;

    const { data, isLoading } = useQuery({
        queryKey: ["notes", tag, currentPage, perPage, search],
        queryFn: () =>
            fetchNotes(
                currentPage,
                perPage,
                search || undefined,
                tag === "all" ? undefined : tag
            ),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(t);
    }, [searchInput]);

    const hasResults = !!data?.notes?.length;
    const totalPages = data?.totalPages ?? 1;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={searchInput} onChange={setSearchInput} />
                <button
                    className={css.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            <main className="notes-list">
                {hasResults && totalPages > 1 && (
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onSelectPage={setCurrentPage}
                    />
                )}

                {data && !isLoading && (
                    <NoteList notes={data.notes ?? []} />
                )}

                {isModalOpen && (
                    <Modal onClose={() => setIsModalOpen(false)}>
                        <NoteForm onClose={() => setIsModalOpen(false)} />
                    </Modal>
                )}
            </main>
        </div>
    );
}
