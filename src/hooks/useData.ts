import { DataProvider } from '../core/ports';
import { MockDataProvider } from '../core/mockProvider';

// Global data provider instance
// TODO: Replace MockDataProvider with Firebase implementation
const dataProvider: DataProvider = new MockDataProvider();

// Hook to access data provider - makes it easy to swap implementations later
export const useData = () => {
  return dataProvider;
};
