"use client";

import { useId, useState } from "react";
import { site, whatsappLink } from "@/lib/site";

const KINDS = ["Projeto autoral", "Flash disponível", "Cobertura"];
const SIZES = ["Até 10 cm", "De 10 a 20 cm", "De 20 a 30 cm", "Maior que 30 cm", "Ainda não sei"];

type Errors = { nome?: string; ideia?: string };

function buildMessage(data: FormData) {
  const field = (name: string) => String(data.get(name) ?? "").trim();
  const lines = [
    "Oi, Lysa! Vim pelo site e quero um orçamento.",
    "",
    `*Nome:* ${field("nome")}`,
    `*Tipo:* ${field("tipo")}`,
    `*Ideia:* ${field("ideia")}`,
  ];
  if (field("local")) lines.push(`*Local do corpo:* ${field("local")}`);
  if (field("tamanho")) lines.push(`*Tamanho:* ${field("tamanho")}`);
  if (field("quando")) lines.push(`*Quando:* ${field("quando")}`);
  return lines.join("\n");
}

function Stamp() {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className="size-24 rotate-[-11deg] text-sangue opacity-85 sm:size-32">
      <defs>
        <path id="carimbo-volta" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text fill="currentColor" fontSize="11.5" fontWeight="600" letterSpacing="1.6">
        <textPath href="#carimbo-volta">Lysa Ink ✦ dark blackwork ✦ Uberlândia MG ✦</textPath>
      </text>
      {/* cabeça de gata */}
      <path
        fill="currentColor"
        d="M42,46 L47,62 C45,66 44,70 44,73 C44,83 51,88 60,88 C69,88 76,83 76,73 C76,70 75,66 73,62 L78,46 L66,56 C64,55.4 62,55 60,55 C58,55 56,55.4 54,56 Z"
      />
      <path fill="var(--color-papel)" d="M49,71 Q53,67 57,71 Q53,74 49,71Z M63,71 Q67,67 71,71 Q67,74 63,71Z" />
    </svg>
  );
}

// Campos com 20px de fonte: abaixo de 16px o iPhone dá zoom ao focar.
const fieldClass =
  "mt-1 min-h-12 w-full rounded-none border-0 border-b-2 border-nanquim/70 bg-transparent px-0 py-2 text-xl text-nanquim placeholder:text-nanquim/45 focus:border-sangue focus:outline-none";
const labelClass = "block text-lg font-semibold";

export function BookingForm() {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [sentLink, setSentLink] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    if (!String(data.get("nome") ?? "").trim()) next.nome = "Escreva seu nome para a Lysa saber com quem está falando.";
    if (!String(data.get("ideia") ?? "").trim()) next.ideia = "Descreva a tatuagem, mesmo que em poucas palavras.";
    setErrors(next);

    if (next.nome || next.ideia) {
      const first = next.nome ? "nome" : "ideia";
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const link = whatsappLink(buildMessage(data));
    setSentLink(link);

    // No celular (e no navegador interno do Instagram) abrir nova aba costuma
    // ser bloqueado; navegar direto entrega a conversa ao app do WhatsApp.
    if (window.matchMedia("(pointer: coarse)").matches) window.location.href = link;
    else window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="scroll-mt-20 px-5 pt-10 pb-32 lg:px-10 lg:pb-44">
      <div className="mx-auto max-w-3xl">
        <h2 id="agendar-titulo" className="font-gotica text-[clamp(3.25rem,8vw,7rem)] leading-[0.92] font-black">
          Conte a sua ideia
        </h2>
        <p className="mt-6 max-w-[46ch] text-xl text-cinza">
          Preencha a ficha e ela abre uma conversa no WhatsApp da Lysa com tudo anotado. As imagens de referência você
          envia por lá.
        </p>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="papel relative -mx-2 mt-12 px-5 pt-8 pb-9 text-nanquim sm:mx-0 sm:mt-14 sm:px-12 sm:pt-12 sm:pb-14"
        >
          <div className="flex items-start justify-between gap-3 border-b-2 border-nanquim pb-6">
            <div>
              <p className="font-gotica text-[2.5rem] leading-[0.95] font-bold sm:text-5xl">Ficha de orçamento</p>
              <p className="mt-3 text-lg">
                {site.name}, {site.city}
              </p>
            </div>
            <div className="-mt-2 -mr-2 shrink-0 sm:-mt-5 sm:-mr-5">
              <Stamp />
            </div>
          </div>

          <div className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-nome`} className={labelClass}>
                Seu nome
              </label>
              <input
                id={`${id}-nome`}
                name="nome"
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={errors.nome ? `${id}-nome-erro` : undefined}
                className={fieldClass}
              />
              {errors.nome && (
                <p id={`${id}-nome-erro`} className="mt-2 text-base font-semibold text-sangue">
                  {errors.nome}
                </p>
              )}
            </div>

            <fieldset className="sm:col-span-2">
              <legend className={labelClass}>O que você procura</legend>
              <div className="mt-3 flex flex-wrap gap-2.5 sm:gap-3">
                {KINDS.map((kind, i) => (
                  <label key={kind} className="cursor-pointer">
                    <input type="radio" name="tipo" value={kind} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="flex min-h-11 items-center border-2 border-nanquim/70 px-4 text-lg peer-checked:border-nanquim peer-checked:bg-nanquim peer-checked:text-papel peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-sangue">
                      {kind}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <label htmlFor={`${id}-ideia`} className={labelClass}>
                O que você quer tatuar
              </label>
              <textarea
                id={`${id}-ideia`}
                name="ideia"
                rows={3}
                placeholder="Um corvo sobre uma caveira, com espinhos em volta"
                aria-invalid={Boolean(errors.ideia)}
                aria-describedby={errors.ideia ? `${id}-ideia-erro` : undefined}
                className={`${fieldClass} resize-y`}
              />
              {errors.ideia && (
                <p id={`${id}-ideia-erro`} className="mt-2 text-base font-semibold text-sangue">
                  {errors.ideia}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${id}-local`} className={labelClass}>
                Onde no corpo
              </label>
              <input
                id={`${id}-local`}
                name="local"
                enterKeyHint="next"
                placeholder="Antebraço, costas, panturrilha"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`${id}-tamanho`} className={labelClass}>
                Tamanho aproximado
              </label>
              <select id={`${id}-tamanho`} name="tamanho" defaultValue="" className={`${fieldClass} cursor-pointer`}>
                <option value="">Escolha um tamanho</option>
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${id}-quando`} className={labelClass}>
                Quando você quer fazer
              </label>
              <input
                id={`${id}-quando`}
                name="quando"
                enterKeyHint="send"
                placeholder="Em novembro, à tarde"
                className={fieldClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 min-h-15 w-full bg-nanquim px-6 py-4 text-xl font-semibold text-papel transition-colors hover:bg-sangue focus-visible:outline-sangue active:bg-sangue sm:mt-11"
          >
            Enviar pelo WhatsApp
          </button>

          <p aria-live="polite" className="mt-4 min-h-[1.6em] text-lg">
            {sentLink && (
              <>
                Ficha enviada para o WhatsApp. Se a conversa não abriu,{" "}
                <a href={sentLink} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                  abra por aqui
                </a>
                .
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
