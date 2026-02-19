'use client'
import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export default function MessagesPage() {
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  useEffect(() => {
    async function fetchContacts() {
      const res = await fetch(`/api/contact`)
      const json = await res.json()
      setContacts(json.data)
    }

    fetchContacts()
  }, [])

  useEffect(() => {
    if (!selected) return
    async function fetchMessages() {
      const res = await fetch(`/api/message?contactId=${selected.id}`)
      const json = await res.json()
      setMessages(json || [])
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
          <div className="space-y-2">
            {contacts.map((c) => (
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
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                      msg.direction === 'out'
                        ? 'ml-auto bg-primary text-primary-foreground'
                        : 'bg-muted',
                    )}
                  >
                    <p>{msg.content}</p>
                    <span className="block text-[10px] opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </>
        )}
      </Card>
    </div>
  )
}
