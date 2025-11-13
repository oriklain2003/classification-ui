import React from 'react';

interface ProbabilityBarsProps {
  probabilities: {
    birds: number;
    uav: number;
    aircraft: number;
    missile: number;
  };
}

const ProbabilityBars: React.FC<ProbabilityBarsProps> = ({ probabilities }) => {
  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };

  const getBarColor = (value: number, isHighest: boolean): string => {
    if (isHighest) return '#2b8cee';
    return '#6b7280';
  };

  const getTextColor = (value: number, isHighest: boolean): string => {
    if (isHighest) return '#2b8cee';
    return '#9ca3af';
  };

  // Find the highest probability
  const maxValue = Math.max(probabilities.birds, probabilities.uav, probabilities.aircraft, probabilities.missile);

  const categories = [
    { 
      name: 'Unmanned Aerial Vehicle', 
      value: probabilities.uav,
      isHighest: probabilities.uav === maxValue
    },
    { 
      name: 'Aircraft', 
      value: probabilities.aircraft,
      isHighest: probabilities.aircraft === maxValue
    },
    { 
      name: 'Missile', 
      value: probabilities.missile,
      isHighest: probabilities.missile === maxValue
    },
    { 
      name: 'Birds', 
      value: probabilities.birds,
      isHighest: probabilities.birds === maxValue
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {categories.map((category) => (
        <div key={category.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '16px'
          }}>
            <p style={{
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              margin: 0,
              lineHeight: '1.4'
            }}>
              {category.name}
            </p>
            <p style={{
              color: getTextColor(category.value, category.isHighest),
              fontSize: '14px',
              fontWeight: category.isHighest ? '600' : '400',
              margin: 0,
              lineHeight: '1.4'
            }}>
              {formatPercentage(category.value)}
            </p>
          </div>
          
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#374151',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                backgroundColor: getBarColor(category.value, category.isHighest),
                borderRadius: '9999px',
                width: `${category.value * 100}%`,
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProbabilityBars;
