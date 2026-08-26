import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import itCommon from './locales/it/common.json'
import itAgenda from './locales/it/agenda.json'
import itAmministrazione from './locales/it/amministrazione.json'
import itClientes from './locales/it/clientes.json'
import itComponentes from './locales/it/componentes.json'
import itHome from './locales/it/home.json'
import itImoveis from './locales/it/imoveis.json'
import itLogin from './locales/it/login.json'
import itMarketing from './locales/it/marketing.json'
import itNotifiche from './locales/it/notifiche.json'
import itOperazioni from './locales/it/operazioni.json'
import itProfilo from './locales/it/profilo.json'
import itProposte from './locales/it/proposte.json'
import itSite from './locales/it/site.json'
import itStatistiche from './locales/it/statistiche.json'

import ptCommon from './locales/pt/common.json'
import ptAgenda from './locales/pt/agenda.json'
import ptAmministrazione from './locales/pt/amministrazione.json'
import ptClientes from './locales/pt/clientes.json'
import ptComponentes from './locales/pt/componentes.json'
import ptHome from './locales/pt/home.json'
import ptImoveis from './locales/pt/imoveis.json'
import ptLogin from './locales/pt/login.json'
import ptMarketing from './locales/pt/marketing.json'
import ptNotifiche from './locales/pt/notifiche.json'
import ptOperazioni from './locales/pt/operazioni.json'
import ptProfilo from './locales/pt/profilo.json'
import ptProposte from './locales/pt/proposte.json'
import ptSite from './locales/pt/site.json'
import ptStatistiche from './locales/pt/statistiche.json'

const LANG_KEY = 'lang'

const savedLang = localStorage.getItem(LANG_KEY)

i18n.use(initReactI18next).init({
  resources: {
    it: {
      common: itCommon,
      agenda: itAgenda,
      amministrazione: itAmministrazione,
      clientes: itClientes,
      componentes: itComponentes,
      home: itHome,
      imoveis: itImoveis,
      login: itLogin,
      marketing: itMarketing,
      notifiche: itNotifiche,
      operazioni: itOperazioni,
      profilo: itProfilo,
      proposte: itProposte,
      site: itSite,
      statistiche: itStatistiche,
    },
    pt: {
      common: ptCommon,
      agenda: ptAgenda,
      amministrazione: ptAmministrazione,
      clientes: ptClientes,
      componentes: ptComponentes,
      home: ptHome,
      imoveis: ptImoveis,
      login: ptLogin,
      marketing: ptMarketing,
      notifiche: ptNotifiche,
      operazioni: ptOperazioni,
      profilo: ptProfilo,
      proposte: ptProposte,
      site: ptSite,
      statistiche: ptStatistiche,
    },
  },
  lng: savedLang ?? 'it',
  fallbackLng: 'it',
  defaultNS: 'common',
  ns: [
    'common',
    'agenda',
    'amministrazione',
    'clientes',
    'componentes',
    'home',
    'imoveis',
    'login',
    'marketing',
    'notifiche',
    'operazioni',
    'profilo',
    'proposte',
    'site',
    'statistiche',
  ],
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANG_KEY, lng)
})

export default i18n
