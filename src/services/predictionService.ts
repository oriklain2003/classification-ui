export interface PredictionRequest {
  data: Array<{
    lat: number;
    lon: number;
    alt: number;
    speed: number;
    heading: number;
  }>;
}

export interface PredictionResponse {
  probabilities: {
    birds: number;
    uav: number;
    aircraft: number;
    missile: number;
  };
  best_guess: string;
  reasoning: string;
}

export class PredictionService {
  private static readonly BASE_URL = 'http://localhost:8000';

  static async predict(data: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Prediction API error:', error);
      throw error;
    }
  }
}
