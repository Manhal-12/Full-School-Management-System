const StatCard = ({ title, value, icon, gradient }) => {
  return (
    <div className={`rounded-2xl shadow-lg p-6 text-white transition-transform hover:scale-105 duration-300 ${gradient || 'bg-gradient-to-br from-slate-700 to-blue-900'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-white/30 text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
