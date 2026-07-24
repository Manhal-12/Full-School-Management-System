import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[url('https://app.zaro.ai/api/console/workspaces/oss/read?workspace_id=ef72bfe9-523e-4d66-aa86-de79c0a9019b&object_id=public-img-7dc68780-cc34-4543-9b95-a3308c68f715')] bg-cover bg-center opacity-25"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-blue-900/70 to-slate-900/90"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 text-amber-300 text-sm font-semibold px-5 py-2 rounded-full">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span>CA232 — Full-Stack Group Project 2026</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-white">School Administration</span>
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">& Student Management</span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                A comprehensive platform for managing students, teachers, courses, 
                classes, and enrollments — designed for modern educational institutions.
              </p>

              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 px-8 py-3.5 rounded-xl font-bold text-lg shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105">
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 px-8 py-3.5 rounded-xl font-bold text-lg shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105">
                      Login Now →
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-amber-400">50+</p>
                  <p className="text-sm text-gray-400">Students</p>
                </div>
                <div className="border-l border-gray-700 pl-8">
                  <p className="text-3xl font-bold text-amber-400">10+</p>
                  <p className="text-sm text-gray-400">Teachers</p>
                </div>
                <div className="border-l border-gray-700 pl-8">
                  <p className="text-3xl font-bold text-amber-400">20+</p>
                  <p className="text-sm text-gray-400">Courses</p>
                </div>
              </div>
            </div>

            {/* Right side - Feature highlights */}
            <div className="hidden lg:grid gap-4">
              {[
                { icon: '👩‍🎓', title: 'Student Management', desc: 'Complete student records with guardian & class info', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
                { icon: '👨‍🏫', title: 'Teacher Management', desc: 'Faculty profiles with specialization tracking', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' },
                { icon: '📚', title: 'Course Management', desc: 'Course catalog with credits and assignments', color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30' },
                { icon: '📊', title: 'Real-time Dashboard', desc: 'Statistics and visual analytics at a glance', color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30' },
              ].map((item, idx) => (
                <div key={idx} className={`bg-gradient-to-r ${item.color} backdrop-blur-sm border rounded-xl p-4 hover:scale-105 transition-transform`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full h-16 text-gray-50" viewBox="0 0 1440 48" fill="currentColor"><path d="M0 48h1440V0c-129.333 9.333-416 28-720 28S129.333 9.333 0 0v48z"/></svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Everything You Need to Run Your School
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Our platform provides all the tools necessary for efficient school administration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Student Records', desc: 'Track complete student profiles, grades, guardian info, and academic progress in one place', icon: '👩‍🎓', gradient: 'from-blue-500 to-cyan-500' },
              { title: 'Faculty Management', desc: 'Manage teacher profiles, specializations, hire dates, and class assignments seamlessly', icon: '👨‍🏫', gradient: 'from-emerald-500 to-teal-500' },
              { title: 'Course Catalog', desc: 'Create and organize courses with detailed descriptions, credit hours, and grade levels', icon: '📚', gradient: 'from-purple-500 to-violet-500' },
              { title: 'Class Organization', desc: 'Organize classes by grade and section with capacity management and room assignments', icon: '🏫', gradient: 'from-orange-500 to-red-500' },
              { title: 'Enrollment System', desc: 'Handle student course enrollments with real-time status tracking and grade recording', icon: '📋', gradient: 'from-pink-500 to-rose-500' },
              { title: 'Analytics Dashboard', desc: 'View comprehensive statistics with beautiful charts for data-driven school decisions', icon: '📊', gradient: 'from-amber-500 to-yellow-500' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group border border-gray-100">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-slate-800 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Group 10</span>
          <h2 className="text-3xl font-bold mt-2 mb-8">Our Team</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {['Farhan Osman Alin (Leader)', 'Yusro Mohamed Ahmed', 'Aisho Muse Mohamud', 'Farah Mohamed', 'Abdirahman Muse Ibrahim'].map((name, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 hover:bg-white/15 transition-all">
                <p className="text-white font-medium">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© {new Date().getFullYear()} School Administration & Student Management System — Group 10</p>
          <p className="text-xs text-gray-600 mt-1">CA232 — Spring Semester 2025–2026 | Spring Boot + ReactJS</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
