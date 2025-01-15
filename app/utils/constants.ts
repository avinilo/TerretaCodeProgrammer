import type { IProviderSetting } from '~/types/model';

import { LLMManager } from '~/lib/modules/llm/manager';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { Template } from '~/types/template';

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'Terretacode_file_modifications';
export const MODEL_REGEX = /^\[Model: (.*?)\]\n\n/;
export const PROVIDER_REGEX = /\[Provider: (.*?)\]\n\n/;
export const DEFAULT_MODEL = 'claude-3-5-sonnet-latest';
export const PROMPT_COOKIE_KEY = 'cachedPrompt';

const llmManager = LLMManager.getInstance(import.meta.env);

export const PROVIDER_LIST = llmManager.getAllProviders();
export const DEFAULT_PROVIDER = llmManager.getDefaultProvider();

let MODEL_LIST = llmManager.getModelList();

const providerBaseUrlEnvKeys: Record<string, { baseUrlKey?: string; apiTokenKey?: string }> = {};
PROVIDER_LIST.forEach((provider) => {
  providerBaseUrlEnvKeys[provider.name] = {
    baseUrlKey: provider.config.baseUrlKey,
    apiTokenKey: provider.config.apiTokenKey,
  };
});

// Export the getModelList function using the manager
export async function getModelList(options: {
  apiKeys?: Record<string, string>;
  providerSettings?: Record<string, IProviderSetting>;
  serverEnv?: Record<string, string>;
}) {
  return await llmManager.updateModelList(options);
}

async function initializeModelList(options: {
  env?: Record<string, string>;
  providerSettings?: Record<string, IProviderSetting>;
  apiKeys?: Record<string, string>;
}): Promise<ModelInfo[]> {
  const { providerSettings, apiKeys, env } = options;
  const list = await getModelList({
    apiKeys,
    providerSettings,
    serverEnv: env,
  });
  MODEL_LIST = list || MODEL_LIST;

  return list;
}

// initializeModelList({})
export { initializeModelList, providerBaseUrlEnvKeys, MODEL_LIST };

// starter Templates

export const STARTER_TEMPLATES: Template[] = [
  {
    name: 'Terretacode-astro-basic',
    label: 'Astro Basic',
    description: 'Lightweight Astro starter template for building fast static websites',
    githubRepo: 'thecodacus/Terretacode-astro-basic-template',
    tags: ['astro', 'blog', 'performance'],
    icon: 'i-Terretacode:astro',
  },
  {
    name: 'Terretacode-nextjs-shadcn',
    label: 'Next.js with shadcn/ui',
    description: 'Next.js starter fullstack template integrated with shadcn/ui components and styling system',
    githubRepo: 'thecodacus/Terretacode-nextjs-shadcn-template',
    tags: ['nextjs', 'react', 'typescript', 'shadcn', 'tailwind'],
    icon: 'i-Terretacode:nextjs',
  },
  {
    name: 'Terretacode-qwik-ts',
    label: 'Qwik TypeScript',
    description: 'Qwik framework starter with TypeScript for building resumable applications',
    githubRepo: 'thecodacus/Terretacode-qwik-ts-template',
    tags: ['qwik', 'typescript', 'performance', 'resumable'],
    icon: 'i-Terretacode:qwik',
  },
  {
    name: 'Terretacode-remix-ts',
    label: 'Remix TypeScript',
    description: 'Remix framework starter with TypeScript for full-stack web applications',
    githubRepo: 'thecodacus/Terretacode-remix-ts-template',
    tags: ['remix', 'typescript', 'fullstack', 'react'],
    icon: 'i-Terretacode:remix',
  },
  {
    name: 'Terretacode-slidev',
    label: 'Slidev Presentation',
    description: 'Slidev starter template for creating developer-friendly presentations using Markdown',
    githubRepo: 'thecodacus/Terretacode-slidev-template',
    tags: ['slidev', 'presentation', 'markdown'],
    icon: 'i-Terretacode:slidev',
  },
  {
    name: 'Terretacode-sveltekit',
    label: 'SvelteKit',
    description: 'SvelteKit starter template for building fast, efficient web applications',
    githubRepo: 'Terretacode-sveltekit-template',
    tags: ['svelte', 'sveltekit', 'typescript'],
    icon: 'i-Terretacode:svelte',
  },
  {
    name: 'vanilla-vite',
    label: 'Vanilla + Vite',
    description: 'Minimal Vite starter template for vanilla JavaScript projects',
    githubRepo: 'thecodacus/vanilla-vite-template',
    tags: ['vite', 'vanilla-js', 'minimal'],
    icon: 'i-Terretacode:vite',
  },
  {
    name: 'Terretacode-vite-react',
    label: 'React + Vite + typescript',
    description: 'React starter template powered by Vite for fast development experience',
    githubRepo: 'thecodacus/Terretacode-vite-react-ts-template',
    tags: ['react', 'vite', 'frontend'],
    icon: 'i-Terretacode:react',
  },
  {
    name: 'Terretacode-vite-ts',
    label: 'Vite + TypeScript',
    description: 'Vite starter template with TypeScript configuration for type-safe development',
    githubRepo: 'thecodacus/Terretacode-vite-ts-template',
    tags: ['vite', 'typescript', 'minimal'],
    icon: 'i-Terretacode:typescript',
  },
  {
    name: 'Terretacode-vue',
    label: 'Vue.js',
    description: 'Vue.js starter template with modern tooling and best practices',
    githubRepo: 'thecodacus/Terretacode-vue-template',
    tags: ['vue', 'typescript', 'frontend'],
    icon: 'i-Terretacode:vue',
  },
  {
    name: 'Terretacode-angular',
    label: 'Angular Starter',
    description: 'A modern Angular starter template with TypeScript support and best practices configuration',
    githubRepo: 'thecodacus/Terretacode-angular-template',
    tags: ['angular', 'typescript', 'frontend', 'spa'],
    icon: 'i-Terretacode:angular',
  },
];
