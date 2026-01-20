// 作息表时间项
export interface ScheduleItem {
  time: string
  activity: string
  description: string
}

// 补充建议
export interface Recommendation {
  period?: string
  note: string
}

// 作息表
export interface Schedule {
  id: string
  title: string
  description: string
  age_group: string
  scenario: string
  category: string
  target_audience: string
  source: string
  source_url: string
  schedule: ScheduleItem[]
  additional_recommendations?: Recommendation[]
  isCustom?: boolean
  createdAt?: string
  updatedAt?: string
}

// Toast 类型
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
  isVisible: boolean
}

// Toast Hook 返回类型
export interface ToastHook {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType, duration?: number) => number
  hideToast: (id: number) => void
  success: (message: string, duration?: number) => number
  error: (message: string, duration?: number) => number
  warning: (message: string, duration?: number) => number
  info: (message: string, duration?: number) => number
}

// 编辑状态
export interface EditingState {
  isCreating: boolean
  isEditing: boolean
}

// Schedule Context 值类型
export interface ScheduleContextValue {
  currentSchedule: Schedule | null
  schedules: Schedule[]
  customSchedules: Schedule[]
  quotes: string[]
  setCurrentSchedule: (schedule: Schedule) => void
  addCustomSchedule: (schedule: Schedule) => void
  updateCustomSchedule: (schedule: Schedule) => void
  deleteCustomSchedule: (scheduleId: string) => void
  openModal: (schedule: Schedule) => void
  closeModal: () => void
  useSchedule: () => void
  myPageEditingState: EditingState
  setMyPageEditingState: (state: EditingState) => void
  handleCustomizeFromModal: (data: { title: string; schedule: ScheduleItem[] }) => void
  toast: ToastHook
}

// 时间范围
export interface TimeRange {
  start: number
  end: number
}
