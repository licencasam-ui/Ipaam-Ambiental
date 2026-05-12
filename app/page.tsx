'use client';

import React from 'react';
import { Navbar, Hero, LicenseCard, Footer, LicenseData, LoginModal, AdminForm, RecentLicenses, SearchResults, TransparencyView, UserManagement, UserProfile } from '@/components/AppComponents';
import { supabase, getTableName } from '@/lib/supabase';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const MOCK_DATA: LicenseData = {
  tipo_licenca: "Licença de Operação (LO)",
  data_recebimento: "15 de Março de 2024",
  processo_no: "2024.000123/IPAAM",
  licenca_no: "LO 458/2024",
  validade: "15/03/2026 (24 meses)",
  interessado: "AMAZON ECO-LOGISTICS LTDA",
  municipio: "Manaus / AM",
  finalidade: "Operação de centro de distribuição logística sustentável com sistemas de captação de água da chuva e energia solar fotovoltaica, em área urbana consolidada.",
  endereco_atividade: "Av. Danilo de Matos Areosa, 1530, Distrito Industrial I, Manaus-AM, CEP 69075-351",
  endereco_correspondencia: "Rua Maceió, 450, Edif. Amazon Tower, Sala 12, Adrianópolis, Manaus-AM",
  solicitacao_renovacao: "10/01/2024",
  responsavel_tecnico: "Eng. Maria Silva (CREA 12345/D)",
  responsavel_analise: "Dr. Roberto Santos (Analista IPAAM)",
  status: "Ativa",
  publicada: true
};

export default function Home() {
  const [licenseData, setLicenseData] = React.useState<LicenseData | null>(null);
  const [searchResults, setSearchResults] = React.useState<LicenseData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = React.useState('home');
  const [history, setHistory] = React.useState<any[]>([]);
  const [searchField, setSearchField] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const fetchProfile = async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const ADMIN_EMAIL = 'licencas.am@gmail.com';
      const isOwner = email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      
      if (error) {
        // If profile doesn't exist, create a default one
        const { data: allProfiles } = await supabase.from('profiles').select('id').limit(1);
        const isFirstUser = !allProfiles || allProfiles.length === 0;
        
        const newProfile = {
          id: userId,
          email: email || '',
          role: (isFirstUser || isOwner) ? 'Administrator' : 'User'
        };

        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
        
        if (!createError) setProfile(created as UserProfile);
        else if (isOwner) setProfile(newProfile as UserProfile); // Force admin state for owner even if insert fails
      } else {
        // If profile exists but it is the owner and role is not Admin, fix it
        if (isOwner && data.role !== 'Administrator') {
          setProfile({ ...data, role: 'Administrator' } as UserProfile); // Set state immediately
          await supabase
            .from('profiles')
            .update({ role: 'Administrator' })
            .eq('id', userId);
        } else {
          setProfile(data as UserProfile);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const pushHistory = () => {
    setHistory(prev => [...prev, {
      view: currentView,
      searchResults: [...searchResults],
      licenseData: licenseData ? {...licenseData} : null,
      searchField: searchField,
      searchQuery: searchQuery,
      error: error
    }]);
  };

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id, session.user.email);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id, currentUser.email);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = async (query: string, filterField?: string) => {
    if (!query.trim() && !filterField) {
      setLicenseData(null);
      setSearchResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    pushHistory();
    setLicenseData(null);
    setSearchResults([]);
    setSearchField(filterField || null);
    setSearchQuery(query);
    setCurrentView('home');

    try {
      let tableName = 'all_licencas';
      
      // Se estivermos filtrando por tipo_licenca, podemos ir direto na tabela específica
      if (filterField === 'tipo_licenca') {
        tableName = getTableName(query);
      }
      
      let supabaseQuery = supabase.from(tableName).select('*');

      if (filterField) {
        // If a specific field is provided, filter only by that field
        supabaseQuery = supabaseQuery.ilike(filterField, `%${query}%`);
      } else {
        // Global search across all relevant fields
        const searchFields = [
          'tipo_licenca',
          'processo_no',
          'licenca_no',
          'interessado',
          'endereco_correspondencia',
          'endereco_atividade',
          'municipio',
          'finalidade',
          'condicionantes',
          'solicitacao_renovacao',
          'data_recebimento',
          'validade',
          'responsavel_tecnico',
          'responsavel_analise'
        ];
        
        // Escape special characters for Supabase .or() syntax by wrapping in double quotes
        // and escaping existing double quotes
        const escapedQuery = query.replace(/"/g, '\\"');
        const orQuery = searchFields.map(field => `${field}.ilike."%${escapedQuery}%"`).join(',');
        supabaseQuery = supabaseQuery.or(orQuery);
      }

      const { data, error: supabaseError } = await supabaseQuery;

      if (supabaseError) {
        console.warn('Supabase error, falling back to mock data:', supabaseError.message);
        if (query.includes('123')) {
          setLicenseData(MOCK_DATA);
        } else {
          setError('Ocorreu um erro ao buscar as licenças.');
        }
      } else if (data && data.length > 0) {
        if (data.length === 1) {
          setLicenseData(data[0] as LicenseData);
        } else {
          setSearchResults(data as LicenseData[]);
        }
      } else {
        setError('Nenhuma licença encontrada para esta pesquisa. Tente usar termos diferentes ou verifique se a licença já foi cadastrada.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Ocorreu um erro ao processar sua busca.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLicenseData(null);
    setSearchResults([]);
    setError(null);
    setCurrentView('home');
    setHistory([]);
  };

  const handleSelectLicense = (license: LicenseData) => {
    pushHistory();
    setLicenseData(license);
    setSearchResults([]);
    setCurrentView('home');
    // Scroll to top to show the card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (view: string) => {
    if (view === currentView && !licenseData && searchResults.length === 0 && !error) return;
    pushHistory();
    if (view === 'home') {
      setLicenseData(null);
      setSearchResults([]);
      setError(null);
    }
    setCurrentView(view);
  };

  const handleBack = () => {
    if (history.length === 0) {
      setLicenseData(null);
      setSearchResults([]);
      setSearchField(null);
      setError(null);
      setCurrentView('home');
      return;
    }

    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    setCurrentView(lastState.view);
    setSearchResults(lastState.searchResults || []);
    setSearchField(lastState.searchField || null);
    setSearchQuery(lastState.searchQuery || '');
    setLicenseData(lastState.licenseData || null);
    setError(lastState.error || null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        user={user} 
        profile={profile}
        onLogout={handleLogout} 
        currentView={currentView}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
      />
      
      <main className="flex-grow">
        {user ? (
          currentView === 'users' ? (
            profile?.role === 'Administrator' ? (
              <UserManagement />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                <div className="w-20 h-20 rounded-full bg-error-container flex items-center justify-center text-error mb-6">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-on-surface mb-2">Acesso Restrito</h2>
                <p className="text-on-surface-variant max-w-md">Você não possui permissões de administrador para acessar o gerenciamento de usuários.</p>
                <button 
                  onClick={() => setCurrentView('home')}
                  className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar para o Início
                </button>
              </div>
            )
          ) : profile?.role === 'Administrator' ? (
            <AdminForm onSaveSuccess={() => {}} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-on-surface mb-2">Área do Usuário</h2>
              <p className="text-on-surface-variant max-w-md">Bem-vindo, {profile?.email || 'Usuário'}. No momento, seu perfil permite apenas a visualização de dados públicos. Contate o administrador se precisar registrar novas licenças.</p>
              <button 
                onClick={() => setCurrentView('home')}
                className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Ir para o Portal de Consulta
              </button>
            </div>
          )
        ) : (
          <>
            {currentView === 'home' ? (
              <>
                <Hero onSearch={handleSearch} />
                {searchResults.length > 0 ? (
                  <SearchResults 
                    results={searchResults} 
                    onSelect={handleSelectLicense} 
                    onBack={handleBack} 
                    filterField={searchField}
                    query={searchQuery}
                  />
                ) : (
                  <LicenseCard 
                    data={licenseData} 
                    loading={loading} 
                    error={error} 
                    onBack={licenseData || error || history.length > 0 ? handleBack : undefined} 
                  />
                )}
              </>
            ) : currentView === 'licenses' ? (
              <RecentLicenses 
                onSelect={handleSelectLicense} 
                onBack={handleBack} 
              />
            ) : (
              <TransparencyView 
                onSearch={handleSearch} 
                onBack={handleBack} 
              />
            )}
          </>
        )}
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={(u) => setUser(u)} 
      />
      
      <Footer />
    </div>
  );
}
