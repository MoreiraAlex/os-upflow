'use client'
import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function formatDayLabel(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a, b) => a.toDateString() === b.toDateString()

  if (isSameDay(date, today)) return 'Hoje'
  if (isSameDay(date, yesterday)) return 'Ontem'

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  useEffect(() => {
    async function fetchContacts() {
      setLoadingContacts(true)

      const res = await fetch(`/api/contact`)
      const json = await res.json()

      setContacts(json.data)
      setLoadingContacts(false)
    }

    fetchContacts()
  }, [])

  useEffect(() => {
    if (!selected) return

    async function fetchMessages() {
      setLoadingMessages(true)

      const res = await fetch(`/api/message?contactId=${selected.id}`)
      const json = await res.json()

      setMessages(json || [])
      setLoadingMessages(false)
    }

    fetchMessages()
  }, [selected])

  return (
    <div className="h-[calc(100vh-64px)] md:grid md:grid-cols-[320px_1fr] gap-4 p-4">
      <Card className={cn('p-2 h-[86vh]', selected && 'hidden md:block')}>
        <h2 className="font-semibold mb-3 px-2 text-lg border-b-2 h-16 flex items-center">
          Celulares
        </h2>

        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="space-y-2 px-2">
            <div className="space-y-2 px-2">
              {loadingContacts
                ? [...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2 p-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                : contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={cn(
                        'w-full text-left p-3 rounded-md hover:bg-muted transition',
                        selected?.id === c.id && 'bg-muted',
                      )}
                    >
                      <p className="font-medium">{c.name || 'Sem nome'}</p>
                      <p className="text-xs text-muted-foreground">{c.phone}</p>
                    </button>
                  ))}
            </div>
          </div>
        </ScrollArea>
      </Card>

      <Card
        className={cn(
          'p-2 flex flex-col h-[86vh]',
          !selected && 'hidden md:flex',
        )}
      >
        {!selected ? (
          <p className="text-muted-foreground m-auto">
            Selecione um contato para ver as mensagens
          </p>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2 border-b-2 p-2 w-full h-16">
              <button
                onClick={() => setSelected(null)}
                className="md:hidden text-sm px-2 py-1 rounded hover:bg-muted"
              >
                <ArrowLeft />
              </button>

              <div>
                <h2 className="font-semibold text-lg">
                  {selected.name || 'Sem nome'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selected.phone}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {loadingMessages
                  ? [...Array(6)].map((_, i) => (
                      <div key={i} className="flex">
                        <Skeleton className="h-14 w-2/3 rounded-lg" />
                      </div>
                    ))
                  : (() => {
                      let lastDay = ''

                      return messages.map((msg) => {
                        const msgDate = new Date(msg.createdAt).toDateString()
                        const showHeader = msgDate !== lastDay
                        lastDay = msgDate

                        return (
                          <div key={msg.id}>
                            {showHeader && (
                              <div className="flex justify-center my-4">
                                <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                                  {formatDayLabel(msg.createdAt)}
                                </span>
                              </div>
                            )}

                            <div
                              className={cn(
                                'max-w-[75%] rounded-lg px-3 py-2 text-sm mb-1',
                                msg.direction === 'out'
                                  ? 'ml-auto bg-primary text-primary-foreground'
                                  : 'bg-muted',
                              )}
                            >
                              <p>{msg.content}</p>
                              <span className="block text-[10px] opacity-70 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  'pt-BR',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    })()}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </>
        )}
      </Card>
    </div>
  )
}
