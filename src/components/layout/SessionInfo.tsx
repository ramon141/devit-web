import { UserIcon, LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useSessionInfo } from '@/hooks/useSessionInfo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Auth } from '@/auth'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

type SessionInfoProps = {
  className?: string
  avatarOnly?: boolean
}

function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

// Nome, filiale e livello dell'utente loggato, fisso in ogni schermata
function SessionInfo({ className, avatarOnly = false }: SessionInfoProps) {
  const { fullName, accessLevelLabel, branchName, avatarUrl } = useSessionInfo()
  const navigate = useNavigate()

  if (!fullName) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button" className={cn('flex items-center gap-2 rounded-lg', className)}>
            {!avatarOnly && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{fullName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[accessLevelLabel, branchName].filter(Boolean).join(' · ')}
                </p>
              </div>
            )}

            <Avatar className="size-9">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback>{initials(fullName)}</AvatarFallback>
            </Avatar>
          </button>
        }
      />

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`${CRM_BASE_PATH}/profilo`)}>
          <UserIcon />
          Il mio profilo
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => Auth.logout()}>
          <LogOutIcon />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SessionInfo
