"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "lucide-react"

export function BookMultipleClassesButton({ instances }: { instances: any[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const toggleInstance = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const bookSelected = async () => {
    // Book all selected instances
    for (const instanceId of selected) {
      await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId }),
      })
    }
    setOpen(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Book Multiple Classes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Classes to Book</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {instances.map((instance: any) => (
            <div key={instance.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <Checkbox checked={selected.includes(instance.id)} onCheckedChange={() => toggleInstance(instance.id)} />
              <div className="flex-1">
                <p className="font-medium">{instance.classes?.name}</p>
                <p className="text-sm text-muted-foreground">{new Date(instance.start_time).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={bookSelected} disabled={selected.length === 0} className="w-full">
          Book {selected.length} Class{selected.length !== 1 ? "es" : ""}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
