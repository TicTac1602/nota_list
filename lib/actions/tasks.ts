'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Task, Priority, TaskStatus } from '@/lib/types/database'

export async function getTasks() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw error
  return data as Task[]
}

export async function createTask(formData: {
  priority: Priority
  status?: TaskStatus
  client_name?: string
  notaire?: string
  due_date?: string
  notes?: string
  type?: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: userTeam } = await supabase
	.from('team_members')
	.select('team_id')
	.eq('user_id', user?.id)
	.single()
  if (!userTeam) throw new Error('User has no team');  

  // Get the max order_index to append new task at the end
  const { data: existingTasks } = await supabase
    .from('tasks')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)

  const maxOrderIndex = existingTasks?.[0]?.order_index ?? -1

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
	  team_id: userTeam.team_id,
      priority: formData.priority,
      status: formData.status || 'in_progress',
      client_name: formData.client_name,
      notaire: formData.notaire,
      due_date: formData.due_date,
      notes: formData.notes,
      type: formData.type,
      order_index: maxOrderIndex + 1,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/')
  return data as Task
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/')
  return data as Task
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
}

export async function reorderTasks(taskIds: string[]) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Update each task with its new order_index
  const updates = taskIds.map((id, index) => 
    supabase
      .from('tasks')
      .update({ order_index: index })
      .eq('id', id)
      .eq('user_id', user.id)
  )

  await Promise.all(updates)
  revalidatePath('/')
}
