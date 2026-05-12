'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Search, LogIn, Printer, FileDown, ShieldCheck, X, Save, Plus, LogOut, Loader2, ArrowLeft, Eye, Users, UserPlus, Trash2, Key, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, getTableName } from '@/lib/supabase';
import html2canvas from 'html2canvas';

export interface UserProfile {
  id: string;
  email: string;
  role: 'Administrator' | 'User';
  created_at?: string;
}
import { jsPDF } from 'jspdf';

export const Navbar = ({ 
  onLoginClick, 
  user, 
  profile,
  onLogout, 
  currentView, 
  onViewChange,
  onSearch
}: { 
  onLoginClick: () => void; 
  user: any; 
  profile?: UserProfile | null;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onSearch: (query: string, field?: string) => void;
}) => {
  const [navQuery, setNavQuery] = useState('');

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navQuery.trim()) {
      onSearch(navQuery);
      setNavQuery('');
    }
  };

  return (
    <nav className="w-full top-0 sticky z-50 bg-background/80 backdrop-blur-md flex justify-between items-center px-8 py-4 max-w-full mx-auto border-b border-outline-variant/10 print:hidden">
      <div className="flex items-center gap-8">
        <span 
          className="text-2xl font-black text-primary font-headline tracking-tight cursor-pointer" 
          onClick={() => onViewChange('home')}
        >
          IPAAM Licenças Ambientais
        </span>
        <div className="hidden md:flex gap-6 items-center">
          <button 
            onClick={() => onViewChange('home')}
            className={`font-headline font-semibold tracking-tight transition-colors pb-1 ${currentView === 'home' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Início
          </button>
          <button 
            onClick={() => onViewChange('licenses')}
            className={`font-headline font-semibold tracking-tight transition-colors px-2 py-0.5 rounded-sm ${currentView === 'licenses' ? 'text-primary border-2 border-primary/50' : 'text-on-surface-variant hover:text-primary border-2 border-transparent'}`}
          >
            Licenças
          </button>
          <button 
            onClick={() => onViewChange('transparency')}
            className={`font-headline font-semibold tracking-tight transition-colors pb-1 ${currentView === 'transparency' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Transparência
          </button>
          <a className="font-headline font-semibold tracking-tight text-on-surface-variant hover:text-primary transition-colors" href="#">Contato</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <form onSubmit={handleNavSearch} className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input 
            className="pl-10 pr-4 py-2 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-secondary w-64 text-sm outline-none" 
            placeholder="Buscar licença..." 
            type="text"
            value={navQuery}
            onChange={(e) => setNavQuery(e.target.value)}
          />
        </form>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">{profile?.role || 'Usuário'}</span>
              <span className="text-[9px] text-outline truncate max-w-[120px] leading-none">{user.email}</span>
            </div>
            {profile?.role === 'Administrator' && (
              <button 
                onClick={() => onViewChange('users')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${currentView === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-high text-on-surface hover:bg-primary/10 hover:text-primary'}`}
                title="Gerenciar Usuários"
              >
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold hidden xl:inline">Usuários</span>
              </button>
            )}
            <button 
              onClick={onLogout}
              className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-semibold text-sm hover:bg-error-container hover:text-on-error-container transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-primary text-white px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-80 transition-all duration-200 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login Institucional
          </button>
        )}
      </div>
    </nav>
  );
};

export const Hero = ({ onSearch }: { onSearch: (query: string, field?: string) => void }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <section className="relative py-24 px-8 overflow-hidden bg-surface-container-low print:hidden min-h-[500px] flex items-center">
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent z-10" />
        <Image 
          className="w-full h-full object-cover" 
          alt="Aerial view of Amazon rainforest" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0z9ACjewnBU1h3KHD07Vrye1KQtFQNIEn1-jRYNH06vNTZNm7UxHv0AQUPcET8G-idFUPwermpqNx5inc1Lh11ZFg8ZZCbWU1WNaE_KSckE5I2LJkceBdYn0f5kXXEZZ0oAjo6NXLcBef3wG2N-bBTyAApbyn4XjagXe_xXiw54tak1sl0sSWOw4or8Fu6Krf3eQac1-4fd3btp5oYYJEXsPkdf1ZDTpL1VIwF3jr6Pw82M1U9k7tPLBtmTNb5R0AX_9WCEncNx0"
          fill
          priority
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="max-w-6xl mx-auto relative z-20 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-headline text-6xl font-extrabold text-on-surface mb-6 leading-tight max-w-2xl"
        >
          Portal de Consulta <br />
          <span className="text-primary">Licenças Ambientais</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-on-surface-variant text-xl max-w-xl mb-12 font-medium leading-relaxed"
        >
          Consulte licenças, processos e autorizações ambientais do Estado do Amazonas com transparência e agilidade.
        </motion.p>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest p-2 rounded-full shadow-2xl flex items-center max-w-3xl ring-1 ring-outline-variant/10"
        >
          <div className="flex-grow flex items-center px-6">
            <Search className="text-outline w-5 h-5 mr-3" />
            <input 
              className="w-full border-none focus:ring-0 bg-transparent text-on-surface placeholder:text-outline/60 font-medium outline-none text-lg" 
              placeholder="Pesquisar por número, interessado, endereço, responsável..." 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/20"
          >
            <span>Pesquisar</span>
            <Search className="w-4 h-4" />
          </button>
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-outline uppercase tracking-widest"
        >
          <span>Busca por:</span>
          <button onClick={() => onSearch('', 'processo_no')} className="text-primary/60 hover:text-primary transition-colors">Processo</button>
          <button onClick={() => onSearch('', 'licenca_no')} className="text-primary/60 hover:text-primary transition-colors">Licença</button>
          <button onClick={() => onSearch('', 'interessado')} className="text-primary/60 hover:text-primary transition-colors">Interessado</button>
          <button onClick={() => onSearch('', 'endereco_atividade')} className="text-primary/60 hover:text-primary transition-colors">Endereço</button>
          <button onClick={() => onSearch('', 'municipio')} className="text-primary/60 hover:text-primary transition-colors">Município</button>
          <button onClick={() => onSearch('', 'responsavel_tecnico')} className="text-primary/60 hover:text-primary transition-colors">Responsável Técnico</button>
          <button onClick={() => onSearch('', 'finalidade')} className="text-primary/60 hover:text-primary transition-colors">Finalidade</button>
        </motion.div>
      </div>
    </section>
  );
};

export interface LicenseData {
  tipo_licenca: string;
  data_recebimento: string;
  processo_no: string;
  licenca_no: string;
  validade: string;
  interessado: string;
  municipio: string;
  finalidade: string;
  endereco_atividade: string;
  endereco_correspondencia: string;
  solicitacao_renovacao: string;
  responsavel_tecnico: string;
  responsavel_analise: string;
  status: string;
  condicionantes?: string;
  pdf_url?: string;
  publicada: boolean;
}

export const RecentLicenses = ({ onSelect, onBack }: { onSelect: (license: LicenseData) => void; onBack: () => void }) => {
  const [licenses, setLicenses] = useState<LicenseData[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data, error } = await supabase
          .from('all_licencas')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setLicenses(data || []);
      } catch (err) {
        console.error('Error fetching recent licenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-12 px-8 max-w-6xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">Licenças Recentes</h2>
          <p className="text-on-surface-variant">Últimas licenças e autorizações emitidas pelo IPAAM.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
          {licenses.length} Registros
        </div>
      </div>

      <div className="grid gap-4">
        {licenses.map((license, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={idx}
            onClick={() => onSelect(license)}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-lg">{license.licenca_no}</h3>
                <p className="text-sm text-on-surface-variant font-medium">{license.interessado}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
              {license.pdf_url && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary" title="Documento PDF disponível">
                  <Eye className="w-4 h-4" />
                </div>
              )}
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Processo</p>
                <p className="text-sm font-semibold text-on-surface">{license.processo_no}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Validade</p>
                <p className="text-sm font-semibold text-on-surface">{license.validade.split(' ')[0]}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${license.status === 'Ativa' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {license.status}
              </div>
            </div>
          </motion.div>
        ))}

        {licenses.length === 0 && (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/20">
            <p className="text-on-surface-variant font-medium">Nenhuma licença encontrada no sistema.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export const SearchResults = ({ results, onSelect, onBack, filterField, query }: { results: LicenseData[]; onSelect: (license: LicenseData) => void; onBack: () => void; filterField?: string | null; query?: string }) => {
  return (
    <section className="py-12 px-8 max-w-6xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">Resultados da Busca</h2>
            {filterField && (
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  {filterField === 'tipo_licenca' ? 'Categoria' : 'Campo'}: {query || 'Todos'}
                </span>
              </div>
            )}
          </div>
          <p className="text-on-surface-variant">Encontramos {results.length} registro(s) correspondente(s) à sua pesquisa.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {results.map((license, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={idx}
            onClick={() => onSelect(license)}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-lg">{license.licenca_no}</h3>
                <p className="text-sm text-on-surface-variant font-medium">{license.interessado}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
              {license.pdf_url && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary" title="Documento PDF disponível">
                  <Eye className="w-4 h-4" />
                </div>
              )}
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Processo</p>
                <p className="text-sm font-semibold text-on-surface">{license.processo_no}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Validade</p>
                <p className="text-sm font-semibold text-on-surface">{license.validade.split(' ')[0]}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${license.status === 'Ativa' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {license.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const LicenseCard = ({ data, loading, error, onBack }: { data: LicenseData | null; loading: boolean; error: string | null; onBack?: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    if (!cardRef.current) return;
    
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const content = cardRef.current.innerHTML;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.outerHTML)
      .join('');
      
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.write(`
        <html>
          <head>
            <title>Imprimir Licença</title>
            ${styles}
            <style>
              @page { size: auto; margin: 0mm; }
              body { background: white !important; margin: 0; padding: 20px; }
              .print\\:hidden { display: none !important; }
            </style>
          </head>
          <body>
            <div class="bg-surface-container-lowest">
              ${content}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => {
                    window.parent.document.body.removeChild(window.frameElement);
                  }, 100);
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
    }
  };

  const handleSavePDF = async () => {
    if (!cardRef.current || !data) return;
    
    setIsGenerating(true);
    try {
      // Wait a bit for any animations to settle
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight,
        onclone: (clonedDoc) => {
          // html2canvas 1.4.1 has a limited CSS parser that fails on modern features like oklch/oklab
          // We must clean up the CSS in the cloned document to avoid SyntaxErrors like "unexpected EOF"
          const cleanCSS = (css: string) => {
            if (!css) return css;
            return css
              // Replace modern color functions with safe fallbacks
              .replace(/oklch\s*\([^)]*\)/gi, 'rgb(0,0,0)')
              .replace(/oklab\s*\([^)]*\)/gi, 'rgb(0,0,0)')
              .replace(/color-mix\s*\([^)]*\)/gi, 'inherit')
              .replace(/light-dark\s*\([^)]*\)/gi, 'inherit')
              // Remove container queries which are known to break html2canvas parser
              .replace(/@container[^{]+\{[^}]+\}/gi, '')
              // Remove modern range media queries (e.g. (width >= 640px)) which break the parser
              .replace(/\(@media\s+[^{]+\{[^}]+\}/gi, '') 
              // More aggressive: remove any @media or @supports that might be malformed or too complex
              // but keep the basic ones if possible. Actually, html2canvas often fails on them.
              // Let's just remove @supports entirely as it's a common culprit
              .replace(/@supports[^{]+\{[^}]+\}/gi, '')
              // Fix potential malformed CSS variables or properties that might cause EOF errors
              .replace(/:\s*;+/g, ': inherit;');
          };

          try {
            // 1. Process all <style> tags in the head
            const styleTags = clonedDoc.getElementsByTagName('style');
            for (let i = 0; i < styleTags.length; i++) {
              const tag = styleTags[i];
              if (tag.textContent) {
                // We use textContent to avoid parsing issues with innerHTML
                tag.textContent = cleanCSS(tag.textContent);
              }
            }

            // 2. Process all elements for inline styles
            const allElements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
              const el = allElements[i] as HTMLElement;
              
              // Handle inline styles
              if (el.style && el.style.cssText) {
                const css = el.style.cssText;
                // Only clean if it contains problematic keywords to save performance
                if (/oklch|oklab|color-mix|light-dark|@container|@supports/i.test(css)) {
                  el.style.cssText = cleanCSS(css);
                }
              }

              // Handle SVG specific attributes
              if (el instanceof SVGElement) {
                ['fill', 'stroke'].forEach(attr => {
                  const val = el.getAttribute(attr);
                  if (val && (val.includes('oklch') || val.includes('oklab'))) {
                    el.setAttribute(attr, 'black');
                  }
                });
              }
            }
          } catch (e) {
            console.error('Error during html2canvas CSS cleanup:', e);
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // If content is longer than one A4 page, we might need to handle paging, 
      // but for a license card it usually fits in one page.
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`licenca_${data.licenca_no.replace(/\//g, '-')}.pdf`);
    } catch (err: any) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-8 flex justify-center items-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        )}
        <div className="bg-error-container text-on-error-container p-6 rounded-xl border border-error/20 flex items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-error" />
          <div>
            <h3 className="font-bold">Erro na Consulta</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto py-12 px-8 mb-16"
    >
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group print:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      )}
      
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h2 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
          <span className="w-8 h-1 bg-primary rounded-full"></span>
          Resultado da Consulta
        </h2>
        <div className="flex gap-2">
          {data.pdf_url && (
            <a 
              href={data.pdf_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              Visualizar Licença
            </a>
          )}
          <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">{data.status}</span>
          {data.publicada && (
            <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">Publicada</span>
          )}
        </div>
      </div>

      <div ref={cardRef} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="bg-surface-container-high px-8 py-6 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">TIPO DE LICENÇA</p>
            <h3 className="text-xl font-bold text-primary font-headline">{data.tipo_licenca}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">DATA DE RECEBIMENTO</p>
            <p className="font-semibold text-on-surface">{data.data_recebimento}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">PROCESSO Nº</p>
            <p className="text-on-surface font-semibold text-sm">{data.processo_no}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">LICENÇA Nº</p>
            <p className="text-on-surface font-semibold text-sm">{data.licenca_no}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">VALIDADE DA LICENÇA</p>
            <p className="text-secondary font-bold text-sm">{data.validade}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">INTERESSADO</p>
            <p className="text-on-surface font-semibold text-sm">{data.interessado}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">MUNICÍPIO DA ATIVIDADE</p>
            <p className="text-on-surface font-semibold text-sm">{data.municipio}</p>
          </div>

          <div className="md:col-span-3 h-px bg-surface-container-high"></div>

          <div className="md:col-span-3">
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">FINALIDADE DA LICENÇA</p>
            <p className="text-on-surface text-sm leading-relaxed">{data.finalidade}</p>
          </div>

          {data.condicionantes && (
            <div className="md:col-span-3">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">CONDICIONANTES</p>
              <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">{data.condicionantes}</p>
            </div>
          )}

          <div className="md:col-span-3">
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">ENDEREÇO DA ATIVIDADE LICENCIADA</p>
            <p className="text-on-surface text-sm">{data.endereco_atividade}</p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">ENDEREÇO PARA CORRESPONDÊNCIA</p>
            <p className="text-on-surface text-sm">{data.endereco_correspondencia}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">SOLICITAÇÃO / RENOVAÇÃO</p>
            <p className="text-on-surface font-semibold text-sm">{data.solicitacao_renovacao}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">RESPONSÁVEL TÉCNICO PROJETO</p>
            <p className="text-on-surface font-semibold text-sm">{data.responsavel_tecnico}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">RESPONSÁVEL ANÁLISE</p>
            <p className="text-on-surface font-semibold text-sm">{data.responsavel_analise}</p>
          </div>
        </div>


        <div data-html2canvas-ignore="true" className="bg-surface-container px-8 py-6 flex flex-col md:flex-row gap-4 items-center print:hidden">
          <button 
            onClick={handlePrint}
            className="w-full md:w-auto signature-gradient text-white px-10 py-3 rounded-lg font-bold flex items-center justify-center gap-3 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <Printer className="w-5 h-5" />
            Imprimir Licença
          </button>
          <button 
            onClick={handleSavePDF}
            disabled={isGenerating}
            className="w-full md:w-auto bg-white border border-secondary text-secondary px-10 py-3 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-secondary/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileDown className="w-5 h-5" />
            )}
            {isGenerating ? 'Gerando PDF...' : 'Salvar PDF'}
          </button>
          <div className="md:ml-auto flex items-center gap-2 text-outline">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Documento Autenticado Digitalmente</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export const TransparencyView = ({ onSearch, onBack }: { onSearch: (query: string, field?: string) => void; onBack: () => void }) => {
  const licenseTypes = [
    { id: 'LP', label: 'Licença Prévia (LP)', icon: 'P' },
    { id: 'LI', label: 'Licença de Instalação (LI)', icon: 'I' },
    { id: 'LO', label: 'Licença de Operação (LO)', icon: 'O' },
    { id: 'AA', label: 'Autorização Ambiental (AA)', icon: 'A' },
    { id: 'LUP', label: 'Licença Única Preventiva (LUP)', icon: 'U' },
    { id: 'LAU', label: 'Licença Ambiental Única (LAU)', icon: 'LA' },
    { id: 'LAS', label: 'Licença Ambiental Simplificada (LAS)', icon: 'S' },
    { id: 'ASV', label: 'Autorização de Supressão Vegetal (ASV)', icon: 'V' },
    { id: 'OUT', label: 'Outorga de Direito de Uso', icon: 'D' },
    { id: 'RLO', label: 'Renovação de Licença (RLO)', icon: 'R' },
    { id: 'LOP', label: 'Operação Provisória (LOP)', icon: 'OP' },
    { id: 'LMS', label: 'Licença Municipal (LMS)', icon: 'M' },
    { id: 'DLA', label: 'Dispensa de Licença (DLA)', icon: 'X' },
  ];

  return (
    <section className="py-16 px-8 max-w-6xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-on-surface font-headline tracking-tight mb-4">Portal da Transparência</h2>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
          Selecione uma categoria abaixo para listar todas as licenças e autorizações emitidas por modalidade.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {licenseTypes.map((type, idx) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSearch(type.label, 'tipo_licenca')}
            className="group bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 hover:border-primary/40 hover:shadow-2xl transition-all flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary text-2xl font-black group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
              {type.icon}
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-lg mb-2 leading-tight">{type.label}</h3>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Consultar Base</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-16 p-8 bg-surface-container-low rounded-3xl border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="flex-grow">
          <h4 className="font-bold text-on-surface text-xl mb-1">Dados Abertos e Integridade</h4>
          <p className="text-on-surface-variant text-sm">
            Todas as consultas realizadas neste portal são baseadas em dados oficiais do IPAAM, garantindo a integridade e publicidade dos atos administrativos ambientais do Estado do Amazonas.
          </p>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="w-full mt-auto py-8 border-t border-outline-variant/20 bg-surface print:hidden">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-4 max-w-full mx-auto">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-on-surface">IPAAM</span>
          <p className="text-xs text-on-surface-variant">© 2026 IPAAM - Instituto de Proteção Ambiental do Amazonas. Todos os direitos reservados. Projeto Desenvolvido por José Narbaes</p>
        </div>
        <div className="flex gap-6">
          <a className="text-xs text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacidade</a>
          <a className="text-xs text-on-surface-variant hover:text-secondary transition-colors" href="#">Termos de Uso</a>
          <a className="text-xs text-on-surface-variant hover:text-secondary transition-colors" href="#">Ouvidoria</a>
          <a className="text-xs text-on-surface-variant hover:text-secondary transition-colors" href="#">Acesso à Informação</a>
        </div>
      </div>
    </footer>
  );
};

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess: (user: any) => void }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="signature-gradient p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold font-headline">Login Institucional</h2>
                <p className="text-xs opacity-80">Acesso restrito para administradores</p>
              </div>
              <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-medium border border-error/10">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">E-mail Institucional</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none"
                  placeholder="admin@ipaam.am.gov.br"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Senha</label>
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full signature-gradient text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Entrar no Sistema
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'User' as 'Administrator' | 'User' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    try {
      // For creating a user without logging out the current admin, 
      // in a real app you'd use a server-side function.
      // For this prototype, we'll suggest using invitations or 
      // inform that signing up might affect the current session if not handled.
      // However, we'll try to use the current auth flow and then re-fetch.
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            email: newUser.email,
            role: newUser.role
          }]);

        if (profileError) throw profileError;
        
        setIsAdding(false);
        setNewUser({ email: '', password: '', role: 'User' });
        fetchUsers();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar usuário');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRole = async (user: UserProfile) => {
    const newRole = user.role === 'Administrator' ? 'User' : 'Administrator';
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (updateError) throw updateError;
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar papel do usuário');
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm('Deseja realmente remover este perfil? O usuário continuará no Auth mas perderá acesso administrativo.')) return;
    try {
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao remover perfil');
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline text-3xl font-black text-on-surface flex items-center gap-3">
            <Users className="text-primary w-8 h-8" />
            Gerenciamento de Usuários
          </h2>
          <p className="text-on-surface-variant font-medium">Controle de acessos e perfis do sistema.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          {isAdding ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {isAdding ? 'Cancelar' : 'Novo Usuário'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 overflow-hidden"
          >
            <form onSubmit={handleCreateUser} className="bg-surface-container-low p-8 rounded-3xl border border-primary/20 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-bold text-outline uppercase tracking-widest">E-mail</label>
                <input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border-none outline-none text-sm focus:ring-2 focus:ring-primary" placeholder="usuario@ipaam.am.gov.br" />
              </div>
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Senha Temporária</label>
                <input required type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border-none outline-none text-sm focus:ring-2 focus:ring-primary" placeholder="••••••••" />
              </div>
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Perfil</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as any})} className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border-none outline-none text-sm focus:ring-2 focus:ring-primary">
                  <option value="User">Usuário</option>
                  <option value="Administrator">Administrador</option>
                </select>
              </div>
              <button disabled={actionLoading} className="bg-primary text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Cadastrar</>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 flex items-center justify-between">
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high border-b border-outline-variant/10">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-outline">Usuário</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-outline">Perfil</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-outline">Data de Acesso</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-outline text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-on-surface-variant italic">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">{user.email}</p>
                      <p className="text-[10px] text-outline truncate max-w-[150px]">{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.role === 'Administrator' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-secondary-container text-on-secondary-container'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-4 text-xs font-medium text-on-surface-variant">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleToggleRole(user)}
                      className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all"
                      title="Alterar Perfil"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProfile(user.id)}
                      className="p-2 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-all"
                      title="Remover Perfil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export const AdminForm = ({ onSaveSuccess }: { onSaveSuccess: () => void }) => {
  const [formData, setFormData] = React.useState<Partial<LicenseData>>({
    tipo_licenca: 'Licença de Operação (LO)',
    status: 'Ativa',
    publicada: true,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const getAbbreviation = (tipo: string) => {
    const match = tipo.match(/\(([^)]+)\)/);
    if (match) return match[1];
    if (tipo.includes('Autorização')) return 'AA';
    return tipo.split(' ')[0].substring(0, 2).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const abbr = getAbbreviation(formData.tipo_licenca || '');
      
      let finalLicencaNo = formData.licenca_no || '';
      if (abbr && !finalLicencaNo.toUpperCase().startsWith(abbr.toUpperCase())) {
        finalLicencaNo = `${abbr} ${finalLicencaNo}`;
      }

      const dataToSave = {
        ...formData,
        licenca_no: finalLicencaNo,
      };

      const tableName = getTableName(formData.tipo_licenca || '');

      const { error: supabaseError } = await supabase
        .from(tableName)
        .insert([dataToSave]);

      if (supabaseError) {
        // Check for unique constraint violation on licenca_no or processo_no
        if (supabaseError.message.includes('licencas_licenca_no_key') || supabaseError.code === '23505') {
          throw new Error(`Já existe uma licença cadastrada com este número (${finalLicencaNo}) ou Processo (${formData.processo_no}). Por favor, verifique os dados.`);
        }
        throw supabaseError;
      }
      
      setSuccess(true);
      setFormData({
        tipo_licenca: 'Licença de Operação (LO)',
        status: 'Ativa',
        publicada: true,
      });
      onSaveSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar licença');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-8 print:hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
          <span className="w-8 h-1 bg-primary rounded-full"></span>
          Cadastro de Nova Licença
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && (
            <div className="md:col-span-2 bg-error-container text-on-error-container p-4 rounded-xl border border-error/10 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="md:col-span-2 bg-primary-fixed text-on-primary-fixed p-4 rounded-xl border border-primary/10 text-sm font-bold">
              Licença cadastrada com sucesso!
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Tipo de Licença</label>
            <select 
              name="tipo_licenca"
              value={formData.tipo_licenca}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm"
            >
              <option>Licença de Operação (LO)</option>
              <option>Licença de Instalação (LI)</option>
              <option>Licença Prévia (LP)</option>
              <option>Licença Ambiental Única (LAU)</option>
              <option>Autorização Ambiental (AA)</option>
              <option>Licença Única Preventiva (LUP)</option>
              <option>Licença Ambiental Simplificada (LAS)</option>
              <option>Autorização de Supressão Vegetal (ASV)</option>
              <option>Outorga de Direito de Uso</option>
              <option>Renovação de Licença (RLO)</option>
              <option>Operação Provisória (LOP)</option>
              <option>Licença Municipal (LMS)</option>
              <option>Dispensa de Licença (DLA)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm"
            >
              <option>Ativa</option>
              <option>Vencida</option>
              <option>Suspensa</option>
              <option>Cancelada</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Processo Nº</label>
            <input required name="processo_no" value={formData.processo_no || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Ex: 2024.000123/IPAAM" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Licença Nº</label>
            <input required name="licenca_no" value={formData.licenca_no || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Ex: LI 458/2024" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Data de Recebimento</label>
            <input required name="data_recebimento" value={formData.data_recebimento || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Ex: 15 de Março de 2024" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Validade</label>
            <input required name="validade" value={formData.validade || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Ex: 15/03/2026 (24 meses)" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Interessado</label>
            <input required name="interessado" value={formData.interessado || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Nome da Empresa ou Pessoa" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Município</label>
            <input required name="municipio" value={formData.municipio || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Ex: Manaus / AM" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Link do PDF (Opcional)</label>
            <input name="pdf_url" value={formData.pdf_url || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="https://exemplo.com/licenca.pdf" />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" name="publicada" checked={formData.publicada} onChange={handleChange} className="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary" />
            <label className="text-sm font-bold text-on-surface">Publicar Imediatamente</label>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Finalidade</label>
            <textarea name="finalidade" value={formData.finalidade || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm min-h-[100px]" placeholder="Descreva a finalidade da licença..." />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Condicionantes</label>
            <textarea name="condicionantes" value={formData.condicionantes || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm min-h-[120px]" placeholder="Insira as condicionantes da licença..." />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Endereço da Atividade</label>
            <input required name="endereco_atividade" value={formData.endereco_atividade || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Endereço completo da atividade" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Endereço para Correspondência</label>
            <input required name="endereco_correspondencia" value={formData.endereco_correspondencia || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Endereço para envio de documentos" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Solicitação / Renovação</label>
            <input required name="solicitacao_renovacao" value={formData.solicitacao_renovacao || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Ex: 10/01/2024" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Resp. Técnico Projeto</label>
            <input required name="responsavel_tecnico" value={formData.responsavel_tecnico || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Nome e CREA" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Resp. Análise</label>
            <input required name="responsavel_analise" value={formData.responsavel_analise || ''} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Nome do Analista" />
          </div>
        </div>

        <div className="bg-surface-container px-8 py-6 flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => setFormData({ tipo_licenca: 'Licença de Operação (LO)', status: 'Ativa', publicada: true })}
            className="px-8 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            Limpar
          </button>
          <button 
            disabled={loading}
            className="signature-gradient text-white px-12 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Licença
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
