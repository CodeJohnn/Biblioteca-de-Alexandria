/*
  CONFIGURAÇÃO DO SUPABASE
  No Supabase: Project Settings → API.
  Use a Project URL e a publishable key (ou a antiga anon public key).
  NUNCA coloque a service_role/secret key em arquivos do navegador.
*/
window.ALEXANDRIA_SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO";
window.ALEXANDRIA_SUPABASE_KEY = "COLE_AQUI_SUA_PUBLISHABLE_KEY";
window.ALEXANDRIA_STORAGE_BUCKET = "alexandria-assets";

window.createAlexandriaClient = function () {
  if (!window.supabase || !window.ALEXANDRIA_SUPABASE_URL.startsWith("https://")
      || window.ALEXANDRIA_SUPABASE_KEY.startsWith("COLE_AQUI")) {
    throw new Error("Configure a URL e a publishable key em admin/supabase-config.js.");
  }
  return window.supabase.createClient(
    window.ALEXANDRIA_SUPABASE_URL,
    window.ALEXANDRIA_SUPABASE_KEY
  );
};
