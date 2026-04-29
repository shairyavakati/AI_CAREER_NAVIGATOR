import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginSignup } from './components/LoginSignup';
import { RoleSelection } from './components/RoleSelection';
import { TimeSelection } from './components/TimeSelection';
import { SkillAssessment } from './components/SkillAssessment';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { AdaptiveLearningPath } from './components/AdaptiveLearningPath';
import { StudyPlanner } from './components/StudyPlanner';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { MotivationSystem } from './components/MotivationSystem';
import { QuizInterface } from './components/QuizInterface';
import { RevisionSystemVisual } from './components/RevisionSystemVisual';
import { SkillEvolution } from './components/SkillEvolution';
import { ResourceRecommendation } from './components/ResourceRecommendation';
import { BarChart3, Trophy, Calendar, Home, BookOpen, TrendingUp, Library, Zap, Menu, X, LogOut } from 'lucide-react';
import { isLoggedIn, logout, getProfile } from './api';

type Screen =
  | 'landing'
  | 'login'
  | 'role'
  | 'time'
  | 'assessment'
  | 'gap-analysis'
  | 'learning-path'
  | 'planner'
  | 'dashboard'
  | 'motivation'
  | 'quiz'
  | 'revision-system'
  | 'skill-evolution'
  | 'resources';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [showNav, setShowNav] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    if (isLoggedIn()) {
      getProfile()
        .then((data) => {
          setUser(data.user);
          // If user has a role, go to planner; otherwise, go to role selection
          if (data.user.chosen_role) {
            setCurrentScreen('planner');
            setShowNav(true);
          } else {
            setCurrentScreen('role');
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    if (userData.chosen_role) {
      setCurrentScreen('planner');
      setShowNav(true);
    } else {
      setCurrentScreen('role');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowNav(false);
    setCurrentScreen('landing');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginSignup onLogin={handleLogin} />;
      case 'role':
        return <RoleSelection onRoleSelect={() => setCurrentScreen('time')} />;
      case 'time':
        return <TimeSelection onTimeSelect={() => setCurrentScreen('assessment')} />;
      case 'assessment':
        return <SkillAssessment onComplete={() => setCurrentScreen('gap-analysis')} />;
      case 'gap-analysis':
        return <SkillGapAnalysis onContinue={() => setCurrentScreen('learning-path')} />;
      case 'learning-path':
        return <AdaptiveLearningPath onStartLearning={() => { setCurrentScreen('planner'); setShowNav(true); }} />;
      case 'planner':
        return <StudyPlanner onContinue={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <AnalyticsDashboard onBack={() => setCurrentScreen('planner')} />;
      case 'motivation':
        return <MotivationSystem onBack={() => setCurrentScreen('planner')} />;
      case 'quiz':
        return <QuizInterface onComplete={() => setCurrentScreen('planner')} />;
      case 'revision-system':
        return <RevisionSystemVisual />;
      case 'skill-evolution':
        return <SkillEvolution />;
      case 'resources':
        return <ResourceRecommendation />;
      default:
        return <LandingPage onGetStarted={() => setCurrentScreen('login')} />;
    }
  };

  const navItems = [
    { id: 'planner', icon: Home, label: 'Planner' },
    { id: 'learning-path', icon: Calendar, label: 'Path' },
    { id: 'dashboard', icon: BarChart3, label: 'Analytics' },
    { id: 'motivation', icon: Trophy, label: 'Achievements' },
    { id: 'quiz', icon: Zap, label: 'Quiz' },
    { id: 'revision-system', icon: BookOpen, label: 'Revision' },
    { id: 'skill-evolution', icon: TrendingUp, label: 'Evolution' },
    { id: 'resources', icon: Library, label: 'Resources' }
  ];

  return (
    <div className="size-full relative">
      {/* User greeting bar */}
      {showNav && user && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 backdrop-blur-[20px] border-b border-white/20"
          style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>
                  {(user.name || user.email || '?')[0].toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                {user.name || user.email}
              </span>
              {user.streak_count > 0 && (
                <span className="px-2 py-0.5 rounded-full" style={{ background: '#EF444420', fontSize: '12px', fontWeight: 600, color: '#EF4444' }}>
                  🔥 {user.streak_count}
                </span>
              )}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] transition-all duration-200 hover:bg-red-50"
              style={{ color: '#6B7280', fontSize: '13px', fontWeight: 500 }}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      <div style={{ paddingTop: showNav && user ? '52px' : '0' }}>
        {renderScreen()}
      </div>

      {/* Desktop Navigation - Glassmorphic Bottom Bar */}
      {showNav && (
        <>
          <div
            className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 rounded-[20px] px-6 py-4 backdrop-blur-[30px] border border-white/40 shadow-[0_8px_32px_rgba(79,70,229,0.15)]"
            style={{ background: 'rgba(255, 255, 255, 0.85)', zIndex: 50 }}
          >
            <div className="flex items-center gap-2">
              {navItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`px-5 py-3 rounded-[14px] transition-all duration-200 flex items-center gap-2 ${
                    currentScreen === item.id ? 'shadow-[0_4px_16px_rgba(79,70,229,0.25)]' : ''
                  }`}
                  style={{
                    background: currentScreen === item.id ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'transparent',
                    color: currentScreen === item.id ? 'white' : '#6B7280'
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Navigation - Desktop */}
          <div
            className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 rounded-[20px] p-4 backdrop-blur-[30px] border border-white/40 shadow-[0_8px_32px_rgba(79,70,229,0.15)]"
            style={{ background: 'rgba(255, 255, 255, 0.85)', zIndex: 50 }}
          >
            <div className="flex flex-col gap-2">
              {navItems.slice(4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`p-3 rounded-[12px] transition-all duration-200 flex items-center justify-center ${
                    currentScreen === item.id ? 'shadow-[0_4px_16px_rgba(79,70,229,0.25)]' : ''
                  }`}
                  style={{
                    background: currentScreen === item.id ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'transparent',
                    color: currentScreen === item.id ? 'white' : '#6B7280'
                  }}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(79,70,229,0.25)] z-50"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' }}
          >
            {showMobileMenu ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <>
              <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowMobileMenu(false)} />
              <div className="lg:hidden fixed bottom-24 right-8 left-8 rounded-[20px] p-6 backdrop-blur-[30px] border border-white/40 shadow-[0_8px_32px_rgba(79,70,229,0.15)] z-50" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item) => (
                    <button key={item.id}
                      onClick={() => { setCurrentScreen(item.id as Screen); setShowMobileMenu(false); }}
                      className={`p-4 rounded-[14px] transition-all duration-200 flex flex-col items-center gap-2 ${currentScreen === item.id ? 'shadow-[0_4px_16px_rgba(79,70,229,0.25)]' : ''}`}
                      style={{ background: currentScreen === item.id ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'rgba(107,114,128,0.05)', color: currentScreen === item.id ? 'white' : '#6B7280' }}>
                      <item.icon className="w-6 h-6" />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
