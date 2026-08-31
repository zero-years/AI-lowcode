const THREAD_ID_KEY = 'ai_screen_degisn:threadId'

export function getThreadId(): string {
  return localStorage.getItem(THREAD_ID_KEY)
}

export function setThreadId(threadId: string): void {
  localStorage.setItem(THREAD_ID_KEY, threadId)
}

export function deleteThreadId(): void {
  localStorage.removeItem(THREAD_ID_KEY)
}
