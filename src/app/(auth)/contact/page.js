import { ContactTable } from '@/components/tables/contacts/table'

export default function Contact() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Contatos</h1>

      <ContactTable />
    </div>
  )
}
