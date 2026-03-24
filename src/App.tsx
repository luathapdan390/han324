/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck, Send, AlertCircle, Play, CheckCircle2, Loader2, Shield, Crown, BookOpen, Palette, Compass, Heart, HandHelping, Laugh } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- DATA ---
const examData = [
  {
    partTitle: "Part 1 – Pronunciation",
    instruction: "Mark the letter A, B, C, D to indicate the word whose underlined part differs from the other three in pronunciation.",
    type: "multiple-choice",
    questions: [
      { id: "q1", prompt: "A. concert   B. sitcom   C. forensic   D. music", options: ["A", "B", "C", "D"], answer: "A" },
      { id: "q2", prompt: "A. forgery   B. gallery   C. vegetable   D. village", options: ["A", "B", "C", "D"], answer: "B" }
    ]
  },
  {
    partTitle: "Part 2 – Stress",
    instruction: "Mark the letter A, B, C, D to indicate the word that differs from the other three in the position of primary stress.",
    type: "multiple-choice",
    questions: [
      { id: "q3", prompt: "A. ordinary   B. intelligent   C. acceptable   D. remarkable", options: ["A", "B", "C", "D"], answer: "A" },
      { id: "q4", prompt: "A. harmony   B. museum   C. gallery   D. customer", options: ["A", "B", "C", "D"], answer: "B" }
    ]
  },
  {
    partTitle: "Part 3 – Grammar & Vocabulary",
    instruction: "Mark the letter A, B, C, D to indicate the correct answer to each of the following questions.",
    type: "multiple-choice",
    questions: [
      { id: "q5", prompt: "Which British __________ sang on the 2011 hit Someone Like You?\nA. singer   B. poet   C. painter   D. carver", options: ["A", "B", "C", "D"], answer: "A" },
      { id: "q6", prompt: "The last time I went to a(an) __________ was a few weeks ago. It was at the National Gallery in London.\nA. rock concert   B. classical concert   C. art gallery   D. opera", options: ["A", "B", "C", "D"], answer: "C" },
      { id: "q7", prompt: "Who __________ the movie \"The Godfather\" __________ by?\nA. was/ directed   B. is/ directed   C. does/ direct   D. did/ direct", options: ["A", "B", "C", "D"], answer: "A" },
      { id: "q8", prompt: "Can I talk to __________ about this job?\nA. anybody   B. somebody   C. no one   D. everyone", options: ["A", "B", "C", "D"], answer: "A" },
      { id: "q9", prompt: "The teacher has the exercise __________ the third time.\nA. rewrite   B. to rewrite   C. rewrote   D. rewritten", options: ["A", "B", "C", "D"], answer: "D" }
    ]
  },
  {
    partTitle: "Part 4 – Guided Cloze Test 1",
    instruction: "Read the following advertisement/announcement and mark the letter A, B, C, or D to indicate the correct option.",
    passage: "Do you speak English? Are you interested in museums? Would you like a holiday job where you could meet people from all over (10) __________ world? We are looking (11) __________ someone to work in the City Museum shop during the holidays. No experience is necessary but you must be (12) __________ and helpful and have some interest in art. Contact Mrs. Donovan at the City Museum.",
    type: "multiple-choice",
    questions: [
      { id: "q10", prompt: "Question 10:\nA. a   B. an   C. the   D. Ø (no article)", options: ["A", "B", "C", "D"], answer: "C" },
      { id: "q11", prompt: "Question 11:\nA. for   B. on   C. at   D. in", options: ["A", "B", "C", "D"], answer: "A" },
      { id: "q12", prompt: "Question 12:\nA. friend   B. friendship   C. friendliness   D. friendly", options: ["A", "B", "C", "D"], answer: "D" }
    ]
  },
  {
    partTitle: "Part 5 – Guided Cloze Test 2",
    instruction: "Read the following passage and mark the letter A, B, C, or D to indicate the correct option.",
    passage: "Book reviews wanted\nHave you read a book in which the main character behaved in a surprising way? Write us a review of the book, (13) __________ what the main character did and why it was surprising. Tell us whether or not you (14) __________ recommend this book to other people. The best review (15) __________ in the magazine.",
    type: "multiple-choice",
    questions: [
      { id: "q13", prompt: "Question 13:\nA. explaining   B. complaining   C. containing   D. remaining", options: ["A", "B", "C", "D"], answer: "A" },
      { id: "q14", prompt: "Question 14:\nA. should   B. would   C. can   D. do", options: ["A", "B", "C", "D"], answer: "B" },
      { id: "q15", prompt: "Question 15:\nA. publishes   B. publish   C. will be published   D. published", options: ["A", "B", "C", "D"], answer: "C" }
    ]
  },
  {
    partTitle: "Part 6 – Sentence / Paragraph Arrangement",
    instruction: "Mark the letter A, B, C or D to indicate the best arrangement of utterances or sentences.",
    type: "multiple-choice",
    questions: [
      { id: "q16", prompt: "Question 16:\na. Minh: Yes, it stands for the 80th anniversary of Vietnam's National Day.\nb. Paul: I’ve been hearing a lot about A80 recently in your country, do you know what it means?\nc. Paul: Wow! I really want to travel to Vietnam and see the celebrations in person.\nA. c-b-a   B. b-c-a   C. b - a – c   D. c-a-b", options: ["A", "B", "C", "D"], answer: "C" },
      { id: "q17", prompt: "Question 17 (Sắp xếp hội thoại):\na. Lan: That’s because she also earned 2 bonus points thanks to her SAT score of 1540.\nb. Nam: Wow, that’s really impressive! I heard the entrance score is 30 out of 30.\nc. Lan: My sister just got into the English Language Teacher program at ULIS.\nd. Nam: Oh, so why can she get into that?\ne. Lan: Yes, it’s very competitive. My sister scored 28.4 points in the D01 subject combination.\n\nA. c-d-a-b-e   B. c-a-d-b-e   C. c-b-d-e-a   D. c-b-e-d-a", options: ["A", "B", "C", "D"], answer: "D" },
      { id: "q18", prompt: "Question 18 (Sắp xếp đoạn văn - Thư mời):\nDear Linh,\na. From there, we’ll have a clear view of the performers and can experience the excitement of the event.\nb. I wanted to let you know that there will be a parade rehearsal taking place at 9 PM on 27 July, and I thought it would be a great idea if we could go and watch it together.\nc. Please let me know if you’re free, so we can plan to meet up and head there together.\nd. I think it would be a fun and memorable evening, and it would be even better to share it with you.\ne. If you’re interested, I recommend that we go to Nguyen Thai Hoc Street or Trang Thi Street.\nBest regards, Duong.\n\nA. b-c-d-a-e   B. b-e-a-d-c   C. b-a-d-c-e   D. b-e-d-a-c", options: ["A", "B", "C", "D"], answer: "B" },
      { id: "q19", prompt: "Question 19 (Sắp xếp đoạn văn - Tin tức):\na. The two young men need to be strictly punished so that such dangerous cases will not happen again in the future.\nb. The captain, who is an officer of the Mobile Police Command, fell hard onto the road after the strong hit.\nc. Two young men were riding a motorbike and they did not follow the police officer’s order to stop, but instead drove very fast and crashed straight into the captain.\nd. At first, it was found that he suffered a serious head injury, along with broken nose bones, broken jaw bones, and a broken left arm.\ne. On August 21, I went to watch the parade rehearsal and saw something very shocking happen on the street.\n\nA. e-a-d-c-b   B. d-c-e-b-a   C. e-c-b-d-a   D. d-a-c-e-b", options: ["A", "B", "C", "D"], answer: "C" }
    ]
  }
];
// --- ARCHETYPES ---
interface Archetype {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const ARCHETYPES: Archetype[] = [
  { id: 'warrior', name: 'Warrior', icon: <Shield className="w-8 h-8" />, description: 'Strong, determined, never gives up', color: 'bg-emerald-500' },
  { id: 'leader', name: 'Leader', icon: <Crown className="w-8 h-8" />, description: 'Leads, controls, guides others', color: 'bg-emerald-500' },
  { id: 'sage', name: 'Sage', icon: <BookOpen className="w-8 h-8" />, description: 'Wise, loves learning, deep understanding', color: 'bg-emerald-500' },
  { id: 'creator', name: 'Creator', icon: <Palette className="w-8 h-8" />, description: 'Creative, rich imagination', color: 'bg-emerald-500' },
  { id: 'explorer', name: 'Explorer', icon: <Compass className="w-8 h-8" />, description: 'Loves exploring, curious, values experiences', color: 'bg-emerald-500' },
  { id: 'lover', name: 'Lover', icon: <Heart className="w-8 h-8" />, description: 'Emotional, connection, values relationships', color: 'bg-emerald-500' },
  { id: 'caregiver', name: 'Caregiver', icon: <HandHelping className="w-8 h-8" />, description: 'Caring, helpful, looks after others', color: 'bg-emerald-500' },
  { id: 'jester', name: 'Jester', icon: <Laugh className="w-8 h-8" />, description: 'Humorous, fun, makes everyone laugh', color: 'bg-emerald-500' },
];

// --- CONSTANTS ---
const BOT_TOKEN = '8260200134:AAFlf6xMu9DAYAKWDJVoLFczYRRzWVqijnY';
const CHAT_ID = '6789535208';

export default function App() {
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NEW STATES
  const [name, setName] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);

  // Calculate Total Questions
  const totalQuestions = examData.reduce((acc, part) => acc + part.questions.length, 0);

  // Fullscreen Logic
  const handleStartTest = async () => {
    if (!name.trim() || !selectedArchetype) {
      setError("Please enter your name and select an archetype.");
      return;
    }

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setTestStarted(true);
      setError(null);
      setAnswers({});
      setResult(null);
    } catch (err) {
      console.error("Fullscreen request failed", err);
      setError("Please allow fullscreen to start the test.");
    }
  };

  const resetTest = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Failed to exit fullscreen", err);
      }
    }
    
    setTestStarted(false);
    setAnswers({});
    setResult(null);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted) {
        alert("Fullscreen exited! The test has been reset for security reasons.");
        resetTest();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [testStarted, resetTest]);

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let score = 0;
    let detailReport = "";

    examData.forEach((part) => {
      part.questions.forEach((q) => {
        const userAnswer = (answers[q.id] || '').trim().toUpperCase();
        const correctAnswer = q.answer.toUpperCase();
        
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) {
          score++;
        }
        
        detailReport += `${q.id.toUpperCase()}: ${userAnswer || 'Skipped'} (Target: ${correctAnswer}) - ${isCorrect ? '✅' : '❌'}\n`;
      });
    });

    const resultData = { score, total: totalQuestions };
    setResult(resultData);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Telegram Notification
    try {
      const message = `🎯 GVP High School - Unit 7 Test 2\n\n👤 Name: ${name}\n🎭 Archetype: ${selectedArchetype?.name}\n📊 Score: ${score}/${totalQuestions}\n📈 Percentage: ${((score / totalQuestions) * 100).toFixed(2)}%\n⏰ Time: ${new Date().toLocaleString()}\n\n-- DETAILS --\n${detailReport}`;
      
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      });
    } catch (err) {
      console.error("Telegram report failed", err);
    } finally {
      setIsSubmitting(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleOptionSelect = (qId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <AnimatePresence mode="wait">
        {!testStarted && !result ? (
          // --- WELCOME SCREEN ---
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-5xl mx-auto"
          >
            <div className="w-full bg-zinc-900/50 p-8 rounded-3xl border border-emerald-500/20 shadow-2xl backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="inline-flex w-20 h-20 bg-emerald-500/10 rounded-3xl items-center justify-center mb-6 border border-emerald-500/20">
                  <ClipboardCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                  GO VAP HIGH SCHOOL <span className="text-emerald-500 italic">25-26</span>
                </h1>
                <p className="text-zinc-400 max-w-md mx-auto text-lg font-bold">
                  UNIT 7 – PRACTICE TEST 2
                </p>
              </div>
              
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="max-w-md mx-auto">
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest text-center">Your Identity</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center text-lg text-emerald-400 placeholder:text-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest text-center">Select Your Archetype</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ARCHETYPES.map((arch) => (
                      <button
                        key={arch.id}
                        onClick={() => setSelectedArchetype(arch)}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all text-center group ${
                          selectedArchetype?.id === arch.id
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${arch.color} bg-opacity-20 text-emerald-400`}>
                          {arch.icon}
                        </div>
                        <h4 className="font-bold text-sm text-zinc-200 mb-1">{arch.name}</h4>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-400/10 py-3 px-4 rounded-lg max-w-md mx-auto border border-red-400/20"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </motion.div>
                )}

                <div className="max-w-md mx-auto pt-4">
                  <button
                    onClick={handleStartTest}
                    className="w-full group relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg py-5 px-8 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] uppercase tracking-widest"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    {selectedArchetype ? `START AS ${selectedArchetype.name.toUpperCase()}` : 'CHOOSE ARCHETYPE'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : result ? (
          // --- RESULT SCREEN ---
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center w-full max-w-3xl mx-auto"
          >
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20 relative">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Test Completed, {name}!</h2>
            <p className="text-zinc-400 mb-8">Your results have been securely recorded.</p>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-12 w-full shadow-2xl">
              <div className="text-6xl font-black text-emerald-500 mb-2">
                {result.score}<span className="text-zinc-700 text-3xl">/{result.total}</span>
              </div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest mb-6">Final Score</div>
              
              <div className="mt-6 border-t border-zinc-800 pt-6 text-left max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                <h4 className="text-emerald-400 font-bold mb-4">Detailed Review:</h4>
                {examData.flatMap(part => part.questions).map(q => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.answer;
                  return (
                    <div key={q.id} className="mb-2 text-sm">
                      <span className="font-mono text-zinc-500 w-10 inline-block">{q.id.toUpperCase()}:</span>
                      <span className={isCorrect ? "text-emerald-400" : "text-red-400 line-through mr-2"}>
                        {userAnswer || 'Skipped'}
                      </span>
                      {!isCorrect && <span className="text-emerald-400 font-bold ml-2">({q.answer})</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              onClick={resetTest}
              className="text-zinc-400 hover:text-white transition-colors text-sm underline underline-offset-4"
            >
              Return to Headquarters
            </button>
          </motion.div>
        ) : (
          // --- TEST SCREEN ---
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-xl py-4 mb-12 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedArchetype?.color} bg-opacity-20 text-emerald-400`}>
                  {selectedArchetype?.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-500">{name}</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Fullscreen Active</p>
                </div>
              </div>
              <div className="text-sm font-mono bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 text-emerald-400">
                {Object.keys(answers).length}/{totalQuestions}
              </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-16 pb-32">
              
              {examData.map((part, pIdx) => (
                <section key={pIdx} className="space-y-6">
                  <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h3 className="text-2xl font-black text-zinc-100">{part.partTitle}</h3>
                    <p className="text-zinc-400 text-sm mt-2">{part.instruction}</p>
                  </div>
                  
                  {part.passage && (
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mb-6 text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {part.passage}
                    </div>
                  )}

                  <div className="grid gap-6">
                    {part.questions.map((q) => {
                      return (
                        <div key={q.id} className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-900">
                          <p className="text-zinc-300 font-medium mb-4 whitespace-pre-wrap leading-relaxed">
                            <span className="text-emerald-600 mr-2 font-bold">{q.id.replace('q', 'Q')}.</span>
                            {q.prompt}
                          </p>
                          
                          <div className="flex flex-wrap gap-3">
                            {q.options.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleOptionSelect(q.id, opt)}
                                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                                  answers[q.id] === opt
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* SUBMIT FOOTER */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 uppercase tracking-widest"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Final Test
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}
