"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Component, Loader2, Radio } from "lucide-react";
import CustomButton from "./custom-button";
import { useParams } from "next/navigation";
import { QuizType } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { getUserById } from "@/lib/actions/users.actions";
import { getTournamentPlayersByQuizId } from "@/lib/actions/tournament_players.actions";
import { setQuizStatus } from "@/lib/actions/quizzes.actions";

type UIUser = {
    id: string;
    first_name: string;
    is_connected: boolean;
    profile_pic: string;
};

const StartTournament = ({
    isOpen,
    setIsOpen,
    quiz,
}: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    quiz: QuizType;
}) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UIUser[]>();
    const params = useParams();
    const quizid = params.id as string;

    // Prevent duplicate in-flight status updates when isOpen toggles quickly
    const statusAbortRef = useRef<AbortController | null>(null);

    // Update quiz status when dialog opens/closes
    useEffect(() => {
        if (!quiz?.id) return;

        // Abort previous in-flight request, if any
        statusAbortRef.current?.abort();
        const controller = new AbortController();
        statusAbortRef.current = controller;

        const run = async () => {
            try {
                if (isOpen) {
                    await setQuizStatus(quiz.id, "upcoming");
                } else {
                    await setQuizStatus(quiz.id, "draft");
                }
            } catch (e) {
                // Optional: log or toast; avoid throwing in effect
                console.error("setQuizStatus failed:", e);
            }
        };

        // Slight debounce to avoid flicker if user toggles quickly
        const t = setTimeout(run, 100);
        return () => {
            clearTimeout(t);
            controller.abort();
        };
    }, [isOpen, quiz?.id]);

    // Load participants and live-update connection status (INSERT + UPDATE)
    useEffect(() => {
        if (!quizid) return;
        let mounted = true;

        const loadInitial = async () => {
            try {
                const res = await getTournamentPlayersByQuizId(quizid);
                if (!mounted) return;

                if (res?.data?.length) {
                    const usersRes = await Promise.all(
                        res.data.map((player: any) => getUserById(player.user_id))
                    );

                    const merged: UIUser[] = res.data.map((player: any, i: number) => ({
                        id: player.user_id,
                        first_name: usersRes[i]?.data?.first_name ?? "Unknown",
                        profile_pic: usersRes[i]?.data?.profile_pic ?? "",
                        is_connected: player.is_connected,
                    }));

                    setUsers(merged);
                } else {
                    setUsers([]);
                }
            } catch (e) {
                console.error("init players failed:", e);
                if (mounted) setUsers([]);
            }
        };

        loadInitial();

        // Use a channel name scoped to this quiz
        const channel = supabase.channel(`room-${quizid}`);

        // Handle UPDATE (connection status changes)
        channel.on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "tournament_players",
            },
            (payload: any) => {
                console.log(payload)
                const { user_id, is_connected } = payload.new ?? {};
                if (!user_id) return;

                setUsers((prev) => {
                    if (!prev) return prev;
                    return prev.map((u) =>
                        u.id === user_id ? { ...u, is_connected: !!is_connected } : u
                    );
                });
            }
        );

        // Handle INSERT (new participant joins)
        channel.on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "tournament_players",
                filter: `quiz_id=eq.${quizid}`,
            },
            async (payload: any) => {
                const row = payload.new;
                const userId = row?.user_id;
                if (!userId) return;

                // Avoid duplicates
                let shouldFetch = true;
                setUsers((prev) => {
                    if (!prev) return prev;
                    if (prev.some((u) => u.id === userId)) {
                        shouldFetch = false;
                        return prev;
                    }
                    return prev; // unchanged for now; we’ll append after fetch
                });
                if (!shouldFetch) return;

                try {
                    const userRes = await getUserById(userId);
                    const uiUser: UIUser = {
                        id: userId,
                        first_name: userRes?.data?.first_name ?? "Unknown",
                        profile_pic: userRes?.data?.profile_pic ?? "",
                        is_connected: !!row.is_connected,
                    };
                    setUsers((prev) => (prev ? [...prev, uiUser] : [uiUser]));
                } catch (e) {
                    console.error("fetch new user failed:", e);
                    const fallback: UIUser = {
                        id: userId,
                        first_name: "Unknown",
                        profile_pic: "",
                        is_connected: !!row?.is_connected,
                    };
                    setUsers((prev) => (prev ? [...prev, fallback] : [fallback]));
                }
            }
        );

        // Optionally handle DELETE (user leaves tournament)
        channel.on(
            "postgres_changes",
            {
                event: "DELETE",
                schema: "public",
                table: "tournament_players",
                filter: `quiz_id=eq.${quizid}`,
            },
            (payload: any) => {
                const oldRow = payload.old;
                const userId = oldRow?.user_id;
                if (!userId) return;
                setUsers((prev) => prev?.filter((u) => u.id !== userId));
            }
        );

        channel.subscribe((status) => {
            console.log(status)
        });

        return () => {
            mounted = false;
            console.log("hji")
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Component /> Start Tournament
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="h-0" />
                <div className="px-5 pb-6 pt-0">
                    <div className="flex flex-wrap gap-3">
                        {users?.map((user) => (
                            <div
                                className="border bg-input/30 rounded-xl p-2 px-3 flex flex-col justify-center items-center"
                                key={user.id}
                            >
                                <div className="flex">
                                    <Image
                                        src={
                                            user.profile_pic && user.profile_pic.length > 0
                                                ? user.profile_pic
                                                : "/avatar-fallback.png"
                                        }
                                        height={64}
                                        width={64}
                                        alt="profile pic"
                                        className="size-16 rounded-full object-cover"
                                        unoptimized
                                    />
                                    <div
                                        className={`size-2 rounded-full absolute ${user.is_connected ? "bg-green-400" : "bg-red-400"
                                            }`}
                                    />
                                </div>
                                <p className="mt-1 text-sm">{user.first_name}</p>
                            </div>
                        ))}
                        {!users?.length && (
                            <p className="text-sm text-muted-foreground">No players yet</p>
                        )}
                    </div>

                    <CustomButton
                        disabled={loading}
                        className="w-full py-4 mt-5 justify-center bg-primary shadow-primary/70"
                        onClick={async () => {
                            try {
                                setLoading(true);
                                // TODO: start/toggle live state here
                                // await someAction(quiz.id)
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Go Live{" "}
                        {loading ? <Loader2 className="animate-spin size-5" /> : <Radio />}
                    </CustomButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StartTournament;
