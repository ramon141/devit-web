- Sempre execute "npx tsc --noEmit" depois de alguma alteração no código e corrija qualquer problema que apareça
- Para campos que usam Select use o Controller do useForm, se for Input utilize o register do useForm
- Jamais crie um arquivo com mais de 300 linhas, refatore
- Jamais crie uma função com mais de 40 linhas, refatore
- A função "toastPromise" não é async. Não é uma promise e caso queira executar o código após a promisse deve usar osuccess ou/e error. Sempre utilize a função getErrorMessageFromRequest no error do toastPromise
- Sempre opte por utilizar os componentes da pasta "./components""
- Jamais use any ou unknown ou never ou object. Jamais!!!!
- Sempre use o components/ModalRegister quando precisar de um modal com a config sx={{ width: { sm: '100%', md: '700px' } }}. E no box abaixo use sempre width:100%
- Não fique executando npx tsc --noEmit continuamente uma vez atras da outra, use timeout=2min, não execute mais de uma vez uma atrás da outra, jamais!!!
- Sempre prefira dayjs para parsear/formatar/comparar datas, nunca `new Date()` manual. Campos de data vindos da API podem chegar como data pura ("YYYY-MM-DD") ou ISO completo com hora/timezone ("YYYY-MM-DDTHH:mm:ss.sssZ") dependendo de como o driver do Postgres devolve a coluna — concatenar strings tipo `${value}T00:00:00` quebra quando o valor já tem horário, resultando em Invalid Date silencioso. dayjs(value) lida com os dois formatos.
- As credenciais do sistema são admin@devit.com e admin123
- Não use código completo em uma única linha, pois dificulta a legibilidade, evite:
- Opte sempre por criar uma linha em branco quando achar necessário para facilitar a leitura
<InputMoney value={watch('maxSalary')} setValue={(v: string | undefined) => setValue('maxSalary', v ?? '')} name="maxSalary" label="Salário Máximo" required disabled={nameExists} />

e prefira
<InputMoney
    value={watch('maxSalary')}
    setValue={(v: string | undefined) => setValue('maxSalary', v ?? '')}
    name="maxSalary"
    label="Salário
    Máximo"
    required
    disabled={nameExists}
/>
- Consulte o arquivo: src/constants/index.ts
- Sempre opte por criar linhas curtas e nunca/jamais muito longas
- Uma pasta de uma página deve ser organizada como components/ schemas/ types/ hooks/ index.tsx; nem sempre vai precisar de todas essas subpastas, se nao for necessario nao crie
