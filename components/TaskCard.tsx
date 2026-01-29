'use client'

import { useState } from 'react'
import { updateTask, deleteTask } from '@/lib/actions/tasks'
import type { Task, Priority, TaskStatus } from '@/lib/types/database'

interface TaskCardProps {
  task: Task
  onTaskUpdated?: () => void
}

export default function TaskCard({ task, onTaskUpdated }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const [priority, setPriority] = useState(task.priority)
  const [status, setStatus] = useState(task.status)
  const [clientName, setClientName] = useState(task.client_name || '')
  const [notaire, setNotaire] = useState(task.notaire || '')
  const [type, setType] = useState(task.type || '')
  const [notes, setNotes] = useState(task.notes || '')
  const [isDragging, setIsDragging] = useState(false)

  const priorityColors = {
    urgent: 'border-l-4 border-red-500 bg-white',
    high: 'border-l-4 border-orange-500 bg-white',
    medium: 'border-l-4 border-blue-500 bg-white',
    low: 'border-l-4 border-gray-400 bg-white',
  }

  const priorityLabels = {
    urgent: 'Urgent',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
  }

  const priorityBadgeColors = {
    urgent: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-blue-100 text-blue-700 border-blue-200',
    low: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const statusLabels = {
    in_progress: 'En cours',
    done: 'Formalités postérieures',
  }

  const handleSave = async () => {
    try {
      await updateTask(task.id, {
        priority,
        status,
        client_name: clientName || undefined,
        notaire: notaire || undefined,
        type: type || undefined,
        notes: notes || undefined,
      })
      setIsEditing(false)
      if (onTaskUpdated) {
        onTaskUpdated()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async () => {
    if (confirm('Supprimer ce dossier ?')) {
      try {
        await deleteTask(task.id)
        if (onTaskUpdated) {
          onTaskUpdated()
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTask(task.id, { status: newStatus })
      setStatus(newStatus)
      setShowMoveMenu(false)
      if (onTaskUpdated) {
        onTaskUpdated()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.setData('currentStatus', task.status)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  if (isEditing) {
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">      
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nom du client"
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 focus:border-indigo-500 outline-none"
          />
          <input
            type="text"
            value={notaire}
            onChange={(e) => setNotaire(e.target.value)}
            placeholder="Notaire"
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 focus:border-indigo-500 outline-none"
          />
		</div>
		<div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mb-3 px-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 focus:border-indigo-500 outline-none"
          >
            <option value="">Sélectionner un type</option>
            <option value="Vente">Vente</option>
            <option value="Notoriété Acquisitive">Notoriété Acquisitive</option>
            <option value="Succession">Succession</option>
            <option value="Divorce">Divorce</option>
            <option value="Donation">Donation</option>
            <option value="Prêt">Prêt</option>
            <option value="Authentification de signature">Authentification de signature</option>
            <option value="Autre">Autre</option>
          </select>
		</div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes..."
          rows={3}
          className="w-full px-3 py-2.5 mb-3 border border-gray-300 rounded-lg text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
        />

        <div className="flex gap-2 mb-3">
          {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                priority === p
                  ? p === 'urgent'
                    ? 'bg-red-500 text-white'
                    : p === 'high'
                    ? 'bg-orange-500 text-white'
                    : p === 'medium'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {priorityLabels[p]}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            Sauvegarder
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition"
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition group ${priorityColors[task.priority]} ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-medium text-gray-900 mb-2 leading-snug`}>
            {task.type && task.client_name ? `[${task.type}] - ${task.client_name}` : ''}
          </h3>
          
          {(task.notaire) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {task.notaire && (
                <span className="text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded">
                  Notaire: {task.notaire}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded border ${priorityBadgeColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(task.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
        
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Éditer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 6 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Supprimer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {task.notes && (
        <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.notes}</p>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setShowMoveMenu(!showMoveMenu)}
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none flex items-center justify-between gap-2"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
            </svg>
            Déplacer vers...
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition ${showMoveMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showMoveMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMoveMenu(false)}
            />
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {status !== 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="w-full text-left px-3 py-2.5 text-sm text-gray-900 hover:bg-indigo-50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {statusLabels.in_progress}
                </button>
              )}
              {status !== 'done' && (
                <button
                  onClick={() => handleStatusChange('done')}
                  className="w-full text-left px-3 py-2.5 text-sm text-gray-900 hover:bg-green-50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {statusLabels.done}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
