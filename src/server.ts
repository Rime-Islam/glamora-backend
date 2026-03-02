import { Server } from 'http';
import app from './app';
import { config } from './app/configs';

async function main() {
    try {
        const server: Server = app.listen(config.port, () => {
            console.log(`Server is running on port:`, config.port);
        });
    } catch (err) {
        console.error("Server failed to start:", err);
        process.exit(1); 
    }
}

main();