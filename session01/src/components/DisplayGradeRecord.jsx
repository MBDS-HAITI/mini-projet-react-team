export default function DisplayGradeRecord({ gradeRecord }) {
  return (
    <div className="w-sm m-2 rounded-xl overflow-hidden md:max-w-md transform transition duration-500 hover:scale-105
                    border border-white/10 bg-white/5 backdrop-blur-xl hover:shadow-fuchsia-600 hover:shadow-lg shadow-2xl shadow-black/40">
      <div className="md:flex">
        <div className="w-full p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="uppercase tracking-wider text-sm font-bold text-white/70">
              Résultat d&apos;Examen
            </div>

            {/* Note */}
            <div className="text-3xl font-extrabold text-cyan-300 drop-shadow">
              {gradeRecord.grade}
            </div>
          </div>

          <h1 className="text-xl font-semibold text-white mb-1">
            {gradeRecord.student.lastName.toUpperCase()} {gradeRecord.student.firstName}
          </h1>

          <p className="text-sm text-white/50 mb-4">
            ID Étudiant : <span className="text-white/70">{gradeRecord.student._id}</span>
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-white/70">
              <span className="font-medium flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-fuchsia-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.468 9.58 4.215 7.6 4.215s-4.416 1.253-5.6 2.038M12 6.253c1.168-.785 2.42-2.038 4.4-2.038s4.416 1.253 5.6 2.038M12 6.253V20"
                  />
                </svg>
                Cours :
              </span>
              <span className="font-bold text-white">{gradeRecord.course.name}</span>
            </div>

            <div className="flex justify-between items-center text-white/70">
              <span className="font-medium flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-fuchsia-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-4 11H8m8 0h-4m-4 4h4m-4 0h4m-4-8h4m-4 0h4M4 19v-4h16v4a2 2 0 01-2 2H6a2 2 0 01-2-2zM4 9h16v2H4V9z"
                  />
                </svg>
                Date :
              </span>

              <span className="font-bold text-white">
                {new Date(gradeRecord.date).toLocaleString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between items-center text-white/70">
              <span className="font-medium flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-fuchsia-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20v-6a2 2 0 012-2h2a2 2 0 012 2v6m0 0a2 2 0 01-2 2h-2a2 2 0 01-2-2m0 0a2 2 0 002-2h2a2 2 0 002 2M14 10H8m4 4v4m0-4h4m0 0a2 2 0 100-4h-4a2 2 0 100 4z"
                  />
                </svg>
                ID Unique :
              </span>

              <span className="font-bold text-white/90 font-mono text-xs">
                {gradeRecord._id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
