import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function DeleteDialog({ buttonTrigger, description, onClick }) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{buttonTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deletar</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={() => onClick()}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
