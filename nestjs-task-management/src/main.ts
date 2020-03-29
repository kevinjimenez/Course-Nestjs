import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from "@nestjs/common";
import * as config from 'config'

async function bootstrap() {
    // NODE_ENV

    const serverConfig = config.get('server');
    const logger = new Logger('bootstrap');
    const app = await NestFactory.create(AppModule);

    if (process.env.NODE_ENV === 'development') {
        app.enableCors();
    }

    // process.env.PORT -> VARIABLES DE ENTORNO (si el puerto no se encuentra definido) coje el de la configuracion
    const port = process.env.PORT || serverConfig.port;
    await app.listen(port);
    logger.log(`Aplication listening on port ${port}`)
}

bootstrap();
