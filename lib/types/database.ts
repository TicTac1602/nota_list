export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  priority: Priority
  status: TaskStatus
  client_name?: string
  notaire?: string
  due_date?: string
  notes?: string
  created_at: string
  updated_at: string
  order_index: number
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
