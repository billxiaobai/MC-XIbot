const BotComponent = require('../BotComponent');

class AutoReconnect extends BotComponent {
    constructor(bot, config, logger) {
        super('autoReconnect', bot, config, logger);
        this.retryCount = 0;
        this.maxRetries = this.config.get('features.autoReconnect.maxRetries', 10);
        this.delay = this.config.get('features.autoReconnect.delay', 5000);
        this.isReconnecting = false;
    }

    async onEnable() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.bot) {
            this.bot.on('disconnect', this.handleDisconnect.bind(this));
            this.bot.on('error', this.handleError.bind(this));
            this.bot.on('spawn', this.handleLogin.bind(this));
        }
    }

    handleDisconnect(reason) {
        if (this.isReconnecting) return;

        this.logger.warn(`Bot disconnected: ${reason || 'Unknown reason'}`);
        this.attemptReconnect(reason instanceof Error ? reason : new Error(reason || 'Unknown reason'));
    }

    handleError(error) {
        if (this.isReconnecting) return;
        this.logger.error(`Bot error detected by AutoReconnect: ${error.message}`);
        if (!this.bot.isConnected && (
            error.message.includes('Connect timed out') ||
            error.message.includes('ETIMEDOUT') ||
            error.message.includes('ECONNREFUSED') ||
            error.message.includes('Connection failed') ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ECONNREFUSED'
        )) {
            this.attemptReconnect(error);
        }
    }

    handleLogin() {
        this.logger.info('Bot successfully spawned/connected');
        this.retryCount = 0; // Reset retry count on successful connection
        this.isReconnecting = false;
    }

    // lastError 參數可選
    attemptReconnect(lastError = null) {
        if (this.retryCount >= this.maxRetries) {
            this.logger.error(`Maximum retry attempts (${this.maxRetries}) reached. Stopping bot.`);
            this.emit('maxRetriesReached');
            // Don't call stop here, just disable reconnection
            this.isReconnecting = false;
            return;
        }

        this.isReconnecting = true;
        this.retryCount++;

        this.logger.info(`Attempting to reconnect (${this.retryCount}/${this.maxRetries}) in ${this.delay}ms...`);

        this.createTimeout(async () => {
            try {
                // 傳遞 lastError 給 BedrockBot
                this.emit('reconnectAttempt', this.retryCount, lastError);
            } catch (error) {
                this.logger.error(`Reconnect attempt ${this.retryCount} failed: ${error.message}`);
                setTimeout(() => {
                    this.attemptReconnect(error);
                }, this.delay);
            }
        }, this.delay);
    }

    resetRetryCount() {
        this.retryCount = 0;
        this.isReconnecting = false;
    }

    isCurrentlyReconnecting() {
        return this.isReconnecting;
    }

    getCurrentRetryCount() {
        return this.retryCount;
    }

    async onDisable() {
        this.isReconnecting = false;
        this.retryCount = 0;
        this.logger.debug('Auto reconnect disabled');
    }
}

module.exports = AutoReconnect;
module.exports = AutoReconnect;
