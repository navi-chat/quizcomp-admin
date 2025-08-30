'use client'
import CreateQuiz from '@/components/CreateQuiz'
import CustomButton from '@/components/custom-button'
import Header from '@/components/header'
import QuizCard from '@/components/QuizCard'
import { getQuizzes } from '@/lib/actions/quizzes.actions'
import { QuizType } from '@/lib/types'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [quizzes, setQuizzes] = useState<QuizType[]>()
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    const initialCall = async () => {
      const quizzes = await getQuizzes();
      setQuizzes(quizzes.data as unknown as QuizType[])
    }
    if (isOpen === false) {
      initialCall()
    }
  }, [isOpen])
  return (
    <>
      <Header title='Home' buttons={<CustomButton className='text-sm bg-secondary shadow-secondary/70' onClick={() => setIsOpen(!isOpen)}><Plus className='size-4' />CREATE QUIZ</CustomButton>} />
      <div className='p-5 pb-0 flex'>
        <CreateQuiz isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className='px-5 flex flex-wrap gap-5'>
        {quizzes?.map((quiz) => (
          <QuizCard quiz={quiz} key={quiz.id} />
        ))}
      </div>
    </>
  )
}

export default Home
