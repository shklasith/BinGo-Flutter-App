import { ClassificationResult } from '../types/domain';

export const calculatePoints = (classification: ClassificationResult): number => {
  switch (classification.category) {
    case 'Recyclable':
    case 'Compost':
    case 'E-Waste':
      return 10;
    case 'Special':
      return 15;
    case 'Landfill':
      return 2;
    default:
      return 0;
  }
};

export const impactIncrementsFor = (classification: ClassificationResult) => {
  switch (classification.category) {
    case 'Recyclable':
      return { plasticDiverted: 1, co2Reduced: 0.5 };
    case 'Compost':
      return { plasticDiverted: 0, co2Reduced: 0.2 };
    case 'E-Waste':
      return { plasticDiverted: 0, co2Reduced: 1.0 };
    default:
      return { plasticDiverted: 0, co2Reduced: 0 };
  }
};
