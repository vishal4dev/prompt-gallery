import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Star, TrendingUp, Search, Filter, Copy, Heart, Edit, Trash2, Check, Calendar, Hash, X, Save, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { listPrompts, createPrompt, updatePrompt as apiUpdatePrompt, deletePrompt as apiDeletePrompt, markPromptUsed } from '../api';

// Card Component
const ModernCard = ({ children, className = '', onClick, interactive = false }) => {
  return (
    <motion.div
      className={`
        relative p-6 rounded-3xl transition-all duration-300
        bg-white/70 dark:bg-slate-800/70
        backdrop-blur-xl
        border border-slate-200/80 dark:border-slate-700/60
        shadow-lg shadow-black/5
        ${interactive ? 'transform hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10' : ''}
        ${className}
      `}
      onClick={onClick}
      whileTap={interactive ? { scale: 0.98 } : {}}
      layout
    >
      {children}
    </motion.div>
  );
};

// Theme Toggle 
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('prompt-gallery-theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('prompt-gallery-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
};

// Search Bar 
const SearchBar = ({ searchTerm, onSearchChange, onFilterToggle, showFilters }) => {
  return (
    <ModernCard className="mb-8 p-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search prompts, categories, or tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 border-none bg-slate-100 dark:bg-slate-700 rounded-xl h-12 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
        <button
          onClick={onFilterToggle}
          className={`w-12 h-12 rounded-xl transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center ${
            showFilters
              ? 'bg-slate-200 dark:bg-slate-700'
              : 'bg-transparent'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </ModernCard>
  );
};

// Filter Component
const FilterPanel = ({ 
  show, 
  selectedCategory, 
  onCategoryChange, 
  showFavoritesOnly, 
  onFavoritesToggle,
  availableTags,
  selectedTags,
  onTagToggle,
  onClearFilters 
}) => {
  const CATEGORIES = ['Writing', 'Coding', 'Marketing', 'Study', 'Design', 'Business', 'Personal', 'Other'];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <ModernCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Filters</h3>
                <button
                  onClick={onClearFilters}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Clear All
                </button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`cursor-pointer transition-all duration-200 rounded-lg px-3 py-1 text-sm ${
                      selectedCategory === 'all' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                    }`}
                    onClick={() => onCategoryChange('all')}
                  >
                    All
                  </span>
                  {CATEGORIES.map((category) => (
                    <span
                      key={category}
                      className={`cursor-pointer transition-all duration-200 rounded-lg px-3 py-1 text-sm ${
                        selectedCategory === category 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                      onClick={() => onCategoryChange(category)}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span
                  className={`cursor-pointer transition-all duration-200 rounded-lg px-3 py-1 text-sm ${
                    showFavoritesOnly 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                  onClick={onFavoritesToggle}
                >
                  ⭐ Favorites Only
                </span>
              </div>

              {availableTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <span
                        key={tag}
                        className={`cursor-pointer transition-all duration-200 rounded-lg px-3 py-1 text-sm ${
                          selectedTags.includes(tag) 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                        onClick={() => onTagToggle(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ModernCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Prompt Card Component
const PromptCard = ({ prompt, onCopy, onToggleFavorite, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const categoryColors = {
    Writing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    Coding: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300', 
    Marketing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    Study: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    Design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    Business: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    Personal: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    Other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
  };

  const handleCopy = async () => {
    await onCopy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <ModernCard className="h-full flex flex-col" interactive>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg flex-1 pr-2">{prompt.title}</h3>
            <span className={`rounded-md px-2 py-1 text-xs ${categoryColors[prompt.category]}`}>
              {prompt.category}
            </span>
          </div>
          
          {prompt.isFavorite && (
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs font-medium">Favorite</span>
            </div>
          )}

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {prompt.content}
          </p>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded flex items-center"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">
                  +{prompt.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {prompt.lastUsed && (
            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mb-4">
              <Calendar className="w-3 h-3 mr-1.5" />
              Last used {formatDate(prompt.lastUsed)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(prompt.id)}
              className={`w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center ${
                prompt.isFavorite ? 'text-yellow-500' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => onEdit(prompt)}
              className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(prompt.id)}
              className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {prompt.useCount > 0 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Used {prompt.useCount} times
              </span>
            )}
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center
                ${copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-800'
                }`}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </ModernCard>
    </motion.div>
  );
};

// Prompt Form Component
const PromptForm = ({ prompt, onSave, onCancel, isOpen }) => {
  const CATEGORIES = ['Writing', 'Coding', 'Marketing', 'Study', 'Design', 'Business', 'Personal', 'Other'];

  //creating custom categories would be good extension
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    tags: [],
    isFavorite: false
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || '',
        content: prompt.content || '',
        category: prompt.category || 'Other',
        tags: prompt.tags || [],
        isFavorite: prompt.isFavorite || false
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'Other',
        tags: [],
        isFavorite: false
      });
    }
  }, [prompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    onSave({
      ...formData,
      ...(prompt ? { id: prompt.id } : {}),
      lastUsed: new Date().toISOString(),
      useCount: prompt?.useCount || 0
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <ModernCard className="relative max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {prompt ? 'Edit Prompt' : 'Add New Prompt'}
                </h2>
                <button
                  onClick={onCancel}
                  className="w-10 h-10 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-slate-700 dark:text-slate-300 font-medium block">
                    Title
                  </label>
                  <input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., 'Creative Blog Post Idea Generator'"
                    className="w-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded-lg h-12 px-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-slate-700 dark:text-slate-300 font-medium block">
                    Prompt Content
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your AI prompt here. Use [variables] for reusable parts."
                    className="w-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[120px] p-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-none outline-none"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-700 dark:text-slate-300 font-medium block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded-lg h-12 px-4 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-700 dark:text-slate-300 font-medium block">
                      Add Tags
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type & press Enter"
                        className="flex-1 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded-lg h-12 px-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="w-12 h-12 p-0 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-slate-700 dark:text-slate-300 font-medium block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 pr-1 rounded-md px-2 py-1 text-sm flex items-center"
                        >
                          <Hash className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 h-auto p-0.5 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 !mt-8">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-slate-200 dark:border-slate-600 flex items-center ${
                      formData.isFavorite
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
                        : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Star className={`w-4 h-4 mr-2 ${formData.isFavorite ? 'fill-current' : ''}`} />
                    {formData.isFavorite ? 'Favorite' : 'Add to Favorites'}
                  </button>
                </div>
              </form>

              <div className="flex justify-end gap-3 pt-6 mt-auto border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {prompt ? 'Update Prompt' : 'Save Prompt'}
                </button>
              </div>

            </ModernCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Prompt Gallery Compo
export default function PromptGallery() {
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  // Load prompts from API on mount
  useEffect(() => {
    let isMounted = true;
    listPrompts()
      .then((data) => {
        if (!isMounted) return;
        setPrompts(data);
        setFilteredPrompts(data);
      })
      .catch((err) => {
        console.error('Failed to load prompts:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Filter prompts based on current filters
  useEffect(() => {
    let filtered = prompts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        prompt.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(prompt =>
        selectedTags.every(tag => prompt.tags?.includes(tag))
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(prompt => prompt.isFavorite);
    }

    setFilteredPrompts(filtered);
  }, [prompts, searchTerm, selectedCategory, selectedTags, showFavoritesOnly]);

  const handleSavePrompt = (promptData) => {
    if (editingPrompt) {
      apiUpdatePrompt(editingPrompt.id, { ...promptData })
        .then((updated) => {
          setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? updated : p));
          setShowForm(false);
          setEditingPrompt(null);
        })
        .catch((err) => console.error('Failed to update prompt:', err));
    } else {
      createPrompt({ ...promptData })
        .then((created) => {
          setPrompts(prev => [created, ...prev]);
          setShowForm(false);
          setEditingPrompt(null);
        })
        .catch((err) => console.error('Failed to create prompt:', err));
    }
  };

  const handleCopyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      const updated = await markPromptUsed(prompt.id);
      setPrompts(prev => prev.map(p => p.id === prompt.id ? updated : p));
    } catch (err) {
      console.error('Failed to copy or update usage:', err);
    }
  };

  const handleToggleFavorite = (promptId) => {
    const target = prompts.find(p => p.id === promptId);
    if (!target) return;
    const nextValue = !target.isFavorite;
    apiUpdatePrompt(promptId, { isFavorite: nextValue })
      .then((updated) => {
        setPrompts(prev => prev.map(p => p.id === promptId ? updated : p));
      })
      .catch((err) => console.error('Failed to toggle favorite:', err));
  };

  const handleEditPrompt = (prompt) => {
    setEditingPrompt(prompt);
    setShowForm(true);
  };

  const handleDeletePrompt = (promptId) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;
    apiDeletePrompt(promptId)
      .then(() => {
        setPrompts(prev => prev.filter(p => p.id !== promptId));
      })
      .catch((err) => console.error('Failed to delete prompt:', err));
  };

  const handleAddNew = () => {
    setEditingPrompt(null);
    setShowForm(true);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
    setShowFavoritesOnly(false);
    setSearchTerm('');
  };

  const toggleTagFilter = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Get all unique tags from prompts
  const availableTags = [...new Set(prompts.flatMap(p => p.tags || []))];

  // Get favorite prompts for quick access
  const favoritePrompts = prompts.filter(p => p.isFavorite).slice(0, 3);

  // Get frequently used prompts
  const frequentPrompts = [...prompts]
    .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 p-4 md:p-8">
      <div className="fixed top-0 left-0 -z-10 h-full w-full bg-white dark:bg-slate-900">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Prompt Gallery
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Your personal collection of AI prompts, organized and ready.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleAddNew}
              className="px-5 py-3 rounded-xl bg-slate-800 dark:bg-slate-100 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-800 font-semibold transition-all duration-200 shadow-lg shadow-black/10 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Prompt
            </button>
          </div>
        </motion.div>

        {/* Quick Access Cards */}
        {(favoritePrompts.length > 0 || frequentPrompts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            {favoritePrompts.length > 0 && (
              <ModernCard>
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Quick Favorites</h3>
                </div>
                <div className="space-y-2">
                  {favoritePrompts.map(prompt => (
                    <div
                      key={prompt.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/70 dark:hover:bg-slate-700/80 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{prompt.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{prompt.content}</p>
                      </div>
                      <button
                        onClick={() => handleCopyPrompt(prompt)}
                        className="ml-3 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </ModernCard>
            )}

            {frequentPrompts.length > 0 && (
              <ModernCard>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Most Used</h3>
                </div>
                <div className="space-y-2">
                  {frequentPrompts.map(prompt => (
                    <div
                      key={prompt.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/70 dark:hover:bg-slate-700/80 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{prompt.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Used {prompt.useCount} times</p>
                      </div>
                      <button
                        onClick={() => handleCopyPrompt(prompt)}
                        className="ml-3 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </ModernCard>
            )}
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterToggle={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />

          <FilterPanel
            show={showFilters}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTagFilter}
            onClearFilters={clearFilters}
          />
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-slate-600 dark:text-slate-400">
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
          </p>
          {(searchTerm || selectedCategory !== 'all' || selectedTags.length > 0 || showFavoritesOnly) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-500 hover:text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Clear all filters
            </button>
          )}
        </motion.div>

        {/* Prompts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.05 }
                }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PromptCard
                  prompt={prompt}
                  onCopy={handleCopyPrompt}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEditPrompt}
                  onDelete={handleDeletePrompt}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ModernCard className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {prompts.length === 0 ? 'No prompts yet' : 'No prompts match your filters'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {prompts.length === 0 
                  ? 'Start building your prompt collection by adding your first one.'
                  : 'Try adjusting your search terms or filters.'
                }
              </p>
              <button
                onClick={prompts.length === 0 ? handleAddNew : clearFilters}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                {prompts.length === 0 ? 'Add Your First Prompt' : 'Clear Filters'}
              </button>
            </ModernCard>
          </motion.div>
        )}

        {/* Prompt Form Modal */}
        <PromptForm
          prompt={editingPrompt}
          onSave={handleSavePrompt}
          onCancel={() => {
            setShowForm(false);
            setEditingPrompt(null);
          }}
          isOpen={showForm}
        />
      </div>
    </div>
  );
}