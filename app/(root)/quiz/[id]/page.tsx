'use client'
import CreateRound from '@/components/CreateRound'
import CustomButton from '@/components/custom-button'
import Header from '@/components/header'
import RoundCard from '@/components/RoundCard'
import StartTournament from '@/components/StartTournament'
import { getQuizById, setQuizStatus } from '@/lib/actions/quizzes.actions'
import { getRoundsByQuizId } from '@/lib/actions/rounds.actions'
import { supabase } from '@/lib/supabase'
import { QuizType, RoundType } from '@/lib/types'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export function formatReadableDate(iso: string, locale: string = 'en-IN') {
    const d = new Date(iso);

    // Time: 12‑hour, minutes with leading zero, uppercase AM/PM
    const time = d.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).toUpperCase(); // ensures PM not pm across browsers

    // Date: day number + full month + full year
    const date = d.toLocaleDateString(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    // Remove any locale-specific commas before the day if present
    // and render as “2:30 PM, 24 August 2025”
    return `${time}, ${date.replace(/,\s*/g, ' ').replace(/^0/, '')}`;
}

const Quiz = () => {
    const params = useParams()
    const quizid = params.id as string;
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenStart, setIsOpenStart] = useState(false)


    const [quiz, setQuiz] = useState<QuizType>()
    const [rounds, setRounds] = useState<RoundType[]>()
    useEffect(() => {
        const initialCall = async () => {
            const quizRes = await getQuizById(quizid);
            setQuiz(quizRes.data)
        }
        initialCall()
    }, [quizid])

    useEffect(() => {
        const updateStatus = async () => {
            await setQuizStatus(quizid, "upcoming")
        }
        updateStatus()
    })

    useEffect(() => {
        const getRoundsEffect = async () => {
            const rounds = await getRoundsByQuizId(quizid)
            setRounds(rounds.data as unknown as RoundType[])
        }
        if (isOpen === false) {
            getRoundsEffect()
        }
    }, [isOpen])

    return (
        <>
            <Header title={quiz?.name || ""} buttons={<>
                <CustomButton className='bg-secondary shadow-secondary/80' onClick={() => setIsOpenStart(!isOpenStart)}>Start Tournament</CustomButton>
                <CustomButton onClick={() => setIsOpen(!isOpen)}>Add Round</CustomButton>
            </>} />
            <CreateRound isOpen={isOpen} setIsOpen={setIsOpen} />
            <StartTournament isOpen={isOpenStart} setIsOpen={setIsOpenStart} quiz={quiz!} />
            {quiz && (
                <div className='p-5 flex gap-5'>
                    <div>
                        <Image src={quiz?.thumbnail as string} alt='thumbnail' height={1000} width={1000} className='w-sm' />
                    </div>
                    <table className='bg-foreground/5 text-foreground/80'>
                        <tbody className='*:**:px-5 *:**:py-3 *:**:border'>
                            <tr>
                                <td>Quiz Name</td>
                                <td>{quiz?.name}</td>
                            </tr>
                            <tr>
                                <td>Date</td>
                                <td>{formatReadableDate(quiz?.date as string)}</td>
                            </tr>
                            <tr>
                                <td>Subjects</td>
                                <td>{quiz?.subjects.join(", ")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <div className='p-5 pt-0 space-y-5'>
                {rounds?.map((round) => (
                    <RoundCard round={round} key={round.created_at} />
                ))}
            </div>
        </>
    )
}

export default Quiz
