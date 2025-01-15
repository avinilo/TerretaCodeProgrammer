import React from 'react';

const EXAMPLE_PROMPTS = [
  { text: 'Crea una aplicación de tareas pendientes en React usando Tailwind' },
  { text: 'Crea un Blog simple usando Astro' },
  { text: 'Cree un formulario de consentimiento de cookies utilizando Material UI' },
  { text: 'Crea un juego de invasores del espacio' },
  { text: 'Crea un juego de tres en raya solo en HTML, CSS y JS' },
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div
        className="flex flex-wrap justify-center gap-2"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="border border-Terretacode-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-Terretacode-elements-textSecondary hover:text-Terretacode-elements-textPrimary px-3 py-1 text-xs transition-theme"
            >
              {examplePrompt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
