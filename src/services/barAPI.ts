import type { Bar } from '../types/bar';

export interface APIError extends Error {
  code: 'FETCH_ERROR' | 'PARSE_ERROR' | 'NETWORK_ERROR';
  retryable: boolean;
}

class MockBarAPI {
  private bars: Bar[] = [];
  private initialized = false;

  private async loadBars(): Promise<void> {
    if (this.initialized) return;

    try {
      const response = await fetch('/data/bars.json');
      if (!response.ok) {
        const error = new Error(`Failed to load bars data: ${response.statusText}`) as APIError;
        error.code = 'FETCH_ERROR';
        error.retryable = true;
        throw error;
      }

      const data = await response.json();
      this.bars = data;
      this.initialized = true;
    } catch (error) {
      if (error instanceof Error) {
        const apiError = error as APIError;
        if (!apiError.code) {
          apiError.code = error.name === 'SyntaxError' ? 'PARSE_ERROR' : 'NETWORK_ERROR';
          apiError.retryable = apiError.code !== 'PARSE_ERROR';
        }
        throw apiError;
      }
      throw error;
    }
  }

  async getBars(): Promise<Bar[]> {
    await this.loadBars();
    await this.delay(this.getRandomDelay());

    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      const error = new Error('Network timeout') as APIError;
      error.code = 'NETWORK_ERROR';
      error.retryable = true;
      throw error;
    }

    return [...this.bars];
  }

  async getBarById(id: string): Promise<Bar | null> {
    await this.loadBars();
    await this.delay(this.getRandomDelay());

    // Simulate random failures (3% chance)
    if (Math.random() < 0.03) {
      const error = new Error('Service unavailable') as APIError;
      error.code = 'FETCH_ERROR';
      error.retryable = true;
      throw error;
    }

    const bar = this.bars.find(bar => bar.id === id);
    return bar ? { ...bar } : null;
  }

  private getRandomDelay(): number {
    return Math.floor(Math.random() * 200) + 150; // 150-350ms
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const barAPI = new MockBarAPI();

// Retry utility with exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> {
  let lastError: APIError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as APIError;

      if (!lastError.retryable || attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError!;
}