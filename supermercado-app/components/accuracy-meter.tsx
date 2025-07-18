import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AccuracyMeterProps {
  accuracy: number;
  service: string;
  className?: string;
}

export function AccuracyMeter({ accuracy, service, className = '' }: AccuracyMeterProps) {
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
    if (acc >= 90) return 'default';
    if (acc >= 80) return 'secondary';
    if (acc >= 70) return 'outline';
    return 'destructive';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            {/* Accuracy Bar */}
            <div className="flex items-center gap-1">
              <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getAccuracyColor(accuracy)}`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{accuracy}%</span>
            </div>
            
            {/* Accuracy Badge */}
            <Badge variant={getBadgeVariant(accuracy)} className="text-xs">
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
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AccuracyMeter;
