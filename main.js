const BedrockBot = require('./src/BedrockBot');
const readline = require('readline');
const path = require('path');

/**
 * Main entry point for the Bedrock Bot
 */
class BotApplication {
    constructor() {
        this.bot = null;
        this.rl = null;
        this.setupGracefulShutdown();
        this.setupCommandInterface();
    }

    /**
     * Setup graceful shutdown handlers
     */
    setupGracefulShutdown() {
        const gracefulShutdown = async (signal) => {
            console.log(`\nReceived ${signal}, shutting down gracefully...`);

            if (this.rl) {
                this.rl.close();
            }

            if (this.bot) {
                await this.bot.stop();
            }

            process.exit(0);
        };

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGUSR2', gracefulShutdown); // For nodemon
    }

    /**
     * Setup command line interface
     */
    setupCommandInterface() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        this.rl.on('line', this.handleCommand.bind(this));
        this.rl.on('close', () => {
            console.log('\nCommand interface closed');
        });
    }

    /**
     * Handle command line input
     * @param {string} input - User input
     */
    async handleCommand(input) {
        const command = input.trim();

        if (!command) {
            this.rl.prompt();
            return;
        }

        try {
            await this.handleChatMessage(command);
        } catch (error) {
            console.error(`Command error: ${error.message}`);
        }

        this.rl.prompt();
    }

    /**
     * Handle chat messages
     * @param {string} message - Chat message
     */
    async handleChatMessage(message) {
        if (this.bot && this.bot.isConnected) {
            await this.bot.chat(message);
        } else {
            console.log('Bot is not connected. Cannot send chat message.');
        }
    }

    /**
     * Start the bot application
     */
    async start() {
        try {
            console.log('Starting Bedrock Bot Application...');

            // Create and start bot
            this.bot = new BedrockBot('./config.json');

            // Setup bot event listeners
            this.setupBotEventListeners();

            // Start the bot
            await this.bot.start();

            // Start command prompt
            this.rl.prompt();

        } catch (error) {
            console.error(`Failed to start bot application: ${error.message}`);
            process.exit(1);
        }
    }

    /**
     * Setup bot event listeners for UI feedback
     */
    setupBotEventListeners() {
        if (!this.bot) return;

        this.bot.on('spawn', () => {
            console.log('✅ Bot spawned successfully');
            this.rl.prompt();
        });

        this.bot.on('disconnect', (reason) => {
            console.log(`❌ Bot disconnected: ${reason}`);
            this.rl.prompt();
        });

        this.bot.on('error', (error) => {
            console.log(`❌ Bot error: ${error.message}`);
            this.rl.prompt();
        });

        this.bot.on('reconnectAttempt', (attempt) => {
            console.log(`🔄 Reconnect attempt ${attempt}`);
            this.rl.prompt();
        });

        this.bot.on('message', (data) => {
            // Message already logged by bot logger
            this.rl.prompt();
        });
    }
}

// Start the application
if (require.main === module) {
    const app = new BotApplication();
    app.start().catch(console.error);
}

module.exports = BotApplication;