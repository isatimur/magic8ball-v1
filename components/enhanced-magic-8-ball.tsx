'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, useAnimation, AnimationControls } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {Volume2, VolumeX, Share2, Settings, Trash2, Star, Heart } from "lucide-react"
import confetti from 'canvas-confetti'

interface HistoryItem {
  id: number;
  user: string;
  question: string;
  answer: string;
  timestamp: string;
  likes: number;
  rating: number;
}
const Magic8Ball = ({ answer, theme, shake, isShaking, shakeControls, showAnswer }: { answer: string; theme: string; shake: () => void; isShaking: boolean; shakeControls: AnimationControls; showAnswer: boolean }) => {

  const ballColors = {
    classic: 'bg-blue-900',
    neon: 'bg-green-500',
    sunset: 'bg-orange-500',
    galaxy: 'bg-purple-700',
  }

  const windowColors = {
    classic: 'bg-blue-950',
    neon: 'bg-green-700',
    sunset: 'bg-orange-700',
    galaxy: 'bg-purple-900',
  }

  return (
    <div className="relative w-full h-full mx-auto">
      <motion.div
        className={`w-[32em] h-[32em] ${ballColors[theme as keyof typeof ballColors]} rounded-full shadow-lg flex items-center justify-center`}
        animate={isShaking ? shakeControls : {}}
        onClick={shake}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <motion.div
          className={`w-[24em] h-[24em] ${windowColors[theme as keyof typeof windowColors]} rounded-full flex items-center justify-center`}
        >
          {!showAnswer ? (
            <motion.span
              key="eight"
              className="text-white font-bold text-[24em]"
              style={{
                transform: 'rotate(-90deg)',
                fontFamily: "Sevillana, sans-serif",
                fontSize: '24rem',
                marginTop: '-8rem',
                willChange: 'transform, opacity'
              }}
            >
              8
            </motion.span>
          ) : (
            <motion.div
              key="triangle"
              className="relative flex items-center justify-center pt-20 pb-0 text-4xl"

            >
              {/* SVG Transparent triangle with black borders */}
              <svg
                width="300"
                height="300"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'rotate(180deg)' }}
              >
                <polygon points="50,10 95,95 5,95" fill="transparent" stroke="white" stroke-width="2"></polygon>
                <text
                  x="40%"
                  y="20%"
                  fontSize="12"
                  fill="white"
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  transform="rotate(180, 50, 50)"
                >
                  {answer.split("\n").map((line, idx) => (
                    <tspan
                      key={idx}
                      x="50%"
                      dy={`${idx === 0 ? 0 : 14}`}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </svg>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

interface AnswerHistoryProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

const AnswerHistory: React.FC<AnswerHistoryProps> = ({ history, onDelete, onLike, onRate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Answers</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[300px]">
        <ul className="space-y-4">
          {history.map((item) => (
            <li key={item.id} className="text-sm flex flex-col">
              <div className="flex justify-between items-start">
                <span className="font-medium">{item.question}</span>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onLike(item.id.toString())}>
                          <Heart className={`h-4 w-4 ${item.likes > 0 ? 'text-red-500' : ''}`} />
                          <span className="ml-1">{item.likes}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Like this answer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TooltipProvider key={star}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Star
                              className={`h-4 w-4 cursor-pointer ${star <= item.rating ? 'text-yellow-500' : 'text-gray-400'}`}
                              onClick={() => onRate(item.id.toString(), star)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rate this answer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id.toString())}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete this answer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <span className="italic">{item.answer}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </CardContent>
  </Card>
)

const PopularQuestions = ({ questions, onAsk }: { questions: { question: string }[], onAsk: (question: string) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>Popular Questions</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[300px]">
        <ul className="space-y-2">
          {questions.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-sm">{item.question}</span>
              <Button size="sm" variant="ghost" onClick={() => onAsk(item.question)}>
                Ask
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </CardContent>
  </Card>
)

interface UserProfileProps {
  user: {
    name: string;
    level: number;
    xp: number;
    badges: string[];
  };
  onLevelUp: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLevelUp }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
          {user.level}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">Level {user.level} Seeker</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Experience</span>
          <span>{user.xp} / {user.level * 100} XP</span>
        </div>
        <Progress value={(user.xp / (user.level * 100)) * 100} />
      </div>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Badges</h4>
        <div className="flex flex-wrap gap-2">
          {user.badges.map((badge, index) => (
            <Badge key={index} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      {user.xp >= user.level * 100 && (
        <Button className="w-full mt-4" onClick={onLevelUp}>
          Level Up!
        </Button>
      )}
    </CardContent>
  </Card>
)

interface Settings {
  darkMode: boolean;
  animationSpeed: number;
  theme: string;
}

const SettingsDialog = ({ settings, onSettingsChange }: { settings: Settings, onSettingsChange: (settings: Settings) => void }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={settings.darkMode}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, darkMode: checked })}
          />
        </div>
        <div className="space-y-2">
          <Label>Animation Speed</Label>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[settings.animationSpeed]}
            onValueChange={(value) => onSettingsChange({ ...settings, animationSpeed: value[0] })}
          />
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <select
            value={settings.theme}
            onChange={(e) => onSettingsChange({ ...settings, theme: e.target.value })}
            className="w-full p-2 rounded-md"
          >
            <option value="classic">Classic</option>
            <option value="neon">Neon</option>
            <option value="sunset">Sunset</option>
            <option value="galaxy">Galaxy</option>
          </select>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export function EnhancedMagic_8Ball() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('8')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [settings, setSettings] = useState({
    darkMode: false,
    animationSpeed: 1,
    theme: 'classic',
  })
  const [popularQuestions, setPopularQuestions] = useState([
    { question: "Will I get a promotion this year?", count: 15 },
    { question: "Should I start a new hobby?", count: 12 },
    { question: "Is it a good time to travel?", count: 10 },
    { question: "Will I find love soon?", count: 9 },
    { question: "Should I change my career?", count: 8 },
    { question: "Will I make new friends this year?", count: 7 },
    { question: "Is it a good time to invest in stocks?", count: 6 },
    { question: "Will I achieve my fitness goals?", count: 5 },
    { question: "Should I adopt a pet?", count: 4 },
    { question: "Will I learn a new skill successfully?", count: 3 },
  ])
  const [user, setUser] = useState({
    name: "Curious User",
    level: 1,
    xp: 0,
    badges: ["Novice Seeker", "First Question"],
  })
  const [isShaking, setIsShaking] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const shakeControls = useAnimation()

  const playSound = useCallback((soundName: string) => {
    if (isSoundOn) {
      const audio = new Audio(`/assets/audio/${soundName}.mp3`)
      audio.play()
    }
  }, [isSoundOn])

  const handleShakeAndAsk = useCallback(async (customQuestion = '') => {
    const questionToAsk = customQuestion || question
    if (questionToAsk.trim() === '' || isShaking) return

    setIsShaking(true)
    setShowAnswer(false)
    playSound('shake')

    // Add vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 30, 100, 30, 100])
    }

    const shakeSequence = [
      { x: 0, y: 0, rotate: 0, scale: 1 },
      { x: -15, y: -15, rotate: -5, scale: 1.05 },
      { x: 15, y: 15, rotate: 5, scale: 1.05 },
      { x: -15, y: 15, rotate: -5, scale: 1.05 },
      { x: 15, y: -15, rotate: 5, scale: 1.05 },
      { x: 0, y: 0, rotate: 0, scale: 1 },
    ]

    await shakeControls.start({
      x: shakeSequence.map(point => point.x),
      y: shakeSequence.map(point => point.y),
      rotate: shakeSequence.map(point => point.rotate),
      scale: shakeSequence.map(point => point.scale),
      transition: {
        duration: 0.5,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeInOut",
        repeat: 4,
        repeatType: "reverse",
      },
    })

    // Simulate "thinking" time
    await new Promise(resolve => setTimeout(resolve, 500))

    const answers = [
      'It is\n certain', 'It is\n decidedly\n so', 'Without\n a doubt', 'Yes\n definitely',
      'You may\n rely on\n it', 'As I\n see it,\n yes', 'Most\n likely', 'Outlook\n good',
      'Yes', 'Signs\n point to\n yes', 'Reply\n hazy, try again', 'Ask again\n later',
      'Better\n not tell\n you\n now', 'Cannot\n predict\n now', 'Concentrate\n and ask\n again',
      'Don\'t count\n on it', 'My reply\n is no', 'My\n sources\n say no',
      'Outlook\n not so\n good', 'Very\n doubtful'
    ]
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)]

    setAnswer(randomAnswer)
    setShowAnswer(true)
    setIsShaking(false)
    playSound('reveal')

    await addAnswer(questionToAsk, randomAnswer)
    setHistory(prevHistory => [{
      id: Date.now(),
      user: 'You',
      question: questionToAsk,
      answer: randomAnswer,
      timestamp: new Date().toISOString(),
      likes: 0,
      rating: 0
    } as HistoryItem, ...prevHistory])
    setQuestion('')

    if (['It is certain', 'Yes definitely', 'You may rely on it'].includes(randomAnswer)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    // Update user XP and check for level up
    setUser(prevUser => {
      const newXP = prevUser.xp + 10
      const newLevel = Math.floor(newXP / 100) + 1
      const newBadges = [...prevUser.badges]

      if (newLevel > prevUser.level) {
        newBadges.push(`Level ${newLevel} Seeker`)
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 }
        })
      }

      if (newXP >= 100 && !newBadges.includes("Dedicated Seeker")) {
        newBadges.push("Dedicated Seeker")
      }

      return {
        ...prevUser,
        xp: newXP,
        level: newLevel,
        badges: newBadges
      }
    })

    // Update popular questions
    setPopularQuestions(prevQuestions => {
      const existingIndex = prevQuestions.findIndex(q => q.question === questionToAsk)
      if (existingIndex !== -1) {
        const updatedQuestions = [...prevQuestions]
        updatedQuestions[existingIndex] = {
          ...updatedQuestions[existingIndex],
          count: updatedQuestions[existingIndex].count + 1
        }
        return updatedQuestions.sort((a, b) => b.count - a.count)
      } else if (prevQuestions.length < 20) {
        return [...prevQuestions, { question: questionToAsk, count: 1 }].sort((a, b) => b.count - a.count)
      } else {
        return prevQuestions
      }
    })
  }, [question, isShaking, playSound, shakeControls])

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchAnswerHistory()
      setHistory(data)
    }
    loadHistory()

    const storedSettings = JSON.parse(localStorage.getItem('settings') || '{}')
    setSettings(prevSettings => ({ ...prevSettings, ...storedSettings }))

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (storedUser.name) {
      setUser(storedUser)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
    document.body.classList.toggle('dark', settings.darkMode)
  }, [settings])

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  const handleShare = () => {
    const shareText = `I just asked the Magic 8 Ball: "${question}"\nThe answer was: "${answer}"\nI'm a Level ${user.level} Seeker! Can you beat my level?\nTry it yourself!`
    if (navigator.share) {
      navigator.share({
        title: 'My Magic 8 Ball Result',
        text: shareText,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Result copied to clipboard! Share it with your friends!')
      })
    }
  }
  const handleDeleteHistory = (id: number) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id))
  }

  const handleLike = (id: number) => {
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    )
    // Update popular questions based on likes
    const likedQuestion = history.find(item => item.id === id)
    if (likedQuestion) {
      setPopularQuestions(prevQuestions => {
        const existingIndex = prevQuestions.findIndex(q => q.question === likedQuestion.question)
        if (existingIndex !== -1) {
          const updatedQuestions = [...prevQuestions]
          updatedQuestions[existingIndex] = {
            ...updatedQuestions[existingIndex],
            count: updatedQuestions[existingIndex].count + 1
          }
          return updatedQuestions.sort((a, b) => b.count - a.count)
        } else if (prevQuestions.length < 20) {
          return [...prevQuestions, { question: likedQuestion.question, count: 1 }].sort((a, b) => b.count - a.count)
        } else {
          return prevQuestions
        }
      })
    }
  }

  const handleRate = (id: number, rating: number) => {
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.id === id ? { ...item, rating } : item
      )
    )
  }

  const handleLevelUp = () => {
    setUser(prevUser => ({
      ...prevUser,
      level: prevUser.level + 1,
      xp: prevUser.xp - prevUser.level * 100,
      badges: [...prevUser.badges, `Level ${prevUser.level + 1} Seeker`]
    }))
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${settings.darkMode ? 'from-gray-900 to-gray-700' : 'from-purple-700 to-indigo-900'} flex flex-col items-center justify-center p-4`}>
      <h1 className="text-4xl font-bold text-white mb-8">Magic 8 Ball</h1>
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="pt-6">
              <Magic8Ball answer={answer} theme={settings.theme} isShaking={isShaking} shake={handleShakeAndAsk} shakeControls={shakeControls} showAnswer={showAnswer} />
              <div className="flex space-x-2 mt-4">
                <Input
                  type="text"
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-grow bg-white/50 placeholder-gray-500 text-gray-800"
                  disabled={isShaking}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={() => handleShakeAndAsk()} disabled={isShaking} className="bg-indigo-600 hover:bg-indigo-700">
                        Ask
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ask the Magic 8 Ball</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setIsSoundOn(!isSoundOn)}>
                          {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isSoundOn ? 'Mute sounds' : 'Unmute sounds'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <SettingsDialog settings={settings} onSettingsChange={setSettings} />
                </div>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleShare}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share your result</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
          <UserProfile user={user} onLevelUp={handleLevelUp} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AnswerHistory
            history={history}
            onDelete={(id) => handleDeleteHistory(Number(id))}
            onLike={(id) => handleLike(Number(id))}
            onRate={(id, rating) => handleRate(Number(id), rating)}
          />
          <PopularQuestions questions={popularQuestions} onAsk={handleShakeAndAsk} />
        </div>
      </div>
    </div>
  )
}

// Simulated backend functions
const fetchAnswerHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { id: 1, user: 'Alice', question: 'Will it rain today?', answer: 'Yes', timestamp: new Date().toISOString(), likes: 5, rating: 4 },
    { id: 2, user: 'Bob', question: 'Should I buy a new car?', answer: 'Ask again later', timestamp: new Date(Date.now() - 86400000).toISOString(), likes: 3, rating: 3 },
  ]
}

const addAnswer = async (question: string, answer: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Added answer:', { question, answer })
}