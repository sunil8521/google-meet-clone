import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme,setTheme } = useTheme()

  return (
    <Button variant="ghost" size="sm" onClick={()=>{setTheme(theme=="dark"?"light":"dark")}} className="h-8 w-8 p-0">
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
