'use client'

import { useState } from 'react'
import { createTask } from '@/lib/actions/tasks'
import type { Priority } from '@/lib/types/database'
import Modal from './Modal'

interface FiltersProps {
  priorities: string[]
  clients: string[]
  notaires: string[]
  types: string[]
  selectedPriority: string
  selectedClient: string
  selectedNotaire: string
  selectedType: string
  searchQuery: string
  onPriorityChange: (priority: string) => void
  onClientChange: (client: string) => void
  onNotaireChange: (notaire: string) => void
  onTypeChange: (type: string) => void
  onSearchChange: (query: string) => void
  onReset: () => void
  onTaskAdded?: () => void
}

export default function Filters({
  priorities,
  clients,
  notaires,
  types,
  selectedPriority,
  selectedClient,
  selectedNotaire,
  selectedType,
  searchQuery,
  onPriorityChange,
  onClientChange,
  onNotaireChange,
  onTypeChange,
  onSearchChange,
  onReset,
  onTaskAdded,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [priority, setPriority] = useState<Priority>('medium')
  const [clientName, setClientName] = useState('')
  const [notaire, setNotaire] = useState('')
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      await createTask({
        priority,
        client_name: clientName || undefined,
        notaire: notaire || undefined,
        notes: notes || undefined,
        type: type || undefined,
      })
      
      // Reset form
      setClientName('')
      setNotaire('')
	  setType('')
      setNotes('')
      setPriority('medium')
      setIsOpen(false)
      
      // Reload tasks
      if (onTaskAdded) {
        onTaskAdded()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setLoading(false)
    }
  }
  const hasActiveFilters = selectedPriority !== 'all' || selectedClient !== 'all' || selectedNotaire !== 'all' || selectedType !== 'all' || searchQuery !== ''

  const priorityLabels: Record<string, string> = {
    all: 'Toutes les priorités',
    urgent: 'Urgent',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
  }

  const priorityColors: Record<string, string> = {
    urgent: 'border-red-500',
    high: 'border-orange-500',
    medium: 'border-blue-500',
    low: 'border-gray-400',
  }

  return (
    <>
      <div className="h-full">
        <div className="flex items-center mb-3">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau dossier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-xs font-medium text-gray-900 mb-1.5">
            Rechercher
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Chercher des dossiers..."
              className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

		{/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-xs font-medium text-gray-900 mb-1.5">
            Type
          </label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
          >
            <option value="all">Tous les types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

		{/* Client Filter */}
        <div>
          <label htmlFor="client" className="block text-xs font-medium text-gray-900 mb-1.5">
            Client
          </label>
          <select
            id="client"
            value={selectedClient}
            onChange={(e) => onClientChange(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
          >
            <option value="all">Tous les clients</option>
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priority" className="block text-xs font-medium text-gray-900 mb-1.5">
            Priorité
          </label>
          <select
            id="priority"
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
          >
            <option value="all">{priorityLabels.all}</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabels[priority] || priority}
              </option>
            ))}
          </select>
        </div>

        {/* Notaire Filter */}
        <div>
          <label htmlFor="notaire" className="block text-xs font-medium text-gray-900 mb-1.5">
            Notaire
          </label>
          <select
            id="notaire"
            value={selectedNotaire}
            onChange={(e) => onNotaireChange(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
          >
            <option value="all">Tous les notaires</option>
            {notaires.map((notaire) => (
              <option key={notaire} value={notaire}>
                {notaire}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          {selectedPriority !== 'all' && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border-l-2 ${priorityColors[selectedPriority]} rounded text-xs font-medium text-gray-900`}>
              {priorityLabels[selectedPriority]}
              <button
                onClick={() => onPriorityChange('all')}
                className="hover:text-gray-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {selectedClient !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-900">
              Client: {selectedClient}
              <button
                onClick={() => onClientChange('all')}
                className="hover:text-gray-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {selectedNotaire !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-900">
              Notaire: {selectedNotaire}
              <button
                onClick={() => onNotaireChange('all')}
                className="hover:text-gray-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-900">
              Recherche: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="hover:text-gray-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer un dossier">
        <form onSubmit={handleSubmit} className="space-y-4">
			<div>
	  		<label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-2">
              Type
            </label>
			<select
				id="type"
				value={type}
				onChange={(e) => setType(e.target.value)}
				className="w-full px-3 py-2.5 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
			>
				<option value="">Sélectionner un type</option>
				{types.map((t) => (
					<option key={t} value={t}>
						{t}
					</option>
				))}
			</select>
			</div>
		  <div>

		  </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-900 mb-2">
                Client
              </label>
              <input
                id="client"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nom du client"
                className="w-full px-3 py-2.5 text-base text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="notaire" className="block text-sm font-medium text-gray-900 mb-2">
                Notaire
              </label>
              <input
                id="notaire"
                type="text"
                value={notaire}
                onChange={(e) => setNotaire(e.target.value)}
                placeholder="Nom du notaire"
                className="w-full px-3 py-2.5 text-base text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Priorité</label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
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
                  {p === 'urgent' ? 'Urgent' : p === 'high' ? 'Haute' : p === 'medium' ? 'Moyenne' : 'Basse'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes ou commentaires..."
              rows={4}
              className="w-full px-3 py-2.5 text-base text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
