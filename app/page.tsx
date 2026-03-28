'use client';

import React from 'react';
import { Navbar, Hero, LicenseCard, Footer, LicenseData, LoginModal, AdminForm, RecentLicenses } from '@/components/AppComponents';
import { supabase } from '@/lib/supabase';

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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [currentView, setCurrentView] = React.useState('home');

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setLicenseData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentView('home'); // Switch to home to show search result

    try {
      const { data, error: supabaseError } = await supabase
        .from('licencas')
        .select('*')
        .or(`processo_no.ilike.%${query}%,licenca_no.ilike.%${query}%`)
        .single();

      if (supabaseError) {
        console.warn('Supabase error, falling back to mock data:', supabaseError.message);
        if (query.includes('123')) {
          setLicenseData(MOCK_DATA);
        } else {
          setError('Nenhuma licença encontrada para este número.');
          setLicenseData(null);
        }
      } else {
        setLicenseData(data as LicenseData);
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
    setError(null);
    setCurrentView('home');
  };

  const handleSelectLicense = (license: LicenseData) => {
    setLicenseData(license);
    setCurrentView('home');
    // Scroll to top to show the card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (view: string) => {
    if (view === 'home') {
      setLicenseData(null);
      setError(null);
    }
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      
      <main className="flex-grow">
        {user ? (
          <AdminForm onSaveSuccess={() => {}} />
        ) : (
          <>
            {currentView === 'home' ? (
              <>
                <Hero onSearch={handleSearch} />
                <LicenseCard data={licenseData} loading={loading} error={error} />
              </>
            ) : (
              <RecentLicenses onSelect={handleSelectLicense} />
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
