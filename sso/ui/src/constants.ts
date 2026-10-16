import { useProps, useEvents } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types.ts'

export interface Events {
  load: undefined
  unload: undefined
  // Emitted on the login page once a provider round-trip returns a session token,
  // so the host SPA can store it exactly as it stores a password-login token.
  token: { token: string }
  linked: { provider: string }
  error: { message: string, error: unknown }
}

export const useComponentProps = () => useProps<ComponentProps>()
export const useComponentEvents = () => useEvents<Events>()
