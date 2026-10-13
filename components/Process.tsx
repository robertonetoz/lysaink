import Image from "next/image";
import { Arch } from "./Arch";

const STEPS = [
  {
    numeral: "I",
    title: "Você conta a ideia",
    text: "Preencha a ficha aqui embaixo com o tema, o lugar do corpo e o tamanho. Ela abre uma conversa no WhatsApp com tudo anotado.",
  },
  {
    numeral: "II",
    title: "Orçamento e data",
    text: "Pela conversa você manda as referências. A gente fecha tamanho, valor e o dia da sessão.",
  },
  {
    numeral: "III",
    title: "O desenho",
    text: "Crio a arte no meu estilo, pensada para a parte do corpo que você escolheu.",
  },
  {
    numeral: "IV",
    title: "A sessão",
    text: "No estúdio, em Uberlândia. Decalque na pele, ajuste de posição e só então a agulha.",
  },
  {
    numeral: "V",
    title: "Cicatrização",
    text: "Você sai com as orientações de cuidado. Preto bem cicatrizado é preto que dura.",
  },
];

export function Process() {
  return (
    <section
      id="processo"
      aria-labelledby="processo-titulo"
      className="mx-auto grid max-w-7xl scroll-mt-24 gap-16 px-5 py-28 lg:grid-cols-12 lg:px-10 lg:py-40 lg:pl-28"
    >
      <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
        <h2 id="processo-titulo" className="font-gotica text-[clamp(3.25rem,6.4vw,6rem)] leading-[0.92] font-black">
          Do rascunho à pele
        </h2>
        <Arch ratio="2/3" className="mt-12 w-[min(64vw,300px)] text-osso">
          <Image
            src="/lysa/lysa2.jpg"
            alt="Lysa no estúdio, de camiseta preta de banda, em frente ao espelho"
            fill
            sizes="300px"
            className="object-cover object-[38%_0%]"
          />
        </Arch>
      </div>

      <ol className="lg:col-span-6 lg:col-start-7">
        {STEPS.map((step) => (
          <li key={step.numeral} className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-osso/20 py-9 last:border-b sm:grid-cols-[6.5rem_1fr]">
            <span aria-hidden className="font-gotica text-5xl leading-none font-bold text-labio sm:text-6xl">
              {step.numeral}
            </span>
            <div>
              <h3 className="font-gotica text-[2rem] leading-tight font-semibold">{step.title}</h3>
              <p className="mt-3 max-w-[38ch] text-xl text-cinza">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
