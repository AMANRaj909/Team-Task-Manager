import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight,
  MoreVertical,
  Flag,
  Activity,
  Cpu,
  ListTodo,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedToId: '',
    deadline: '',
    status: 'PENDING'
  });
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/projects/users/all')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Creating task...');
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', projectId: '', assignedToId: '', deadline: '', status: 'PENDING' });
      fetchData();
      toast.success('Task created', { id: loadId });
    } catch (error) {
      toast.error('Failed to create task', { id: loadId });
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchData();
      toast.success(`Progress updated: ${status}`);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchData();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'COMPLETED': return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Completed' };
      case 'IN_PROGRESS': return { color: 'text-rose', bg: 'bg-rose/5', icon: Clock, label: 'In Progress' };
      default: return { color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertCircle, label: 'Pending' };
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.project?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)]">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-rose/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-rose rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">Loading Tasks...</p>
      </div>
    </div>
  );

  if (!tasks) return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)]">
      <div className="text-center p-12 bg-white rounded-[3rem] border border-rose/10 shadow-xl">
        <AlertCircle size={48} className="text-rose mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground uppercase">Tasks Unavailable</h2>
        <p className="text-muted mt-2 font-bold uppercase tracking-widest text-xs">Failed to connect to the task database.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-rose text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
        >
          Retry Loading
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none uppercase">Tasks</h1>
          <p className="text-muted mt-3 font-bold text-lg uppercase tracking-widest opacity-60">Manage your team's tasks</p>
        </div>
        
        {user.role === 'ADMIN' && (
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-3 bg-rose text-white px-10 py-5 rounded-[2rem] shadow-2xl shadow-rose/20 font-black uppercase tracking-[0.2em] text-xs transition-all"
          >
            <Plus size={20} strokeWidth={3} />
            <span>New Task</span>
          </motion.button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-rose/10">
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-rose transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-white/50 border border-rose/10 rounded-[1.5rem] py-4.5 pl-16 pr-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose/40 transition-all uppercase tracking-[0.3em] placeholder:text-muted/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-3 px-6 py-4 bg-white/50 text-muted hover:text-rose rounded-2xl border border-rose/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            <Filter size={14} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, idx) => {
            const config = getStatusConfig(task.status);
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: idx * 0.05, type: "spring" }}
                className="bg-white p-8 rounded-[3rem] border border-rose/10 shadow-xl shadow-rose/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-rose/40 transition-all relative overflow-hidden"
              >
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center space-x-5 mb-5">
                    <div className={`${config.bg} ${config.color} p-3 rounded-2xl border border-rose/10 shadow-sm group-hover:scale-110 transition-all duration-500`}>
                      <config.icon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-2xl font-black text-foreground truncate group-hover:text-rose transition-colors tracking-tighter uppercase leading-none">{task.title}</h3>
                      <div className="flex items-center mt-2.5">
                        <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em] ${config.bg} ${config.color} border border-rose/5`}>
                          {config.label}
                        </span>
                        <span className="mx-3 text-rose/10">/</span>
                        <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] flex items-center group-hover:text-rose transition-colors">
                          <Activity size={12} className="mr-2 text-rose" />
                          {task.project.title}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted text-sm mb-8 leading-relaxed line-clamp-2 max-w-3xl font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{task.description || 'No description available.'}</p>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center text-[9px] font-black text-muted uppercase tracking-[0.3em] bg-rose/[0.02] px-4 py-2 rounded-xl border border-rose/10 group-hover:border-rose/20 transition-colors">
                      <User size={14} className="mr-3 text-rose/50" />
                      ASSIGNED: <span className="text-foreground ml-2">{task.assignedTo?.name || 'UNASSIGNED'}</span>
                    </div>
                    {task.deadline && (
                      <div className="flex items-center text-[9px] font-black text-muted uppercase tracking-[0.3em] bg-rose/[0.02] px-4 py-2 rounded-xl border border-rose/10 group-hover:border-rose/20 transition-colors">
                        <Calendar size={14} className="mr-3 text-rose/50" />
                        DUE: <span className="text-foreground ml-2">{new Date(task.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="flex items-center text-[9px] font-black text-muted uppercase tracking-[0.3em] bg-rose/[0.02] px-4 py-2 rounded-xl border border-rose/10 group-hover:border-rose/20 transition-colors">
                      <Cpu size={14} className="mr-3 text-rose/50" />
                      PRIORITY: <span className="text-rose ml-2">NORMAL</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-5 shrink-0 relative z-10 bg-cornsilk/30 p-6 rounded-[2.5rem] border border-rose/10">
                  <div className="relative">
                    <select
                      className="bg-white border border-rose/10 rounded-xl px-5 py-4 text-[10px] font-black text-foreground focus:outline-none focus:ring-2 focus:ring-rose/30 cursor-pointer hover:bg-white/50 transition-all appearance-none pr-12 min-w-[160px] uppercase tracking-[0.2em]"
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-rose/30 pointer-events-none" />
                  </div>
                  
                  {user.role === 'ADMIN' && (
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-4 text-muted hover:text-rose hover:bg-rose/5 rounded-2xl transition-all"
                    >
                      <Trash2 size={22} strokeWidth={2.5} />
                    </motion.button>
                  )}
                  <button className="p-4 text-muted hover:text-rose transition-all">
                    <MoreVertical size={24} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 bg-white/50 rounded-[4rem] border-4 border-dashed border-rose/10"
          >
            <div className="w-24 h-24 bg-rose/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-rose/10">
              <ListTodo size={48} />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tighter">No Tasks Found</h3>
            <p className="text-muted font-bold uppercase tracking-widest text-xs opacity-60">Try adjusting your search or create a new task.</p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white rounded-[4rem] p-12 max-w-xl w-full shadow-2xl relative z-10 overflow-hidden border border-rose/10"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose to-transparent" />
              
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Create Task</h2>
                  <p className="text-muted mt-2 text-xs font-bold uppercase tracking-widest opacity-60">Add a new task to your project.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-4 hover:bg-rose/5 rounded-[1.5rem] transition-all group">
                  <X size={28} className="text-muted group-hover:text-rose group-hover:rotate-90 transition-all duration-500" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Task Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design Landing Page"
                    className="w-full bg-rose/[0.03] border border-rose/10 rounded-[1.5rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all uppercase tracking-[0.3em] placeholder:text-muted/20"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Project</label>
                    <div className="relative">
                      <select
                        required
                        className="w-full bg-rose/[0.03] border border-rose/10 rounded-[1.5rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all appearance-none cursor-pointer uppercase tracking-[0.2em]"
                        value={newTask.projectId}
                        onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                      >
                        <option value="">Select Project...</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-rose/30 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Assign Member</label>
                    <div className="relative">
                      <select
                        className="w-full bg-rose/[0.03] border border-rose/10 rounded-[1.5rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all appearance-none cursor-pointer uppercase tracking-[0.2em]"
                        value={newTask.assignedToId}
                        onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                      >
                        <option value="">Choose member...</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-rose/30 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full bg-rose/[0.03] border border-rose/10 rounded-[1.5rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Description</label>
                  <textarea
                    placeholder="Enter task details..."
                    className="w-full bg-rose/[0.03] border border-rose/10 rounded-[2rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all resize-none h-32 uppercase tracking-[0.3em] placeholder:text-muted/20"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="flex space-x-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white hover:bg-rose/5 text-muted font-black py-6 rounded-2xl transition-all uppercase tracking-[0.3em] text-[10px] border border-rose/10 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-rose text-white font-black py-6 rounded-2xl shadow-xl shadow-rose/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px]"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
