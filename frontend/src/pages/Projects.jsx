import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Users, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Briefcase,
  MoreHorizontal,
  Calendar,
  ChevronRight,
  Shield,
  Layers,
  X,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [memberUserId, setMemberUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/projects/users/all')
      ]);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Creating project...');
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ title: '', description: '' });
      fetchData();
      toast.success('Project created', { id: loadId });
    } catch (error) {
      toast.error('Failed to create project', { id: loadId });
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberUserId) return toast.error('Please select a user');
    const loadId = toast.loading('Adding member...');
    try {
      await api.post(`/projects/${selectedProjectId}/members`, { userId: memberUserId });
      setShowMemberModal(false);
      setMemberUserId('');
      fetchData();
      toast.success('Member added', { id: loadId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member', { id: loadId });
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchData();
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)]">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-rose/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-rose rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-muted font-black text-xs uppercase tracking-[0.3em] animate-pulse">Loading Projects...</p>
      </div>
    </div>
  );

  if (!projects) return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)]">
      <div className="text-center p-12 bg-white rounded-[3rem] border border-rose/10 shadow-xl">
        <AlertCircle size={48} className="text-rose mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground uppercase">Projects Unavailable</h2>
        <p className="text-muted mt-2 font-bold uppercase tracking-widest text-xs">Failed to connect to the project database.</p>
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
          <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none uppercase">Projects</h1>
          <p className="text-muted mt-3 font-bold text-lg uppercase tracking-widest opacity-60">Manage your team's projects</p>
        </div>
        
        {user.role === 'ADMIN' && (
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-3 bg-rose text-white px-10 py-5 rounded-[2rem] shadow-2xl shadow-rose/20 font-black uppercase tracking-[0.2em] text-xs transition-all"
          >
            <Plus size={20} strokeWidth={3} />
            <span>New Project</span>
          </motion.button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-rose/10">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-rose transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full bg-white/50 border border-rose/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose/40 transition-all uppercase tracking-[0.2em] placeholder:text-muted/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-4 bg-white text-muted hover:text-rose rounded-2xl border border-rose/10 shadow-sm transition-all"><Filter size={18} /></button>
          <div className="h-10 w-px bg-rose/10 mx-2" />
          <button className="p-4 bg-rose text-white rounded-2xl shadow-lg shadow-rose/20"><LayoutGrid size={18} /></button>
          <button className="p-4 text-muted hover:text-rose transition-all"><List size={18} /></button>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1, type: "spring" }}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] border border-rose/10 shadow-xl shadow-rose/5 group relative flex flex-col h-full cursor-default overflow-hidden"
            >
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-16 h-16 bg-rose/5 rounded-3xl flex items-center justify-center text-rose group-hover:scale-110 transition-all duration-500 border border-rose/10 shadow-sm">
                  <Layers size={32} strokeWidth={2.5} />
                </div>
                <div className="flex items-center space-x-2">
                  {user.role === 'ADMIN' && (
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="p-3 text-muted hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                        className="p-3 text-muted hover:text-rose hover:bg-rose/5 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <button className="p-3 text-muted hover:text-rose rounded-xl">
                    <MoreHorizontal size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 relative z-10">
                <h3 className="text-3xl font-black text-foreground mb-4 group-hover:text-rose transition-colors tracking-tighter leading-none uppercase">{project.title}</h3>
                <p className="text-muted text-sm mb-10 line-clamp-3 font-bold uppercase tracking-widest leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{project.description || 'No supplementary data available.'}</p>
              </div>
              
              <div className="space-y-8 pt-8 border-t border-rose/10 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-4">
                    {[...Array(Math.min(project._count.members, 4))].map((_, i) => (
                      <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-rose flex items-center justify-center text-xs font-black text-white shadow-md">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    {project._count.members > 4 && (
                      <div className="w-12 h-12 rounded-2xl border-4 border-white bg-cornsilk-dark flex items-center justify-center text-[10px] font-black text-muted shadow-md">
                        +{project._count.members - 4}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-1.5">Total Tasks</p>
                    <div className="inline-flex items-center text-[10px] font-black text-rose bg-rose/5 px-4 py-2 rounded-xl border border-rose/10">
                      <Shield size={12} className="mr-2" />
                      {project._count.tasks} TASKS
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-black text-muted uppercase tracking-[0.4em]">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-rose/50" />
                    Due in 12 days
                  </div>
                  <div className="flex items-center group/btn text-rose hover:opacity-70 transition-all cursor-pointer">
                    View Details <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>

                {user.role === 'ADMIN' && (
                  <button 
                    onClick={() => { setSelectedProjectId(project.id); setShowMemberModal(true); }}
                    className="w-full mt-6 flex items-center justify-center space-x-2 py-3 rounded-2xl bg-rose/5 border border-rose/10 text-[10px] font-black text-rose uppercase tracking-[0.2em] hover:bg-rose hover:text-white transition-all duration-300"
                  >
                    <Users size={14} />
                    <span>Add Member</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

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
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">New Project</h2>
                  <p className="text-muted mt-2 text-xs font-bold uppercase tracking-widest opacity-60">Create a new workspace for your team.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-4 hover:bg-rose/5 rounded-[1.5rem] transition-all group">
                  <X size={28} className="text-muted group-hover:text-rose group-hover:rotate-90 transition-all duration-500" />
                </button>
              </div>
              
              <form onSubmit={handleCreateProject} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Website Redesign"
                    className="w-full bg-rose/[0.03] border border-rose/10 rounded-[1.5rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all uppercase tracking-[0.3em] placeholder:text-muted/20"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Description</label>
                  <textarea
                    placeholder="Enter project details..."
                    className="w-full bg-rose/[0.03] border border-rose/10 rounded-[2rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all resize-none h-40 uppercase tracking-[0.3em] placeholder:text-muted/20"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Modal */}
      <AnimatePresence>
        {showMemberModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMemberModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white rounded-[4rem] p-12 max-w-xl w-full shadow-2xl relative z-10 overflow-hidden border border-rose/10"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Add Member</h2>
                  <p className="text-muted mt-2 text-xs font-bold uppercase tracking-widest opacity-60">Invite a new member to this project.</p>
                </div>
                <button onClick={() => setShowMemberModal(false)} className="p-4 hover:bg-rose/5 rounded-[1.5rem] transition-all group">
                  <X size={28} className="text-muted group-hover:text-rose group-hover:rotate-90 transition-all duration-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddMember} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2">Select User</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full bg-rose/[0.03] border border-rose/10 rounded-[1.5rem] px-8 py-6 text-[10px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-rose/10 focus:border-rose/40 transition-all appearance-none cursor-pointer uppercase tracking-[0.2em]"
                      value={memberUserId}
                      onChange={(e) => setMemberUserId(e.target.value)}
                    >
                      <option value="">Choose a member...</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-rose/30 pointer-events-none" />
                  </div>
                </div>

                <div className="flex space-x-6">
                  <button
                    type="button"
                    onClick={() => setShowMemberModal(false)}
                    className="flex-1 bg-white hover:bg-rose/5 text-muted font-black py-6 rounded-2xl transition-all uppercase tracking-[0.3em] text-[10px] border border-rose/10 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-rose text-white font-black py-6 rounded-2xl shadow-xl shadow-rose/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px]"
                  >
                    Add Member
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

export default Projects;
