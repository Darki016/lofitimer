import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, StickyNote, X, Plus, Check, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ProductivityHub = ({ isOpen, onClose }) => {
    const { todos, setTodos, notes, setNotes } = useStore();
    const [activeTab, setActiveTab] = useState('todo');
    const [newTodo, setNewTodo] = useState('');

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    const tabs = [
        { id: 'todo', icon: ListTodo, label: 'Tasks' },
        { id: 'notes', icon: StickyNote, label: 'Notes' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-96 bg-black/80 backdrop-blur-2xl border-r border-white/10 z-50 p-6 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-mono font-bold tracking-tighter">Station Hub</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-white/5 rounded-xl mb-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition text-xs font-medium ${activeTab === tab.id ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white'
                                        }`}
                                    title={tab.label}
                                >
                                    <tab.icon size={16} />
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                            {activeTab === 'todo' && (
                                <div className="space-y-4">
                                    <form onSubmit={addTodo} className="relative">
                                        <input
                                            type="text"
                                            placeholder="Add a task..."
                                            value={newTodo}
                                            onChange={(e) => setNewTodo(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30 transition placeholder:text-white/30 text-sm"
                                        />
                                        <button type="submit" className="absolute right-2 top-2 p-1 bg-white text-black rounded-lg hover:bg-white/90 transition">
                                            <Plus size={20} />
                                        </button>
                                    </form>

                                    <div className="space-y-2">
                                        <AnimatePresence mode='popLayout'>
                                            {todos.length === 0 && <p className="text-center text-white/30 mt-10 text-sm">No tasks yet. Stay focused.</p>}
                                            {todos.map(todo => (
                                                <motion.div
                                                    key={todo.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className={`group flex items-center gap-3 p-3 rounded-xl transition border ${todo.completed ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'}`}
                                                >
                                                    <button
                                                        onClick={() => toggleTodo(todo.id)}
                                                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${todo.completed ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white'}`}
                                                    >
                                                        {todo.completed && <Check size={12} className="text-black" />}
                                                    </button>
                                                    <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-white/40' : 'text-white/90'}`}>
                                                        {todo.text}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteTodo(todo.id)}
                                                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Capture your thoughts..."
                                    className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-white/80 placeholder:text-white/20"
                                />
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductivityHub;
