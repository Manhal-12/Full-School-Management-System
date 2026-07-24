import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-white">School Administration</span>
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  & Student Management
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                A comprehensive platform for managing students, teachers,
                courses, classes, and enrollments — designed for modern
                educational institutions.
              </p>

              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 px-8 py-3.5 rounded-xl font-bold text-lg shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105"
                  >
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 px-8 py-3.5 rounded-xl font-bold text-lg shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105"
                    >
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
                {
                  icon: "👩‍🎓",
                  title: "Student Management",
                  desc: "Complete student records with guardian & class info",
                  color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
                },
                {
                  icon: "👨‍🏫",
                  title: "Teacher Management",
                  desc: "Faculty profiles with specialization tracking",
                  color:
                    "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
                },
                {
                  icon: "📚",
                  title: "Course Management",
                  desc: "Course catalog with credits and assignments",
                  color:
                    "from-purple-500/20 to-violet-500/20 border-purple-500/30",
                },
                {
                  icon: "📊",
                  title: "Real-time Dashboard",
                  desc: "Statistics and visual analytics at a glance",
                  color:
                    "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-r ${item.color} backdrop-blur-sm border rounded-xl p-4 hover:scale-105 transition-transform`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        {item.title}
                      </h3>
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
          <svg
            className="absolute bottom-0 w-full h-16 text-gray-50"
            viewBox="0 0 1440 48"
            fill="currentColor"
          >
            <path d="M0 48h1440V0c-129.333 9.333-416 28-720 28S129.333 9.333 0 0v48z" />
          </svg>
        </div>
      </section>
      <footer className="bg-gradient-to-b from-slate-800 to-slate-950 text-white mt-20">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-yellow-400 font-semibold tracking-widest uppercase">
              School Administration
            </p>

            <h2 className="text-5xl font-bold mt-3">Our System</h2>

            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              A modern school administration and student management system
              designed to simplify academic management, improve communication,
              and enhance learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 duration-300">
              <h3 className="font-bold text-xl mb-3 text-yellow-400">
                Mission
              </h3>

              <p className="text-gray-300 text-sm">
                Deliver efficient and secure school management solutions.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 duration-300">
              <h3 className="font-bold text-xl mb-3 text-yellow-400">Vision</h3>

              <p className="text-gray-300 text-sm">
                Build a smarter digital education environment.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 duration-300">
              <h3 className="font-bold text-xl mb-3 text-yellow-400">
                Students
              </h3>

              <p className="text-gray-300 text-sm">
                Manage student information, enrollment and attendance.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 duration-300">
              <h3 className="font-bold text-xl mb-3 text-yellow-400">
                Teachers
              </h3>

              <p className="text-gray-300 text-sm">
                Organize teacher records and course assignments.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 duration-300">
              <h3 className="font-bold text-xl mb-3 text-yellow-400">
                Courses
              </h3>

              <p className="text-gray-300 text-sm">
                Create and manage courses, grades and academic records.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}

        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
            <h3 className="font-bold text-lg">
              School Administration & Student Management System
            </h3>

            <p className="text-gray-400 mt-4 md:mt-0">
              © 2026 School Administration & Student Management System. All
              Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
