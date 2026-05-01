import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Calendar as CalendarIcon,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/tasks')
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)] bg-corn">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-rose/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-rose rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">Loading Dashboard...</p>
      </div>
    </div>
  );

  if (!stats) return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)]">
      <div className="text-center p-12 bg-white rounded-[3rem] border border-rose/10 shadow-xl">
        <AlertCircle size={48} className="text-rose mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground uppercase">Connection Error</h2>
        <p className="text-muted mt-2 font-bold uppercase tracking-widest text-xs">Failed to connect to the server.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-rose text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const chartData = [
    { name: 'Pending', value: stats.pendingTasks || 0, color: '#f59e0b' },
    { name: 'Active', value: stats.inProgressTasks || 0, color: '#A94A4A' },
    { name: 'Completed', value: stats.completedTasks || 0, color: '#10b981' },
    { name: 'Overdue', value: stats.overdueTasks || 0, color: '#ef4444' },
  ];

  const cards = [
    { title: 'Total Tasks', value: stats.totalTasks || 0, icon: ListTodo, color: 'text-rose', bg: 'bg-rose/10', trend: '+14%' },
    { title: 'Completed Tasks', value: stats.completedTasks || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+28%' },
    { title: 'In Progress', value: stats.inProgressTasks || 0, icon: Clock, color: 'text-rose', bg: 'bg-rose/10', trend: 'STABLE' },
    { title: 'Overdue Tasks', value: stats.overdueTasks || 0, icon: AlertCircle, color: 'text-rose', bg: 'bg-rose/10', trend: 'ALERT' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none">DASHBOARD</h1>
          <p className="text-muted mt-3 font-bold text-lg uppercase tracking-widest opacity-60">All systems normal</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-4 bg-white/80 backdrop-blur-md border border-rose/10 p-3 rounded-3xl premium-shadow"
        >
          <div className="px-5 py-3 rounded-2xl bg-rose text-white shadow-lg shadow-rose/20">
            <div className="flex items-center space-x-3">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Status</span>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white p-8 rounded-[2.5rem] border border-rose/10 premium-shadow relative overflow-hidden group cursor-default"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`${card.bg} ${card.color} p-4 rounded-2xl transition-all duration-500 group-hover:scale-110`}>
                <card.icon size={24} strokeWidth={2.5} />
              </div>
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border ${card.color === 'text-emerald-600' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose bg-rose/5 border-rose/10'} uppercase tracking-widest`}>
                {card.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-1">{card.title}</p>
            <h3 className="text-4xl font-black text-foreground tracking-tighter">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-10 rounded-[3rem] border border-rose/10 premium-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose/20">
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Task Statistics</h2>
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Real-time Overview</p>
                </div>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#4a2c2c" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="#4a2c2c" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(169,74,74,0.1)', borderRadius: '20px', padding: '16px' }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-10 rounded-[3rem] border border-rose/10 premium-shadow"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-foreground flex items-center uppercase tracking-tighter">
                <Clock className="mr-4 text-rose" size={24} strokeWidth={2.5} />
                Recent Tasks
              </h2>
              <button className="text-[10px] font-black text-rose hover:opacity-70 transition-all uppercase tracking-[0.2em] group">
                View All <ChevronRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-4">
              {recentTasks.map((task, idx) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-6 bg-cornsilk/30 rounded-[2rem] border border-rose/5 hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-5 min-w-0">
                    <div className={`w-3 h-3 rounded-full ${task.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose'} shadow-sm`} />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-foreground truncate uppercase tracking-widest">{task.title}</p>
                      <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mt-1.5">{task.project.title}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-rose/30 group-hover:text-rose group-hover:translate-x-1 transition-all" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="space-y-10">
          <motion.section 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-premium-grey p-10 rounded-[3rem] premium-shadow relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-rose/5 opacity-50 backdrop-blur-[2px]" />
            <div className="relative z-10">
              <h3 className="text-foreground text-3xl font-black tracking-tighter leading-tight mb-4 uppercase">Team Growth</h3>
              <p className="text-muted text-xs mb-8 font-bold uppercase tracking-widest leading-relaxed">Expand your team by inviting new members.</p>
              <button className="w-full bg-rose text-white font-black py-5 rounded-2xl shadow-xl shadow-rose/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px]">
                Invite Member
              </button>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-10 rounded-[3rem] border border-rose/10 premium-shadow relative overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full border-8 border-rose/10 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 border-8 border-rose rounded-full border-t-transparent -rotate-45" />
                <span className="text-6xl font-black text-foreground tracking-tighter">
                  {Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}
                </span>
                <span className="text-[10px] text-rose font-black uppercase tracking-[0.4em] mt-2">% DONE</span>
              </div>
            </div>
            <div className="w-full mt-12 space-y-4">
              <div className="flex justify-between items-center bg-cornsilk/30 p-5 rounded-2xl border border-rose/10">
                <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Efficiency</span>
                <span className="text-sm font-black text-rose">HIGH</span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
