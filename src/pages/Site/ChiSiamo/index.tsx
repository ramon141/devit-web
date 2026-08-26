import BranchList from '@/pages/Site/ChiSiamo/components/BranchList'

function ChiSiamo() {
  return (
    <div className="mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Chi Siamo</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Gli inizi</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Devit Servizi Immobiliari nasce nel 1995 dall'iniziativa di Angelo
          De Santis e Massimiliano Vitale, con l'obiettivo di offrire un
          servizio immobiliare serio e professionale a Napoli e provincia.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Le sedi</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Partita dal quartiere Chiaia, l'agenzia è cresciuta negli anni fino
          ad aprire una seconda sede a Portici, ampliando la propria presenza
          sul territorio e la capacità di seguire da vicino le esigenze dei
          clienti.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Obiettivi Devit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Garantiamo la massima collaborazione e la massima trasparenza con
          i nostri clienti, affinché ogni trattativa avvenga con serenità e
          ognuno possa realizzare nel modo migliore il proprio progetto
          immobiliare.
        </p>
      </section>

      <BranchList />
    </div>
  )
}

export default ChiSiamo
