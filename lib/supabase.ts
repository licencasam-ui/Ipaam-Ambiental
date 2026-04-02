import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mdbnfcwxscqrgrmreicj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5dQXJ36tbdm9ESIeKgoZ2A_L09krvFB';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getTableName = (tipo: string): string => {
  if (tipo.includes('(LO)')) return 'licencas_lo';
  if (tipo.includes('(LI)')) return 'licencas_li';
  if (tipo.includes('(LP)')) return 'licencas_lp';
  if (tipo.includes('(LAU)')) return 'licencas_lau';
  if (tipo.includes('(AA)')) return 'licencas_aa';
  if (tipo.includes('(LUP)')) return 'licencas_lup';
  if (tipo.includes('(LAS)')) return 'licencas_las';
  if (tipo.includes('(ASV)')) return 'licencas_asv';
  if (tipo.includes('Outorga')) return 'licencas_outorga';
  if (tipo.includes('(RLO)')) return 'licencas_rlo';
  if (tipo.includes('(LOP)')) return 'licencas_lop';
  if (tipo.includes('(LMS)')) return 'licencas_lms';
  if (tipo.includes('(DLA)')) return 'licencas_dla';
  return 'all_licencas'; // Fallback para a view unificada
};
