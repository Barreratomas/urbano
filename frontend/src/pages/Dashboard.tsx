import { BookOpen, Calendar, ChevronRight, Layers, Users } from 'react-feather';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import Layout from '../components/layout';
import useI18n from '../context/I18nContext';
import useAuth from '../hooks/useAuth';
import courseService from '../services/CourseService';
import statsService from '../services/StatsService';

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
  const { t } = useI18n();
  const { data: stats, isLoading: isStatsLoading } = useQuery('stats', statsService.getStats);
  const { data: latestCourses, isLoading: isCoursesLoading } = useQuery('latest-courses', () =>
    courseService.findAll({
      limit: 5,
      sortBy: 'dateCreated',
      sortOrder: 'DESC',
    }),
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-semibold text-3xl">{t('dashboard')}</h1>
        <div className="bg-urbano-primary/5 px-4 py-2 rounded-full border border-urbano-primary/10">
          <p className="text-xs font-bold text-urbano-primary uppercase tracking-widest">
            {t('welcomeBack')}, {authenticatedUser.firstName}!
          </p>
        </div>
      </div>
      <hr className="mb-8" />

      <div className="space-y-10">
        {/* Stats Section */}
        <section>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
            {t('quickStats')}
          </p>
          {!isStatsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {authenticatedUser.role === 'admin' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800 leading-none">
                      {stats.numberOfUsers}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                      {t('totalUsers')}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 leading-none">
                    {stats.numberOfCourses}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                    {t('activeCourses')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                  <Layers size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 leading-none">
                    {stats.numberOfContents}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                    {t('lessonsCreated')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          )}
        </section>

        {/* Latest Courses Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              {t('latestCourses')}
            </p>
            <Link
              to="/courses"
              className="text-xs font-bold text-urbano-primary hover:underline flex items-center gap-1"
            >
              {t('viewAllCourses')} <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {!isCoursesLoading
              ? latestCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md hover:border-urbano-primary/20 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-urbano-primary/10 group-hover:text-urbano-primary transition-colors">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-urbano-primary transition-colors">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <Calendar size={12} />
                            {new Date(course.dateCreated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-gray-300 group-hover:text-urbano-primary group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                ))
              : [1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                ))}

            {!isCoursesLoading && latestCourses.length === 0 && (
              <div className="bg-gray-50 rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  {t('noCoursesFound')}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
