interface ICommand {
    name: string;
    args: string[];
    execute(): CommandResult;
}

abstract class Command implements ICommand {
    constructor(
        public name: string,
        public args: string[],
    ) {}
    abstract execute(): CommandResult;
}

class CommandResult {
    private _error: string | null;
    private _clearHistory: boolean;
    private _output: string;

    constructor(error: string | null = null, clearHistory: boolean = false, output: string = "") {
        this._error = error;
        this._clearHistory = clearHistory;
        this._output = output;
    }

    get error(): string | null {
        return this._error;
    }

    get clear(): boolean {
        return this._clearHistory;
    }

    get output(): string {
        return this._output;
    }

    get hasError(): boolean {
        return this.error !== null;
    }
}

class EmptyCommand extends Command {
    execute(): CommandResult {
        return new CommandResult(null, false);
    }
}

class ClearCommand extends Command {
    execute(): CommandResult {
        return new CommandResult(null, true);
    }
}

function parseCommand(line: string): ICommand {
    const [name, ...args] = line.split(" ");
    switch (name) {
        case "":
            return new EmptyCommand(name, args);
        case "clear":
            return new ClearCommand(name, args);
        default:
            throw new Error(`Unknown command: ${name}.`);
    }
}

export default function handleCommand(line: string): CommandResult {
    try {
        const command = parseCommand(line);
        return command.execute();
    } catch (error) {
        if (error instanceof Error) {
            return new CommandResult(error.message, false);
        } else {
            return new CommandResult("An unknown error occurred.", false);
        }
    }
}
