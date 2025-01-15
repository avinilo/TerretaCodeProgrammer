import React from 'react';
import { Switch } from '~/components/ui/Switch';
import { PromptLibrary } from '~/lib/common/prompt-library';
import { useSettings } from '~/lib/hooks/useSettings';

export default function FeaturesTab() {
  const {
    debug,
    enableDebugMode,
    isLocalModel,
    enableLocalModels,
    enableEventLogs,
    isLatestBranch,
    enableLatestBranch,
    promptId,
    setPromptId,
    autoSelectTemplate,
    setAutoSelectTemplate,
    enableContextOptimization,
    contextOptimizationEnabled,
  } = useSettings();

  const handleToggle = (enabled: boolean) => {
    enableDebugMode(enabled);
    enableEventLogs(enabled);
  };

  return (
    <div className="p-4 bg-Terretacode-elements-bg-depth-2 border border-Terretacode-elements-borderColor rounded-lg mb-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-Terretacode-elements-textPrimary mb-4">Funciones Opcionales</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-Terretacode-elements-textPrimary">Funciones de Depuración</span>
            <Switch className="ml-auto" checked={debug} onCheckedChange={handleToggle} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-Terretacode-elements-textPrimary">Usar la Rama Principal</span>
              <p className="text-xs text-Terretacode-elements-textTertiary">
                Buscar actualizaciones en la rama principal en lugar de la versión estable.
              </p>
            </div>
            <Switch className="ml-auto" checked={isLatestBranch} onCheckedChange={enableLatestBranch} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-Terretacode-elements-textPrimary">
                Seleccionar automáticamente la plantilla de código.
              </span>
              <p className="text-xs text-Terretacode-elements-textTertiary">
                Permite que Terretacode seleccione la mejor plantilla inicial para tu proyecto.
              </p>
            </div>
            <Switch className="ml-auto" checked={autoSelectTemplate} onCheckedChange={setAutoSelectTemplate} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-Terretacode-elements-textPrimary">Usar Optimización de Contexto</span>
              <p className="text-sm text-Terretacode-elements-textSecondary">
                Redacta el contenido del archivo desde el chat y coloca el contenido más reciente del archivo en el
                mensaje del sistema.
              </p>
            </div>
            <Switch
              className="ml-auto"
              checked={contextOptimizationEnabled}
              onCheckedChange={enableContextOptimization}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 border-t border-Terretacode-elements-borderColor pt-4">
        <h3 className="text-lg font-medium text-Terretacode-elements-textPrimary mb-4">Funciones Experimentales</h3>
        <p className="text-sm text-Terretacode-elements-textSecondary mb-10">
          Aviso: Las Funciones Experimentales pueden ser inestables y están sujetas a cambios.
        </p>
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-Terretacode-elements-textPrimary">Proveedor Experimental</span>
            <Switch className="ml-auto" checked={isLocalModel} onCheckedChange={enableLocalModels} />
          </div>
          <p className="text-xs text-Terretacode-elements-textTertiary mb-4">
            Habilitar Proveedores Experimentales como Ollama, LMStudio y OpenAILike.
          </p>
        </div>
        <div className="flex items-start justify-between pt-4 mb-2 gap-2">
          <div className="flex-1 max-w-[200px]">
            <span className="text-Terretacode-elements-textPrimary">Biblioteca Prompt</span>
            <p className="text-xs text-Terretacode-elements-textTertiary mb-4">
              Elige un mensaje de la biblioteca para usarlo como mensaje del sistema.
            </p>
          </div>
          <select
            value={promptId}
            onChange={(e) => setPromptId(e.target.value)}
            className="flex-1 p-2 ml-auto rounded-lg border border-Terretacode-elements-borderColor bg-Terretacode-elements-prompt-background text-Terretacode-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-Terretacode-elements-focus transition-all text-sm min-w-[100px]"
          >
            {PromptLibrary.getList().map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
