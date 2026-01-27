import { useState } from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';
import { Button } from '@/app/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { Eye, Plus, Minus, Moon, Sun, Contrast, Settings } from 'lucide-react';
import { Separator } from '@/app/components/ui/separator';

export function AccessibilityToolbar() {
  // Verificar se o SettingsProvider está disponível
  let settings, updateSetting, increaseFontSize, decreaseFontSize;
  
  try {
    const settingsContext = useSettings();
    settings = settingsContext.settings;
    updateSetting = settingsContext.updateSetting;
    increaseFontSize = settingsContext.increaseFontSize;
    decreaseFontSize = settingsContext.decreaseFontSize;
  } catch (error) {
    // Se o provider não está disponível, não renderiza o componente
    return null;
  }
  
  const [open, setOpen] = useState(false);

  const fontSizeLabels = {
    small: 'A-',
    medium: 'A',
    large: 'A+',
    xlarge: 'A++'
  };

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-40">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            title="Acessibilidade"
            aria-label="Menu de acessibilidade"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="end">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Acesso Rápido</h3>
              <p className="text-xs text-muted-foreground">
                Ajustes rápidos de acessibilidade
              </p>
            </div>

            <Separator />

            {/* Tamanho de Fonte */}
            <div>
              <p className="text-sm font-medium mb-2">Tamanho do Texto</p>
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize === 'small'}
                  title="Diminuir fonte (Ctrl + -)"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  Diminuir
                </Button>
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
                  {fontSizeLabels[settings.fontSize]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={settings.fontSize === 'xlarge'}
                  title="Aumentar fonte (Ctrl + +)"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Aumentar
                </Button>
              </div>
            </div>

            <Separator />

            {/* Modo Escuro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.darkMode ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Modo Escuro</span>
              </div>
              <Button
                variant={settings.darkMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('darkMode', !settings.darkMode)}
                title="Alternar modo escuro (Ctrl + D)"
              >
                {settings.darkMode ? 'Ativado' : 'Desativado'}
              </Button>
            </div>

            {/* Alto Contraste */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <span className="text-sm font-medium">Alto Contraste</span>
              </div>
              <Button
                variant={settings.highContrast ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
              >
                {settings.highContrast ? 'Ativado' : 'Desativado'}
              </Button>
            </div>

            <Separator />

            {/* Link para página completa de configurações */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setOpen(false);
                window.location.href = '/configuracoes';
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Mais Configurações
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}