import React from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';
import {
  Moon,
  Sun,
  Type,
  Minus,
  Plus,
  Eye,
  Volume2,
  Contrast,
  Zap,
  RotateCcw,
  Languages,
  Check,
  Bell,
  VolumeX,
  Download,
  Upload,
  Monitor,
  Wifi,
  WifiOff,
  Mail,
  Palette,
  AlignLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { Slider } from '@/app/components/ui/slider';
import { toast } from 'sonner';

export function SettingsPage() {
  const { settings, updateSetting, resetSettings, increaseFontSize, decreaseFontSize } = useSettings();

  const fontSizeLabels = {
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
    xlarge: 'Extra Grande'
  };

  const lineHeightLabels = {
    compact: 'Compacto',
    normal: 'Normal',
    relaxed: 'Confortável'
  };

  const colorThemes = [
    { id: 'default', name: 'Padrão', color: 'bg-blue-600' },
    { id: 'blue', name: 'Azul', color: 'bg-blue-500' },
    { id: 'green', name: 'Verde', color: 'bg-green-500' },
    { id: 'purple', name: 'Roxo', color: 'bg-purple-500' },
    { id: 'orange', name: 'Laranja', color: 'bg-orange-500' }
  ];

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'configuracoes-acessibilidade.json';
    link.click();
    toast.success('Configurações exportadas com sucesso!');
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            Object.keys(imported).forEach(key => {
              updateSetting(key, imported[key]);
            });
            toast.success('Configurações importadas com sucesso!');
          } catch (error) {
            toast.error('Erro ao importar configurações');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência e acessibilidade
        </p>
      </div>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Aparência
          </CardTitle>
          <CardDescription>
            Configure a aparência visual da aplicação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tema Automático */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                <label className="font-medium">Tema Automático</label>
              </div>
              <p className="text-sm text-muted-foreground">
                Segue as preferências de tema do seu sistema
              </p>
            </div>
            <Switch
              checked={settings.autoTheme}
              onCheckedChange={(checked) => {
                updateSetting('autoTheme', checked);
                if (checked) {
                  toast.info('Tema seguirá as preferências do sistema');
                }
              }}
            />
          </div>

          <Separator />

          {/* Modo Escuro */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {settings.darkMode ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                <label className="font-medium">Modo Escuro</label>
                {settings.autoTheme && (
                  <Badge variant="secondary" className="text-xs">Auto</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Reduz o brilho da tela em ambientes com pouca luz
              </p>
            </div>
            <Switch
              checked={settings.darkMode}
              disabled={settings.autoTheme}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
          </div>

          <Separator />

          {/* Alto Contraste */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Contrast className="w-5 h-5" />
                <label className="font-medium">Alto Contraste</label>
              </div>
              <p className="text-sm text-muted-foreground">
                Aumenta o contraste entre textos e fundo
              </p>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tema de Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Tema de Cores
          </CardTitle>
          <CardDescription>
            Escolha um esquema de cores para a interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  updateSetting('colorTheme', theme.id);
                  toast.success(`Tema ${theme.name} aplicado!`);
                }}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  ${settings.colorTheme === theme.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${theme.color}`}></div>
                  <div>
                    <span className="font-medium">{theme.name}</span>
                    {settings.colorTheme === theme.id && (
                      <Check className="w-4 h-4 text-primary inline-block ml-2" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tamanho de Fonte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Tamanho do Texto
          </CardTitle>
          <CardDescription>
            Ajuste o tamanho da fonte para melhor legibilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">Tamanho Atual</p>
              <Badge variant="secondary" className="text-sm">
                {fontSizeLabels[settings.fontSize]}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseFontSize}
                disabled={settings.fontSize === 'small'}
                title="Diminuir fonte (Ctrl + -)"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseFontSize}
                disabled={settings.fontSize === 'xlarge'}
                title="Aumentar fonte (Ctrl + +)"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview do texto */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm mb-2 text-muted-foreground">Visualização:</p>
            <p className="font-medium">
              Este é um texto de exemplo para visualizar o tamanho da fonte.
            </p>
            <p className="text-sm mt-2">
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Espaçamento de Linha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlignLeft className="w-5 h-5" />
            Espaçamento de Linha
          </CardTitle>
          <CardDescription>
            Ajuste o espaçamento entre linhas para facilitar a leitura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'compact', name: 'Compacto', desc: 'Menos espaço' },
              { id: 'normal', name: 'Normal', desc: 'Padrão' },
              { id: 'relaxed', name: 'Confortável', desc: 'Mais espaço' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => updateSetting('lineHeight', option.id)}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  ${settings.lineHeight === option.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-xs text-muted-foreground">{option.desc}</p>
                  </div>
                  {settings.lineHeight === option.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Movimento e Animações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Animações e Movimento
          </CardTitle>
          <CardDescription>
            Configure como os elementos se movem na tela
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="font-medium">Reduzir Animações</label>
              <p className="text-sm text-muted-foreground">
                Minimiza movimentos e transições para pessoas sensíveis a movimento
              </p>
            </div>
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tecnologias Assistivas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Tecnologias Assistivas
          </CardTitle>
          <CardDescription>
            Otimizações para leitores de tela e outras ferramentas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="font-medium">Modo Leitor de Tela</label>
              <p className="text-sm text-muted-foreground">
                Otimiza a navegação para leitores de tela (NVDA, JAWS, etc.)
              </p>
            </div>
            <Switch
              checked={settings.screenReader}
              onCheckedChange={(checked) => updateSetting('screenReader', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notificações Sonoras */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {settings.soundNotifications ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <label className="font-medium">Notificações Sonoras</label>
              </div>
              <p className="text-sm text-muted-foreground">
                Reproduz sons ao receber notificações
              </p>
            </div>
            <Switch
              checked={settings.soundNotifications}
              onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
            />
          </div>

          <Separator />

          {/* Notificações Push */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <label className="font-medium">Notificações Push</label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receba alertas no desktop sobre vagas e cursos
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>

          <Separator />

          {/* Notificações por Email */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <label className="font-medium">Notificações por Email</label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receba resumos e atualizações por email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Economia de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {settings.dataSaver ? (
              <WifiOff className="w-5 h-5" />
            ) : (
              <Wifi className="w-5 h-5" />
            )}
            Economia de Dados
          </CardTitle>
          <CardDescription>
            Reduza o consumo de dados da aplicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="font-medium">Modo Economia de Dados</label>
              <p className="text-sm text-muted-foreground">
                Reduz qualidade de imagens e desativa carregamento automático
              </p>
            </div>
            <Switch
              checked={settings.dataSaver}
              onCheckedChange={(checked) => updateSetting('dataSaver', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Idioma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Idioma
          </CardTitle>
          <CardDescription>
            Selecione o idioma da interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
              { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
              { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
              { code: 'fr-FR', name: 'Français', flag: '🇫🇷' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => updateSetting('language', lang.code)}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  ${settings.language === lang.code
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {settings.language === lang.code && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atalhos de Teclado */}
      <Card>
        <CardHeader>
          <CardTitle>Atalhos de Teclado</CardTitle>
          <CardDescription>
            Navegue mais rápido usando o teclado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>Aumentar fonte</span>
              <Badge variant="outline">Ctrl + +</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>Diminuir fonte</span>
              <Badge variant="outline">Ctrl + -</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>Alternar modo escuro</span>
              <Badge variant="outline">Ctrl + D</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>Ir para navegação</span>
              <Badge variant="outline">Alt + N</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>Ir para conteúdo principal</span>
              <Badge variant="outline">Alt + C</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exportar/Importar Configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Backup de Configurações
          </CardTitle>
          <CardDescription>
            Salve ou restaure suas preferências
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={exportSettings}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Configurações
            </Button>
            <Button
              variant="outline"
              onClick={importSettings}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Reset */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <RotateCcw className="w-5 h-5" />
            Restaurar Padrões
          </CardTitle>
          <CardDescription>
            Reverter todas as configurações para os valores padrão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => {
              resetSettings();
              toast.success('Configurações restauradas!');
            }}
            className="w-full md:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar Configurações Padrão
          </Button>
        </CardContent>
      </Card>

      {/* Informações */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>💡 Dica:</strong> Suas preferências são salvas automaticamente e 
          permanecerão aplicadas mesmo após fechar o aplicativo.
        </p>
      </div>
    </div>
  );
}