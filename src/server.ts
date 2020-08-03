import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import Config from './config';
import Logger from './logger';

class Server {
  private static instace: Hapi.Server;

  public static async start(): Promise<void> {
    Server.instace = Hapi.server({
      port: Config.get('port'),
      host: '0.0.0.0',
    });

    const swaggerOptions = {
      info: {
        title: 'Flights API Documentation',
        version: Config.get('app_version'),
      },
      documentationPath: '/api-docs',
    };

    await Server.instace.register([
      { plugin: Inert },
      { plugin: Vision },
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);


    await Server.instace.start();

    Logger.info(`Application running on ${Server.instace.info.uri}`);
  }

  public static async stop(): Promise<void> {
    await Server.instace.stop({ timeout: Number(Config.get('graceful_shutdown_timeout')) });
  }

  public static getServer(): Hapi.Server {
    return Server.instace;
  }
}

export default Server;
