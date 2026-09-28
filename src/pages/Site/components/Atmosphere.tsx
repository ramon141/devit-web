/**
 * As transições entre páginas, animadas por lib/site/casa:
 *  - o branco (`.white`): a tela toda branca, ponte entre uma cena e outra;
 *  - a pasta (`.carry`): ao sair da ficha, tudo que está sobre a mesa se encaixa
 *    dentro dela, ela se fecha e vem para a tela;
 *  - a névoa (`.mist`): três nuvens que fecham e se dissipam, para qualquer link;
 *  - o voo (`.fly`): ao abrir uma pasta de imóvel, um vídeo em tela cheia que se
 *    funde no fundo de mesa da ficha.
 */
function Atmosphere() {
  return (
    <>
      <div className="mist" aria-hidden>
        <div className="mist-base" />
        <div className="mist-cloud mist-cloud--1" />
        <div className="mist-cloud mist-cloud--2" />
        <div className="mist-cloud mist-cloud--3" />
      </div>
      <div className="white" aria-hidden />
      <div className="carry" aria-hidden>
        <div className="carry-tab">Devit</div>
        <div className="carry-back" />
        <div className="carry-inside" />
        <div className="carry-front" />
      </div>
      <div className="fly" aria-hidden>
        <video className="fly-video" muted playsInline preload="metadata" poster="/video/volo-poster.jpg">
          <source src="/video/volo-720.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/video/volo-1080.mp4" type="video/mp4" />
        </video>
        <p className="fly-skip">Devit</p>
      </div>
    </>
  )
}

export default Atmosphere
