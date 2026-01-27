'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getTasks } from '@/lib/actions/tasks'
import TaskCard from '@/components/TaskCard'
import Filters from '@/components/Filters'
import type { Task } from '@/lib/types/database'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragOverTodo, setIsDragOverTodo] = useState(false)
  const [isDragOverInProgress, setIsDragOverInProgress] = useState(false)
  const [isDragOverDone, setIsDragOverDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase.auth])

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Priority filter
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false
    }

    // Client filter
    if (selectedClient !== 'all' && task.client_name !== selectedClient) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = task.title.toLowerCase().includes(query)
      const matchesClient = task.client_name?.toLowerCase().includes(query)
      const matchesFileNumber = task.file_number?.toLowerCase().includes(query)
      
      if (!matchesTitle && !matchesClient && !matchesFileNumber) {
        return false
      }
    }

    return true
  })

  // Group filtered tasks by status
  const todoTasks = filteredTasks.filter(t => t.status === 'todo')
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress')
  const doneTasks = filteredTasks.filter(t => t.status === 'done')

  // Extract unique priorities and clients for filters
  const uniquePriorities = Array.from(new Set(tasks.map(t => t.priority)))
  const uniqueClients = Array.from(
    new Set(tasks.map(t => t.client_name).filter(Boolean))
  ) as string[]

  const handleResetFilters = () => {
    setSelectedPriority('all')
    setSelectedClient('all')
    setSearchQuery('')
  }

  const handleDrop = async (e: React.DragEvent, newStatus: 'todo' | 'in_progress' | 'done') => {
    e.preventDefault()
    setIsDragOverTodo(false)
    setIsDragOverInProgress(false)
    setIsDragOverDone(false)
    
    const taskId = e.dataTransfer.getData('taskId')
    const currentStatus = e.dataTransfer.getData('currentStatus')
    
    if (currentStatus !== newStatus) {
      try {
        const { updateTask } = await import('@/lib/actions/tasks')
        await updateTask(taskId, { status: newStatus })
        await loadTasks()
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (status: 'todo' | 'in_progress' | 'done') => {
    if (status === 'todo') setIsDragOverTodo(true)
    if (status === 'in_progress') setIsDragOverInProgress(true)
    if (status === 'done') setIsDragOverDone(true)
  }

  const handleDragLeave = (e: React.DragEvent, status: 'todo' | 'in_progress' | 'done') => {
    // Vérifier si on quitte vraiment la zone (pas juste un enfant)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      if (status === 'todo') setIsDragOverTodo(false)
      if (status === 'in_progress') setIsDragOverInProgress(false)
      if (status === 'done') setIsDragOverDone(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NotaList</h1>
            <p className="text-sm text-gray-600 mt-1">Gestion de tâches</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-end gap-3 bg-white p-4 rounded-lg border border-gray-200">
          <Filters
            priorities={uniquePriorities}
            clients={uniqueClients}
            selectedPriority={selectedPriority}
            selectedClient={selectedClient}
            searchQuery={searchQuery}
            onPriorityChange={setSelectedPriority}
            onClientChange={setSelectedClient}
            onSearchChange={setSearchQuery}
            onReset={handleResetFilters}
            onTaskAdded={loadTasks}
          />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Todo Column */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">À faire</h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{todoTasks.length}</span>
            </div>
            <div 
              className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-lg transition ${
                isDragOverTodo ? 'bg-gray-100 border-2 border-dashed border-gray-400' : ''
              }`}
              onDrop={(e) => handleDrop(e, 'todo')}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter('todo')}
              onDragLeave={(e) => handleDragLeave(e, 'todo')}
            >
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} onTaskUpdated={loadTasks} />
              ))}
              {todoTasks.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">Aucune tâche</div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">En cours</h2>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{inProgressTasks.length}</span>
            </div>
            <div 
              className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-lg transition ${
                isDragOverInProgress ? 'bg-indigo-50 border-2 border-dashed border-indigo-400' : ''
              }`}
              onDrop={(e) => handleDrop(e, 'in_progress')}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter('in_progress')}
              onDragLeave={(e) => handleDragLeave(e, 'in_progress')}
            >
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} onTaskUpdated={loadTasks} />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">Aucune tâche</div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Terminées</h2>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{doneTasks.length}</span>
            </div>
            <div 
              className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-lg transition ${
                isDragOverDone ? 'bg-green-50 border-2 border-dashed border-green-400' : ''
              }`}
              onDrop={(e) => handleDrop(e, 'done')}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter('done')}
              onDragLeave={(e) => handleDragLeave(e, 'done')}
            >
              {doneTasks.map(task => (
                <TaskCard key={task.id} task={task} onTaskUpdated={loadTasks} />
              ))}
              {doneTasks.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">Aucune tâche</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
