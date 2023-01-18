export interface IAppConfiguration {
  port: number;
  baseUrl: string;
}

export default (): IAppConfiguration => ({
  port: parseInt(process.env.API_PORT, 10) || 3001,
  baseUrl: process.env.BASE_URL,
});
