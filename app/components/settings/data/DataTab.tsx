import React, { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { db, deleteById, getAll, setMessages } from '~/lib/persistence';
import { logStore } from '~/lib/stores/logs';
import { classNames } from '~/utils/classNames';
import type { Message } from 'ai';

// List of supported providers that can have API keys
const API_KEY_PROVIDERS = [
  'Anthropic',
  'OpenAI',
  'Google',
  'Groq',
  'HuggingFace',
  'OpenRouter',
  'Deepseek',
  'Mistral',
  'OpenAILike',
  'Together',
  'xAI',
  'Perplexity',
  'Cohere',
  'AzureOpenAI',
  'AmazonBedrock',
] as const;

interface ApiKeys {
  [key: string]: string;
}

export default function DataTab() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const downloadAsJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAllChats = async () => {
    if (!db) {
      const error = new Error('Database is not available');
      logStore.logError('Failed to export chats - DB unavailable', error);
      toast.error('Database is not available');

      return;
    }

    try {
      const allChats = await getAll(db);
      const exportData = {
        chats: allChats,
        exportDate: new Date().toISOString(),
      };

      downloadAsJson(exportData, `all-chats-${new Date().toISOString()}.json`);
      logStore.logSystem('Chats exported successfully', { count: allChats.length });
      toast.success('Chats exported successfully');
    } catch (error) {
      logStore.logError('Failed to export chats', error);
      toast.error('Failed to export chats');
      console.error(error);
    }
  };

  const handleDeleteAllChats = async () => {
    const confirmDelete = window.confirm('Are you sure you want to Borrar Chats? This action cannot be undone.');

    if (!confirmDelete) {
      return;
    }

    if (!db) {
      const error = new Error('Database is not available');
      logStore.logError('Failed to delete chats - DB unavailable', error);
      toast.error('Database is not available');

      return;
    }

    try {
      setIsDeleting(true);

      const allChats = await getAll(db);
      await Promise.all(allChats.map((chat) => deleteById(db!, chat.id)));
      logStore.logSystem('All chats deleted successfully', { count: allChats.length });
      toast.success('All chats deleted successfully');
      navigate('/', { replace: true });
    } catch (error) {
      logStore.logError('Failed to delete chats', error);
      toast.error('Failed to delete chats');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      providers: Cookies.get('providers'),
      isDebugEnabled: Cookies.get('isDebugEnabled'),
      isEventLogsEnabled: Cookies.get('isEventLogsEnabled'),
      isLocalModelsEnabled: Cookies.get('isLocalModelsEnabled'),
      promptId: Cookies.get('promptId'),
      isLatestBranch: Cookies.get('isLatestBranch'),
      commitHash: Cookies.get('commitHash'),
      eventLogs: Cookies.get('eventLogs'),
      selectedModel: Cookies.get('selectedModel'),
      selectedProvider: Cookies.get('selectedProvider'),
      githubUsername: Cookies.get('githubUsername'),
      githubToken: Cookies.get('githubToken'),
      Terretacode_theme: localStorage.getItem('Terretacode_theme'),
    };

    downloadAsJson(settings, 'Terretacode-settings.json');
    toast.success('Settings exported successfully');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);

        Object.entries(settings).forEach(([key, value]) => {
          if (key === 'Terretacode_theme') {
            if (value) {
              localStorage.setItem(key, value as string);
            }
          } else if (value) {
            Cookies.set(key, value as string);
          }
        });

        toast.success('Settings imported successfully. Please refresh the page for changes to take effect.');
      } catch (error) {
        toast.error('Failed to Importar Ajustes. Make sure the file is a valid JSON file.');
        console.error('Failed to Importar Ajustes:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportApiKeyTemplate = () => {
    const template: ApiKeys = {};
    API_KEY_PROVIDERS.forEach((provider) => {
      template[`${provider}_API_KEY`] = '';
    });

    template.OPENAI_LIKE_API_BASE_URL = '';
    template.LMSTUDIO_API_BASE_URL = '';
    template.OLLAMA_API_BASE_URL = '';
    template.TOGETHER_API_BASE_URL = '';

    downloadAsJson(template, 'api-keys-template.json');
    toast.success('API keys template exported successfully');
  };

  const handleImportApiKeys = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const apiKeys = JSON.parse(e.target?.result as string);
        let importedCount = 0;
        const consolidatedKeys: Record<string, string> = {};

        API_KEY_PROVIDERS.forEach((provider) => {
          const keyName = `${provider}_API_KEY`;

          if (apiKeys[keyName]) {
            consolidatedKeys[provider] = apiKeys[keyName];
            importedCount++;
          }
        });

        if (importedCount > 0) {
          // Store all API keys in a single cookie as JSON
          Cookies.set('apiKeys', JSON.stringify(consolidatedKeys));

          // Also set individual cookies for backward compatibility
          Object.entries(consolidatedKeys).forEach(([provider, key]) => {
            Cookies.set(`${provider}_API_KEY`, key);
          });

          toast.success(`Successfully imported ${importedCount} API keys/URLs. Refreshing page to apply changes...`);

          // Reload the page after a short delay to allow the toast to be seen
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toast.warn('No valid API keys found in the file');
        }

        // Set base URLs if they exist
        ['OPENAI_LIKE_API_BASE_URL', 'LMSTUDIO_API_BASE_URL', 'OLLAMA_API_BASE_URL', 'TOGETHER_API_BASE_URL'].forEach(
          (baseUrl) => {
            if (apiKeys[baseUrl]) {
              Cookies.set(baseUrl, apiKeys[baseUrl]);
            }
          },
        );
      } catch (error) {
        toast.error('Failed to Importar API Keys. Make sure the file is a valid JSON file.');
        console.error('Failed to Importar API Keys:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const processChatData = (
    data: any,
  ): Array<{
    id: string;
    messages: Message[];
    description: string;
    urlId?: string;
  }> => {
    // Handle Terretacode standard format (single chat)
    if (data.messages && Array.isArray(data.messages)) {
      const chatId = crypto.randomUUID();
      return [
        {
          id: chatId,
          messages: data.messages,
          description: data.description || 'Imported Chat',
          urlId: chatId,
        },
      ];
    }

    // Handle Terretacode export format (multiple chats)
    if (data.chats && Array.isArray(data.chats)) {
      return data.chats.map((chat: { id?: string; messages: Message[]; description?: string; urlId?: string }) => ({
        id: chat.id || crypto.randomUUID(),
        messages: chat.messages,
        description: chat.description || 'Imported Chat',
        urlId: chat.urlId,
      }));
    }

    console.error('No matching format found for:', data);
    throw new Error('Unsupported chat format');
  };

  const handleImportChats = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (!file || !db) {
        toast.error('Something went wrong');
        return;
      }

      try {
        const content = await file.text();
        const data = JSON.parse(content);
        const chatsToImport = processChatData(data);

        for (const chat of chatsToImport) {
          await setMessages(db, chat.id, chat.messages, chat.urlId, chat.description);
        }

        logStore.logSystem('Chats imported successfully', { count: chatsToImport.length });
        toast.success(`Successfully imported ${chatsToImport.length} chat${chatsToImport.length > 1 ? 's' : ''}`);
        window.location.reload();
      } catch (error) {
        if (error instanceof Error) {
          logStore.logError('Failed to Importar Chats:', error);
          toast.error('Failed to Importar Chats: ' + error.message);
        } else {
          toast.error('Failed to Importar Chats');
        }

        console.error(error);
      }
    };

    input.click();
  };

  return (
    <div className="p-4 bg-Terretacode-elements-bg-depth-2 border border-Terretacode-elements-borderColor rounded-lg mb-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-Terretacode-elements-textPrimary mb-4">Gestión de Datos</h3>
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-Terretacode-elements-textPrimary mb-2">Historial de Chat</h4>
              <p className="text-sm text-Terretacode-elements-textSecondary mb-4">
                Exportar o eliminar todo tu Historial de Chat.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleExportAllChats}
                  className="px-4 py-2 bg-Terretacode-elements-button-primary-background hover:bg-Terretacode-elements-button-primary-backgroundHover text-Terretacode-elements-textPrimary rounded-lg transition-colors"
                >
                  Exportar Chats
                </button>
                <button
                  onClick={handleImportChats}
                  className="px-4 py-2 bg-Terretacode-elements-button-primary-background hover:bg-Terretacode-elements-button-primary-backgroundHover text-Terretacode-elements-textPrimary rounded-lg transition-colors"
                >
                  Importar Chats
                </button>
                <button
                  onClick={handleDeleteAllChats}
                  disabled={isDeleting}
                  className={classNames(
                    'px-4 py-2 bg-Terretacode-elements-button-danger-background hover:bg-Terretacode-elements-button-danger-backgroundHover text-Terretacode-elements-button-danger-text rounded-lg transition-colors',
                    isDeleting ? 'opacity-50 cursor-not-allowed' : '',
                  )}
                >
                  {isDeleting ? 'Deleting...' : 'Borrar Chats'}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-Terretacode-elements-textPrimary mb-2">Ajustes Backup</h4>
              <p className="text-sm text-Terretacode-elements-textSecondary mb-4">
                Exporta tus configuraciones a un archivo JSON o importa configuraciones desde un archivo previamente
                exportado.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleExportSettings}
                  className="px-4 py-2 bg-Terretacode-elements-button-primary-background hover:bg-Terretacode-elements-button-primary-backgroundHover text-Terretacode-elements-textPrimary rounded-lg transition-colors"
                >
                  Exportar Ajustes
                </button>
                <label className="px-4 py-2 bg-Terretacode-elements-button-primary-background hover:bg-Terretacode-elements-button-primary-backgroundHover text-Terretacode-elements-textPrimary rounded-lg transition-colors cursor-pointer">
                  Importar Ajustes
                  <input type="file" accept=".json" onChange={handleImportSettings} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-Terretacode-elements-textPrimary mb-2">Gestion API Keys</h4>
              <p className="text-sm text-Terretacode-elements-textSecondary mb-4">
                Importa claves API desde un archivo JSON o descarga una plantilla para completar con tus claves.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleExportApiKeyTemplate}
                  className="px-4 py-2 bg-Terretacode-elements-button-primary-background hover:bg-Terretacode-elements-button-primary-backgroundHover text-Terretacode-elements-textPrimary rounded-lg transition-colors"
                >
                  Descargar Plantilla
                </button>
                <label className="px-4 py-2 bg-Terretacode-elements-button-primary-background hover:bg-Terretacode-elements-button-primary-backgroundHover text-Terretacode-elements-textPrimary rounded-lg transition-colors cursor-pointer">
                  Importar API Keys
                  <input type="file" accept=".json" onChange={handleImportApiKeys} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
