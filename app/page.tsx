import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sword, Shield, Heart, Clock, Users } from 'lucide-react';

const UnitInput = ({ label, amount, level, onAmountChange, onLevelChange }) => (
  <div className="grid grid-cols-2 gap-2 mb-4">
    <div>
      <label className="text-sm">{label} - Cantidad</label>
      <Input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => onAmountChange(parseInt(e.target.value) || 0)}
      />
    </div>
    <div>
      <label className="text-sm">Nivel</label>
      <Input
        type="number"
        min="1"
        value={level}
        onChange={(e) => onLevelChange(parseInt(e.target.value) || 1)}
      />
    </div>
  </div>
);

const ResourceInput = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="text-sm">{label}</label>
    <Input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
    />
  </div>
);

const BattleCalculator = () => {
  const [playerForces, setPlayerForces] = useState({
    infantry: { amount: 0, level: 1 },
    archers: { amount: 0, level: 1 },
    cavalry: { amount: 0, level: 1 },
    heroes: [0, 0, 0, 0, 0],
    towerLevel: 0
  });

  const [enemyForces, setEnemyForces] = useState({
    infantry: { amount: 0, level: 1 },
    archers: { amount: 0, level: 1 },
    cavalry: { amount: 0, level: 1 },
    heroes: [0, 0, 0, 0, 0],
    towerLevel: 0,
    resources: {
      food: 0,
      wood: 0,
      gold: 0,
      stone: 0
    }
  });

  const [analysis, setAnalysis] = useState(null);

  const calculatePower = (forces) => {
    const BASE_POWER = {
      infantry: 40,
      archers: 35,
      cavalry: 60
    };

    let totalPower = 0;

    // Calcular poder de unidades
    Object.entries(BASE_POWER).forEach(([type, basePower]) => {
      const unit = forces[type];
      totalPower += unit.amount * basePower * Math.pow(1.2, unit.level - 1);
    });

    // Calcular poder de héroes
    const heroPower = forces.heroes.reduce((sum, level) => sum + level * 150, 0);

    // Agregar poder de torres
    const towerPower = forces.towerLevel * 200;

    return totalPower + heroPower + towerPower;
  };

  const analyzeBattle = () => {
    const playerPower = calculatePower(playerForces);
    const enemyPower = calculatePower(enemyForces);
    const powerRatio = playerPower / enemyPower;
    
    const totalResources = Object.values(enemyForces.resources)
      .reduce((sum, value) => sum + value, 0);

    const estimatedLosses = {
      min: Math.max(0, Math.round((1 - powerRatio) * 100)),
      max: Math.max(0, Math.round((1.2 - powerRatio) * 100))
    };

    setAnalysis({
      playerPower,
      enemyPower,
      powerRatio,
      estimatedLosses,
      totalResources,
      isProfitable: powerRatio > 0.8 && (totalResources / enemyPower) > 0.5
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Calculadora de Batallas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tus Fuerzas */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Tus Fuerzas</h3>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Unidades</h4>
              <UnitInput
                label="Infantería"
                amount={playerForces.infantry.amount}
                level={playerForces.infantry.level}
                onAmountChange={(val) => setPlayerForces(prev => ({
                  ...prev,
                  infantry: { ...prev.infantry, amount: val }
                }))}
                onLevelChange={(val) => setPlayerForces(prev => ({
                  ...prev,
                  infantry: { ...prev.infantry, level: val }
                }))}
              />
              <UnitInput
                label="Arqueros"
                amount={playerForces.archers.amount}
                level={playerForces.archers.level}
                onAmountChange={(val) => setPlayerForces(prev => ({
                  ...prev,
                  archers: { ...prev.archers, amount: val }
                }))}
                onLevelChange={(val) => setPlayerForces(prev => ({
                  ...prev,
                  archers: { ...prev.archers, level: val }
                }))}
              />
              <UnitInput
                label="Caballería"
                amount={playerForces.cavalry.amount}
                level={playerForces.cavalry.level}
                onAmountChange={(val) => setPlayerForces(prev => ({
                  ...prev,
                  cavalry: { ...prev.cavalry, amount: val }
                }))}
                onLevelChange={(val) => setPlayerForces(prev => ({
                  ...prev,
                  cavalry: { ...prev.cavalry, level: val }
                }))}
              />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Héroes y Torres</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {playerForces.heroes.map((level, index) => (
                  <div key={index}>
                    <label className="text-sm">Héroe {index + 1}</label>
                    <Input
                      type="number"
                      min="0"
                      value={level}
                      onChange={(e) => {
                        const newHeroes = [...playerForces.heroes];
                        newHeroes[index] = parseInt(e.target.value) || 0;
                        setPlayerForces(prev => ({ ...prev, heroes: newHeroes }));
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm">Nivel de Torre</label>
                <Input
                  type="number"
                  min="0"
                  value={playerForces.towerLevel}
                  onChange={(e) => setPlayerForces(prev => ({
                    ...prev,
                    towerLevel: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Fuerzas Enemigas */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Fuerzas Enemigas</h3>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Unidades</h4>
              <UnitInput
                label="Infantería"
                amount={enemyForces.infantry.amount}
                level={enemyForces.infantry.level}
                onAmountChange={(val) => setEnemyForces(prev => ({
                  ...prev,
                  infantry: { ...prev.infantry, amount: val }
                }))}
                onLevelChange={(val) => setEnemyForces(prev => ({
                  ...prev,
                  infantry: { ...prev.infantry, level: val }
                }))}
              />
              <UnitInput
                label="Arqueros"
                amount={enemyForces.archers.amount}
                level={enemyForces.archers.level}
                onAmountChange={(val) => setEnemyForces(prev => ({
                  ...prev,
                  archers: { ...prev.archers, amount: val }
                }))}
                onLevelChange={(val) => setEnemyForces(prev => ({
                  ...prev,
                  archers: { ...prev.archers, level: val }
                }))}
              />
              <UnitInput
                label="Caballería"
                amount={enemyForces.cavalry.amount}
                level={enemyForces.cavalry.level}
                onAmountChange={(val) => setEnemyForces(prev => ({
                  ...prev,
                  cavalry: { ...prev.cavalry, amount: val }
                }))}
                onLevelChange={(val) => setEnemyForces(prev => ({
                  ...prev,
                  cavalry: { ...prev.cavalry, level: val }
                }))}
              />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Héroes y Torres</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {enemyForces.heroes.map((level, index) => (
                  <div key={index}>
                    <label className="text-sm">Héroe {index + 1}</label>
                    <Input
                      type="number"
                      min="0"
                      value={level}
                      onChange={(e) => {
                        const newHeroes = [...enemyForces.heroes];
                        newHeroes[index] = parseInt(e.target.value) || 0;
                        setEnemyForces(prev => ({ ...prev, heroes: newHeroes }));
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm">Nivel de Torre</label>
                <Input
                  type="number"
                  min="0"
                  value={enemyForces.towerLevel}
                  onChange={(e) => setEnemyForces(prev => ({
                    ...prev,
                    towerLevel: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Recursos</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(enemyForces.resources).map(([resource, amount]) => (
                  <ResourceInput
                    key={resource}
                    label={resource.charAt(0).toUpperCase() + resource.slice(1)}
                    value={amount}
                    onChange={(val) => setEnemyForces(prev => ({
                      ...prev,
                      resources: { ...prev.resources, [resource]: val }
                    }))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={analyzeBattle}>Analizar Batalla</Button>
        </div>

        {analysis && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-4">Análisis de Batalla</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>Tu poder: {Math.round(analysis.playerPower).toLocaleString()}</p>
                <p>Poder enemigo: {Math.round(analysis.enemyPower).toLocaleString()}</p>
                <p>Ratio de poder: {(analysis.powerRatio * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p>Pérdidas estimadas: {analysis.estimatedLosses.min}% - {analysis.estimatedLosses.max}%</p>
                <p>Recursos totales: {analysis.totalResources.toLocaleString()}</p>
                <p className={analysis.isProfitable ? 'text-green-600' : 'text-red-600'}>
                  {analysis.isProfitable ? 'Batalla rentable' : 'Batalla no recomendada'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BattleCalculator;
