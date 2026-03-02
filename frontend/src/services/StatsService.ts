/**
 * Servicio encargado de obtener estadísticas generales del sistema.
 */
import Stats from '../models/stats/Stats';
import apiService from './ApiService';

class StatsService {
  /**
   * Obtiene un resumen de estadísticas (usuarios, cursos, lecciones).
   */
  async getStats(): Promise<Stats> {
    return (await apiService.get<Stats>('/stats')).data;
  }
}

const statsService = new StatsService();
export default statsService;
