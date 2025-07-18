import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AccuracyMeterProps {
  accuracy: number;
  service: string;
  className?: string;
  isProgressivelyEnhanced?: boolean;
}

export function AccuracyMeter({ accuracy, service, className = '', isProgressivelyEnhanced = false }: AccuracyMeterProps) {
  // Calculate color based on accuracy
  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return 'bg-green-500';
    if (acc >= 80) return 'bg-yellow-500';
    if (acc >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getAccuracyText = (acc: number) => {
    if (acc >= 90) return 'Excelente';
    if (acc >= 80) return 'Boa';
    if (acc >= 70) return 'Razoável';
    return 'Baixa';
  };

  const getBadgeVariant = (acc: number) => {
    if (acc >= 90) return 'secondary';
    if (acc >= 80) return 'secondary';
    if (acc >= 70) return 'outline';
    return 'outline';
  };

  const getBadgeColor = (acc: number) => {
    if (acc >= 90) return 'bg-green-50 text-green-700 border-green-200';
    if (acc >= 80) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (acc >= 70) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className} ${isProgressivelyEnhanced ? 'animate-pulse' : ''}`}>
            {/* Accuracy Bar */}
            <div className="flex items-center gap-1">
              <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getAccuracyColor(accuracy)}`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{accuracy}%</span>
            </div>
            
            {/* Accuracy Badge */}
            <Badge variant={getBadgeVariant(accuracy)} className={`text-xs ${getBadgeColor(accuracy)}`}>
              {getAccuracyText(accuracy)}
            </Badge>
          </div>
        </TooltipTrigger>
        
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">Precisão da Rota</p>
            <p className="text-gray-600">Serviço: {service}</p>
            <p className="text-gray-600">Precisão: {accuracy}%</p>
            <div className="mt-2 text-xs">
              <p>• 100%: Google Maps Crawler (Automático)</p>
              <p>• 95%: Google Maps Directions</p>
              <p>• 92%: MapBox Directions</p>
              <p>• 90%: HERE Maps</p>
              <p>• 88%: TomTom Routing</p>
              <p>• 85%: OSRM Demo</p>
              <p>• 82%: OSRM Germany</p>
              <p>• 78%: MapQuest Directions</p>
              <p>• 75%: GraphHopper</p>
              <p>• 70%: Enhanced Calculation</p>
            </div>
            <div className="mt-2 text-xs text-gray-500 border-t pt-2">
              <p>Rotas aprimoradas automaticamente com precisão 100% do Google Maps em tempo real.</p>
              {isProgressivelyEnhanced && (
                <p className="text-blue-600 mt-1">✓ Esta rota foi aprimorada recentemente!</p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AccuracyMeter;
